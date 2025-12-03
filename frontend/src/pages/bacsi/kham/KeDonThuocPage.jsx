import React, { useEffect, useState } from "react";
// SỬA 1: Dùng axiosClient trực tiếp để có thể cấu hình header cho FormData
import axiosClient from "../../../api/axiosClient";
import { getAllThuoc } from "../../../services/donthuoc/thuocService";
import { getPhieuByBacSi } from "../../../services/kham/phieukhamService";
import dayjs from "dayjs";
import toast from "react-hot-toast";

const KeDonThuocPage = () => {
    const [thuocs, setThuocs] = useState([]);
    const [thuocDaThem, setThuocDaThem] = useState([]);
    const [phieuKhamList, setPhieuKhamList] = useState([]);
    const [maBS, setMaBS] = useState("");

    const [formDon, setFormDon] = useState({
        maPK: "",
        // XÓA TRƯỜNG FILE BASE64
    });
    
    // SỬA 2: Thêm state cho File Object và URL xem trước
    const [selectedFile, setSelectedFile] = useState(null); 
    const [fileName, setFileName] = useState(""); 
    const [previewUrl, setPreviewUrl] = useState(""); 

    const [formChiTiet, setFormChiTiet] = useState({
        maThuoc: "",
        tenThuoc: "", 
        soLuong: "",
        lieuDung: "",
    });

    useEffect(() => {
        fetchThuoc();
        fetchMaBS();
    }, []);

    useEffect(() => {
        if (maBS) {
            fetchPhieuKham(maBS);
        }
    }, [maBS]);

    const fetchThuoc = async () => {
        try {
            // SỬA 3: Dùng axiosClient.get("/thuoc") thay vì getAllThuoc() từ service cũ đã bị xóa
            const res = await axiosClient.get("/thuoc");
            setThuocs(res.data.data || []);
        } catch (error) {
            toast.error("❌ Lỗi tải danh sách thuốc");
        }
    };

    const fetchMaBS = () => {
        const maTK = localStorage.getItem("maTK");
        if (maTK) {
            setMaBS(maTK);
        } else {
            toast.error("❌ Không lấy được mã bác sĩ từ tài khoản.");
        }
    };

    const fetchPhieuKham = async (maBS) => {
        try {
            const res = await getPhieuByBacSi(maBS);
            setPhieuKhamList(res.data.data || []);
        } catch {
            toast.error("❌ Lỗi tải danh sách phiếu khám");
        }
    };

    const handleChange = (e) => {
        if (e.target.name === 'maPK') {
            setFormDon({ ...formDon, maPK: e.target.value });
            setThuocDaThem([]); // Reset danh sách thuốc khi đổi phiếu khám
        } else {
            setFormDon({ ...formDon, [e.target.name]: e.target.value });
        }
    };

    const handleChangeChiTiet = (e) => {
        const { name, value } = e.target;
        
        if (name === "maThuoc") {
            const selectedThuoc = thuocs.find(t => t.maThuoc === value);
            setFormChiTiet({ 
                ...formChiTiet, 
                maThuoc: value,
                tenThuoc: selectedThuoc ? selectedThuoc.tenThuoc : ""
            });
        } else {
            setFormChiTiet({ ...formChiTiet, [name]: value });
        }
    };
    
    // SỬA 4: Hàm xử lý chọn file (chỉ lưu File Object và URL xem trước)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            setSelectedFile(file); 
            setPreviewUrl(URL.createObjectURL(file)); // Tạo URL xem trước
        } else {
            setFileName("");
            setSelectedFile(null);
            setPreviewUrl(""); 
        }
    };
    
    const handleStageThuoc = () => {
        const { maThuoc, tenThuoc, soLuong, lieuDung } = formChiTiet;
        if (!maThuoc || !soLuong || !lieuDung)
            return toast.error("Thiếu dữ liệu kê thuốc");

        setThuocDaThem([...thuocDaThem, { maThuoc, tenThuoc, soLuong, lieuDung }]);
        
        setFormChiTiet({ maThuoc: "", tenThuoc: "", soLuong: "", lieuDung: "" });
    };
    
    const handleRemoveThuoc = (indexToRemove) => {
        setThuocDaThem(thuocDaThem.filter((_, index) => index !== indexToRemove));
    };

    // SỬA 5: Hàm lưu tất cả (Sử dụng FormData)
    const handleSaveAll = async () => {
        const { maPK } = formDon; 
        if (!maPK) return toast.error("Vui lòng chọn phiếu khám");
        if (thuocDaThem.length === 0) return toast.error("Vui lòng thêm ít nhất 1 loại thuốc");
        if (!maBS) return toast.error("Lỗi mã bác sĩ, vui lòng tải lại trang");

        // Gói dữ liệu
        const formData = new FormData();
        formData.append("maPK", maPK);
        // Backend mong đợi chiTietList là chuỗi JSON
        formData.append("chiTietList", JSON.stringify(thuocDaThem)); 
        
        // Nếu có file, thêm file vào FormData
        if (selectedFile) {
            formData.append("file", selectedFile); 
        }

        try {
            // Gửi FormData (axiosClient sẽ tự thêm token)
            const res = await axiosClient.post("/donthuoc", formData, {
                headers: {
                    // Cần thiết để Multer hoạt động
                    'Content-Type': 'multipart/form-data', 
                },
            });

            toast.success("✅ Đã tạo đơn thuốc hoàn chỉnh trên Blockchain!");
            
            // Reset form
            setFormDon({ maPK: "" }); 
            setThuocDaThem([]);
            setFormChiTiet({ maThuoc: "", tenThuoc: "", soLuong: "", lieuDung: "" });
            setFileName("");
            setSelectedFile(null);
            setPreviewUrl("");

        } catch (error) {
            console.error("❌ Lỗi khi tạo đơn thuốc hoàn chỉnh:", error);
            toast.error("❌ Lỗi khi lưu đơn thuốc: " + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-2xl font-bold text-blue-700">💊 Kê đơn thuốc</h1>

            {/* Chọn Phiếu khám & Upload File */}
            <div className="bg-white p-4 rounded shadow-md grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chọn Phiếu Khám cần kê đơn
                    </label>
                    <select
                        name="maPK"
                        value={formDon.maPK}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 rounded w-full"
                    >
                        <option value="">-- Chọn Phiếu Khám --</option>
                        {phieuKhamList.map((pk) => (
                            <option key={pk.maPK} value={pk.maPK}>
                                {pk.maPK} (BN: {pk.maBN} - Ngày: {dayjs(pk.ngayKham).format("DD/MM/YYYY")})
                            </option>
                        ))}
                    </select>
                </div>
                
                {/* SỬA 6: Input File và Xem trước */}
                <div>
                    <label htmlFor="file-upload-dt" className="block text-sm font-medium text-gray-700 mb-1">
                        Tải ảnh đơn thuốc (Tùy chọn)
                    </label>
                    <input
                        id="file-upload-dt"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {fileName && <p className="text-xs text-green-600 mt-1">Đã chọn: {fileName}</p>}
                    
                    {previewUrl && (
                        <div className="mt-2 border p-2 rounded max-w-[150px]">
                            <img src={previewUrl} alt="Xem trước" className="w-full h-auto object-cover" />
                            <p className="text-xs text-center text-gray-500">Xem trước</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Thêm thuốc và Lưu */}
            {formDon.maPK && (
                <>
                    {/* Thêm thuốc vào đơn */}
                    <div className="bg-white p-4 rounded shadow-md grid grid-cols-1 md:grid-cols-6 gap-4">
                        {/* ... (Giữ nguyên phần nhập chi tiết thuốc) */}
                        <select
                            name="maThuoc"
                            value={formChiTiet.maThuoc}
                            onChange={handleChangeChiTiet}
                            className="border border-gray-300 p-2 rounded col-span-2"
                        >
                            <option value="">-- Chọn thuốc --</option>
                            {thuocs.map((t) => (
                                <option key={t.maThuoc} value={t.maThuoc}>
                                    {t.tenThuoc}
                                </option>
                            ))}
                        </select>
                        <input
                            name="soLuong"
                            type="number"
                            value={formChiTiet.soLuong}
                            onChange={handleChangeChiTiet}
                            placeholder="Số lượng"
                            className="border border-gray-300 p-2 rounded"
                        />
                        <input
                            name="lieuDung"
                            value={formChiTiet.lieuDung}
                            onChange={handleChangeChiTiet}
                            placeholder="Liều dùng"
                            className="border border-gray-300 p-2 rounded col-span-2"
                        />
                        <div className="md:col-span-1">
                            <button
                                type="button"
                                onClick={handleStageThuoc} 
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
                            >
                                ➕ Thêm
                            </button>
                        </div>
                    </div>

                    {/* Bảng chi tiết đơn thuốc (đang soạn) */}
                    {thuocDaThem.length > 0 && (
                        <div className="bg-white rounded shadow-md overflow-x-auto">
                            <h3 className="text-lg font-semibold p-4">Chi tiết đơn thuốc (đang soạn)</h3>
                            <table className="min-w-full text-sm table-auto">
                                <thead className="bg-gray-100 text-left">
                                    <tr>
                                        <th className="px-4 py-2">Tên thuốc</th>
                                        <th className="px-4 py-2">Số lượng</th>
                                        <th className="px-4 py-2">Liều dùng</th>
                                        <th className="px-4 py-2">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {thuocDaThem.map((ct, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="px-4 py-2">
                                                {ct.tenThuoc || ct.maThuoc} 
                                            </td>
                                            <td className="px-4 py-2">{ct.soLuong}</td>
                                            <td className="px-4 py-2">{ct.lieuDung}</td>
                                            <td className="px-4 py-2">
                                                <button 
                                                    onClick={() => handleRemoveThuoc(index)}
                                                    className="text-red-600 hover:text-red-800 text-xs"
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Nút lưu tổng */}
                    {thuocDaThem.length > 0 && (
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={handleSaveAll}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded shadow-lg"
                            >
                                ✅ Lưu Đơn Thuốc
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default KeDonThuocPage;
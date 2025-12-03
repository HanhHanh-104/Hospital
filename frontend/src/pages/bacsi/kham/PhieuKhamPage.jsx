import React, { useEffect, useState } from "react";
import {
  getPhieuByBacSi,
  createPhieuKham,
  deletePhieuKham, // Sẽ bị chặn bởi backend
} from "../../../services/kham/phieukhamService";
import axios from "../../../api/axiosClient";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import toast from "react-hot-toast"; // Thêm toast

dayjs.extend(utc);
dayjs.extend(timezone);

const PhieuKhamPage = () => {
  const maBS = localStorage.getItem("maTK"); // maBS = maTK
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    maHSBA: "",
    maBN: "",
    trieuChung: "",
    chuanDoan: "",
    loiDan: "",
  });
  
  // SỬA 1: Dùng File Object thay vì Base64
  const [selectedFile, setSelectedFile] = useState(null); 
  const [fileName, setFileName] = useState(""); 

  const [hoSoList, setHoSoList] = useState([]);
  const [benhNhanList, setBenhNhanList] = useState([]);
  // ---

  useEffect(() => {
    if (maBS) {
      loadData();
    }
  }, [maBS]);

  const loadData = async () => {
    setLoading(true);
    try {
      // API này (getByBacSi) đã được sửa ở backend để đọc từ blockchain
      const res = await getPhieuByBacSi(maBS); 
      // FIX: Sử dụng URL đầy đủ để xem file (nếu p.file là đường dẫn path)
      const formattedList = (res.data.data || []).map(p => ({
          ...p,
          file: p.file && p.file.startsWith('/uploads/') ? `http://localhost:4000${p.file}` : p.file
      }));
      setList(formattedList);
      
      const hs = await axios.get("/hsba");
      const bn = await axios.get("/benhnhan");
      
      setHoSoList(hs.data.data || []);
      setBenhNhanList(bn.data.data || []);
    } catch (err) {
      toast.error("Lỗi khi tải dữ liệu: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleHoSoChange = (e) => {
    const selectedMaHSBA = e.target.value;

    if (!selectedMaHSBA) {
      setForm({ ...form, maHSBA: "", maBN: "" });
      return;
    }

    const selectedHoSo = hoSoList.find(h => h.maHSBA === selectedMaHSBA);

    if (selectedHoSo) {
      setForm({
        ...form,
        maHSBA: selectedMaHSBA,
        maBN: selectedHoSo.maBN, 
      });
    }
  };

  // SỬA 2: Hàm xử lý chọn file (chỉ lưu đối tượng File)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file); // Lưu file object
    } else {
        setFileName("");
        setSelectedFile(null); // Reset file
    }
  };



  const handleCreate = async () => {
    if (!form.maHSBA || !form.maBN || !form.trieuChung || !form.chuanDoan) {
      return toast.error("Vui lòng điền đủ thông tin (HSBA, Triệu chứng, Chẩn đoán).");
    }
    

    const formData = new FormData();
    formData.append("maHSBA", form.maHSBA);
    formData.append("maBN", form.maBN);
    formData.append("maBS", maBS);
    formData.append("trieuChung", form.trieuChung);
    formData.append("chuanDoan", form.chuanDoan);
    formData.append("loiDan", form.loiDan);
    
    if (selectedFile) {
        formData.append("file", selectedFile);
    }

    try {
      // Gửi FormData
      await createPhieuKham(formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });
      toast.success("Đã lưu phiếu khám vào chuỗi khối!");
      
      // Reset form
      setForm({
        maHSBA: "",
        maBN: "",
        trieuChung: "",
        chuanDoan: "",
        loiDan: "",
      });
      setFileName("");
      setSelectedFile(null);
      
      await loadData();
      
    } catch(err) {
      toast.error("Lỗi khi lưu: " + (err.response?.data?.error || err.response?.data?.message || err.message));
    }
  };

 

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold text-blue-700">📋 Quản lý phiếu khám bệnh (Blockchain)</h2>

      {/* SỬA 4: Form gửi FormData (thêm onSubmit) */}
      <form onSubmit={(e) => {e.preventDefault(); handleCreate();}} className="grid grid-cols-1 md:grid-cols-6 gap-4 bg-white p-4 shadow rounded-lg">
        
        <select
          name="maHSBA"
          value={form.maHSBA}
          onChange={handleHoSoChange} 
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">-- Chọn hồ sơ --</option>
          {hoSoList.map((h) => (
            <option key={h.maHSBA} value={h.maHSBA}>
              {h.maHSBA} ({h.BenhNhan?.hoTen || h.maBN})
            </option>
          ))}
        </select>

        <select
          name="maBN"
          value={form.maBN}
          onChange={handleChange}
          disabled={true} 
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
        >
          <option value="">-- Bệnh nhân (tự động) --</option>
          {benhNhanList.map((bn) => (
            <option key={bn.maBN} value={bn.maBN}>{bn.hoTen}</option>
          ))}
        </select>

        <input
          name="trieuChung"
          value={form.trieuChung}
          onChange={handleChange}
          placeholder="Triệu chứng"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          name="chuanDoan"
          value={form.chuanDoan}
          onChange={handleChange}
          placeholder="Chẩn đoán"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          name="loiDan"
          value={form.loiDan}
          onChange={handleChange}
          placeholder="Lời dặn"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        
        {/* SỬA 5: Input file */}
        <div className="col-span-3">
             <label htmlFor="file-upload-pk" className="block text-sm font-medium text-gray-700 mb-1">
                 Tải ảnh đính kèm (Tùy chọn)
             </label>
             <input
                id="file-upload-pk"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {fileName && <p className="text-xs text-green-600 mt-1">Đã chọn: {fileName}</p>}
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow col-span-3"
        >
          ➕ Lưu
        </button>
      </form>

      {/* Danh sách */}
      <div className="overflow-auto bg-white shadow rounded-lg">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : list.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg">Chưa có phiếu khám nào.</p>
            <p className="text-sm mt-2">Vui lòng tạo phiếu khám mới ở trên.</p>
          </div>
        ) : (
          <table className="min-w-full text-sm table-auto">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2">Mã PK</th>
                <th className="px-4 py-2">HSBA</th>
                <th className="px-4 py-2">Bệnh nhân</th>
                <th className="px-4 py-2">Triệu chứng</th>
                <th className="px-4 py-2">Chẩn đoán</th>
                <th className="px-4 py-2">Lời dặn</th>
                <th className="px-4 py-2">Trạng thái</th>
                <th className="px-4 py-2">Ngày</th>
                <th className="px-4 py-2">File</th>
                <th className="px-4 py-2 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.maPK} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{p.maPK}</td>
                  <td className="px-4 py-2">{p.maHSBA}</td>
                  <td className="px-4 py-2">
                    {benhNhanList.find(bn => bn.maBN === p.maBN)?.hoTen || p.maBN}
                  </td>
                  <td className="px-4 py-2">{p.trieuChung}</td>
                  <td className="px-4 py-2">{p.chuanDoan}</td>
                  <td className="px-4 py-2">{p.loiDan}</td>
                  <td className="px-4 py-2">{p.trangThai}</td>
                  <td className="px-4 py-2">
                    {/* Dữ liệu 'ngayKham' giờ là timestamp của khối */}
                    {dayjs(p.ngayKham).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm")}
                  </td>
                  <td className="px-4 py-2">
                    {/* SỬA 6: Hiển thị file dưới dạng URL Path */}
                    {p.file ? <a href={p.file} target="_blank" className="text-blue-600 hover:underline">Xem file</a> : "-"}
                  </td>
                  <td className="px-4 py-2 space-x-2 text-center">
                    <button
                      onClick={() => toast.error("Không thể SỬA khối đã lưu trên Blockchain!")}
                      className="text-gray-400 cursor-not-allowed"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(p.maPK)}
                      className="text-red-600 hover:underline"
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PhieuKhamPage;
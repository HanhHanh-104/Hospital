import React, { useEffect, useState } from "react";
import {
  getAllPhieu,
  createPhieu,
  // updatePhieu, // Sửa: Không cần hàm này nữa
  deletePhieu,
} from "../../../services/nhansu/xetnghiem/phieuxetnghiemService";
import axios from "../../../api/axiosClient";
import toast from "react-hot-toast"; // Thêm toast

const PhieuXetNghiemPage = () => {
  const [list, setList] = useState([]);

  const todayVN = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
  });

  const [form, setForm] = useState({
    maYeuCau: "",
    maXN: "",
    maHSBA: "",
    ngayThucHien: todayVN,
    ghiChu: "",
    ketQua: "", 
  });
  
  // SỬA 1: Dùng File Object thay vì Base64
  const [selectedFile, setSelectedFile] = useState(null); 
  const [fileName, setFileName] = useState(""); 

  const maNS = localStorage.getItem("maTK");
  const [dsYeuCau, setDsYeuCau] = useState([]);
  const [dsXN, setDsXN] = useState([]);
  const [dsHSBA, setDsHSBA] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await getAllPhieu();
    // FIX: Sử dụng URL đầy đủ để xem file (nếu p.file là đường dẫn path)
    const formattedList = (res.data.data || []).map(p => ({
        ...p,
        file: p.file && p.file.startsWith('/uploads/') ? `http://localhost:4000${p.file}` : p.file
    }));
    setList(formattedList);

    const [yc, xn, hs] = await Promise.all([
      axios.get("/yeucauxetnghiem"),
      axios.get("/xetnghiem"),
      axios.get("/hsba"),
    ]);

    setDsYeuCau(yc.data.data || []);
    setDsXN(xn.data.data || []);
    setDsHSBA(hs.data.data || []);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  // SỬA 2: Xử lý chọn file (chỉ lưu đối tượng File)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file); // Lưu file object
    } else {
        setFileName("");
        setSelectedFile(null);
    }
  };

  // SỬA 3: Cập nhật hàm Create để gửi FormData
  const handleCreate = async () => {
    if (!form.maYeuCau || !form.maXN || !form.maHSBA || !form.ketQua) {
      toast.error("Vui lòng nhập đủ thông tin (Yêu cầu, XN, HSBA, Kết quả).");
      return;
    }
    
    // TẠO FORM DATA
    const formData = new FormData();
    formData.append("maYeuCau", form.maYeuCau);
    formData.append("maXN", form.maXN);
    formData.append("maHSBA", form.maHSBA);
    formData.append("ngayThucHien", form.ngayThucHien);
    formData.append("ghiChu", form.ghiChu);
    formData.append("ketQua", form.ketQua);
    formData.append("maNS", maNS); // Gửi thêm maNS
    
    if (selectedFile) {
        formData.append("file", selectedFile); // Tên trường "file"
    }

    try {
      // Gửi FormData với header multipart/form-data
      await createPhieu(formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });
      
      toast.success("Đã lưu phiếu xét nghiệm hoàn chỉnh!");
      loadData();
      // Reset form
      setForm({ 
        maYeuCau: "", 
        maXN: "", 
        maHSBA: "", 
        ngayThucHien: todayVN, 
        ghiChu: "", 
        ketQua: "",
      });
      setFileName("");
      setSelectedFile(null); 
      
    } catch (err) {
      toast.error("Lỗi khi lưu: " + (err.response?.data?.message || err.message));
    }
  };

  // ... (hàm handleDelete giữ nguyên)

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold text-blue-700">📋 Phiếu xét nghiệm (Nhân viên XN)</h2>

      {/* SỬA 4: Form gửi FormData (thêm onSubmit) */}
      <form onSubmit={(e) => {e.preventDefault(); handleCreate();}} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 shadow rounded">
        {/* ... (các select và input giữ nguyên) */}
        
        <select name="maYeuCau" value={form.maYeuCau} onChange={handleChange} className="input">
          <option value="">-- Chọn yêu cầu --</option>
          {dsYeuCau.map((y) => (
            <option key={y.maYeuCau} value={y.maYeuCau}>{y.maYeuCau} (BN: {y.maBN})</option>
          ))}
        </select>
        <select name="maXN" value={form.maXN} onChange={handleChange} className="input">
          <option value="">-- Chọn xét nghiệm --</option>
          {dsXN.map((x) => (
            <option key={x.maXN} value={x.maXN}>{x.tenXN}</option>
          ))}
        </select>
        <select name="maHSBA" value={form.maHSBA} onChange={handleChange} className="input">
          <option value="">-- Chọn hồ sơ bệnh án --</option>
          {dsHSBA.map((h) => (
            <option key={h.maHSBA} value={h.maHSBA}>{h.maHSBA}</option>
          ))}
        </select>
        <input
          type="date"
          name="ngayThucHien"
          value={form.ngayThucHien}
          onChange={handleChange}
          className="input"
        />

        <textarea
          name="ketQua"
          value={form.ketQua}
          onChange={handleChange}
          placeholder="Kết quả xét nghiệm"
          className="input col-span-2"
          rows={2}
          required
        />
        
        <textarea
          name="ghiChu"
          value={form.ghiChu}
          onChange={handleChange}
          placeholder="Ghi chú"
          className="input col-span-2"
          rows={2}
        />
        
        {/* SỬA 5: Input File */}
        <div className="col-span-2">
             <label htmlFor="file-upload-xn" className="block text-sm font-medium text-gray-700 mb-1">
                 Tải ảnh kết quả (Tùy chọn)
             </label>
             <input
                id="file-upload-xn"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {fileName && <p className="text-xs text-green-600 mt-1">Đã chọn: {fileName}</p>}
        </div>
        
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded col-span-2"
        >
          ➕ Lưu Phiếu Hoàn Chỉnh (Ghi 1 lần)
        </button>
      </form>

      {/* SỬA 6: Cập nhật Bảng (Hiển thị file dưới dạng URL) */}
      <table className="min-w-full text-sm border bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Mã</th>
            <th className="p-2">Yêu cầu</th>
            <th className="p-2">Xét nghiệm</th>
            <th className="p-2">HSBA</th>
            <th className="p-2">Ngày</th>
            <th className="p-2">Kết quả</th>
            <th className="p-2">File</th> 
            <th className="p-2">Ghi chú</th>
            <th className="p-2">Người nhập</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {list.map((p) => (
            <tr key={p.maPhieuXN} className="border-t">
              <td className="p-2">{p.maPhieuXN}</td>
              <td className="p-2">{p.maYeuCau}</td>
              <td className="p-2">{p.XetNghiem?.tenXN}</td>
              <td className="p-2">{p.maHSBA}</td>
              <td className="p-2">{p.ngayThucHien}</td>
              <td className="p-2">{p.ketQua || "-"}</td>
              <td className="p-2">
                {/* HIỂN THỊ FILE */}
                {p.file ? <a href={p.file} target="_blank" className="text-blue-600 hover:underline">Xem file</a> : "-"}
              </td> 
              <td className="p-2">{p.ghiChu || "-"}</td>
              <td className="p-2">{p.NhanSuYTe?.hoTen}</td>
              <td className="p-2">
                <button onClick={() => handleDelete(p.maPhieuXN)} className="text-red-600 hover:underline">Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PhieuXetNghiemPage;
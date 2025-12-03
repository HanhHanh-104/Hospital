import React, { useEffect, useState } from "react";
import {
  getAllLichHen,
  createLichHen,
  updateLichHen,
  deleteLichHen,
} from "../../../services/nhansu/tiepnhan/lichHenService";
import axios from "../../../api/axiosClient";

const LichHenPage = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    maBN: "",
    maBS: "",
    ngayKham: "",
    gioKham: "",
    phong: "",
    ghiChu: "",
  });
  const [benhNhanList, setBenhNhanList] = useState([]);
  const [bacSiList, setBacSiList] = useState([]);

  useEffect(() => {
    fetchData();
    fetchOptions();
    setNowVietnamTime();
  }, []);

  const fetchData = async () => {
    const res = await getAllLichHen();
    // Giả định rằng API trả về thông tin Bác sĩ và Bệnh nhân đã join
    setList(res.data.data || []);
  };

  const fetchOptions = async () => {
    const [bn, bs] = await Promise.all([
      axios.get("/benhnhan"),
      axios.get("/bacsi"),
    ]);
    setBenhNhanList(bn.data.data || []);
    setBacSiList(bs.data.data || []);
  };

  const setNowVietnamTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 7);
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().slice(0, 5);

    setForm((prev) => ({
      ...prev,
      ngayKham: date,
      gioKham: time,
    }));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    // Lưu ý: Logic create này đơn giản, không bao gồm kiểm tra trùng lịch phức tạp
    // Nếu muốn sử dụng logic tự động sắp xếp/kiểm tra, nên dùng DangKyKham_NSPage.jsx
    await createLichHen(form);
    fetchData();
    setNowVietnamTime();
    setForm((prev) => ({
      ...prev,
      maBN: "",
      maBS: "",
      phong: "",
      ghiChu: "",
    }));
  };

  // ======================================================
  // ✅ SỬA HÀM HANDLE UPDATE (CHỈ SỬA PHÒNG)
  // ======================================================
  const handleUpdate = async (lich) => {
    // 1. Chỉ hỏi người dùng về Phòng khám mới
    const phongMoi = prompt("Nhập Phòng khám mới:", lich.phong || "");
    
    // 2. Nếu người dùng nhập và xác nhận
    if (phongMoi !== null) {
      // 3. Gửi PUT request chỉ với trường PHÒNG đã thay đổi
      try {
        await updateLichHen(lich.maLich, { 
          // Giữ nguyên các trường khác
          ngayKham: lich.ngayKham, 
          gioKham: lich.gioKham, 
          ghiChu: lich.ghiChu,
          // Cập nhật Phòng
          phong: phongMoi
        });
        alert(`✅ Đã cập nhật Phòng khám cho lịch ${lich.maLich} thành: ${phongMoi}`);
        
        // 4. Cập nhật lại danh sách để hiển thị thay đổi
        fetchData(); 
      } catch (error) {
        console.error("Lỗi cập nhật lịch:", error);
        alert("❌ Lỗi cập nhật phòng khám.");
      }
    }
  };
  // ======================================================

  const handleDelete = async (id) => {
    if (window.confirm("Xoá lịch này?")) {
      await deleteLichHen(id);
      fetchData();
    }
  };

  // Helper để tìm tên từ danh sách
  const getHoTen = (ma, list) => list.find(item => item.maBS === ma || item.maBN === ma)?.hoTen || ma;

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-blue-700">📅 Quản lý lịch hẹn khám</h2>

      {/* Form đặt lịch */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 bg-white p-6 rounded-xl shadow">
        <select name="maBN" value={form.maBN} onChange={handleChange} className="border rounded p-2 col-span-2">
          <option value="">-- Chọn bệnh nhân --</option>
          {benhNhanList.map((bn) => (
            <option key={bn.maBN} value={bn.maBN}>{bn.hoTen}</option>
          ))}
        </select>
        <select name="maBS" value={form.maBS} onChange={handleChange} className="border rounded p-2 col-span-2">
          <option value="">-- Chọn bác sĩ --</option>
          {bacSiList.map((bs) => (
            <option key={bs.maBS} value={bs.maBS}>{bs.hoTen}</option>
          ))}
        </select>
        <input type="date" name="ngayKham" value={form.ngayKham} onChange={handleChange} className="border rounded p-2" />
        <input type="time" name="gioKham" value={form.gioKham} onChange={handleChange} className="border rounded p-2" />
        <input name="phong" placeholder="Phòng" value={form.phong} onChange={handleChange} className="border rounded p-2 col-span-2" />
        <textarea name="ghiChu" placeholder="Ghi chú" value={form.ghiChu} onChange={handleChange} className="border rounded p-2 col-span-6 h-20" />
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white rounded p-2 font-semibold col-span-6 hover:bg-blue-700"
        >
          ➕ Đặt lịch
        </button>
      </div>

      {/* Danh sách lịch hẹn */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="p-3">Mã lịch</th>
              <th className="p-3">Bệnh nhân</th>
              <th className="p-3">Bác sĩ</th>
              <th className="p-3">Ngày</th>
              <th className="p-3">Giờ</th>
              <th className="p-3">Phòng</th>
              <th className="p-3">Ghi chú</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {list.map((lich) => (
              <tr key={lich.maLich} className="border-t">
                <td className="p-3">{lich.maLich}</td>
                {/* Dùng helper để tìm tên nếu không có join */}
                <td className="p-3">{lich.BenhNhan?.hoTen || getHoTen(lich.maBN, benhNhanList)}</td>
                <td className="p-3">{lich.BacSi?.hoTen || getHoTen(lich.maBS, bacSiList)}</td>
                <td className="p-3">{lich.ngayKham}</td>
                <td className="p-3">{lich.gioKham}</td>
                <td className="p-3">{lich.phong || "-"}</td> 
                <td className="p-3">{lich.ghiChu}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleUpdate(lich)}
                    className="text-green-600 hover:underline"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(lich.maLich)}
                    className="text-red-600 hover:underline"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LichHenPage;
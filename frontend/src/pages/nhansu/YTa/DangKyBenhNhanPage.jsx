import React, { useState } from "react";
import { dangKyBenhNhan } from "../../../services/nhansu/YTa/taikhoanService";

const DangKyBenhNhanPage = () => {
  const [form, setForm] = useState({
    tenDangNhap: "",
    matKhau: "",
    email: "",
    hoTen: "",
    ngaySinh: "",
    gioiTinh: "",
    diaChi: "",
    soDienThoai: "",
    bhyt: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const body = {
        ...form,
        maNhom: "BENHNHAN",
      };
      await dangKyBenhNhan(body);
      alert("✅ Đăng ký thành công!");
      setForm({
        tenDangNhap: "",
        matKhau: "",
        email: "",
        hoTen: "",
        ngaySinh: "",
        gioiTinh: "",
        diaChi: "",
        soDienThoai: "",
        bhyt: "",
      });
    } catch (err) {
      alert("❌ Đăng ký thất bại: " + err.response?.data?.message);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold text-blue-700">🩺 Đăng ký bệnh nhân mới</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="tenDangNhap" value={form.tenDangNhap} onChange={handleChange} placeholder="Tên đăng nhập" className="input" />
        <input type="password" name="matKhau" value={form.matKhau} onChange={handleChange} placeholder="Mật khẩu" className="input" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="input" />
        <input name="hoTen" value={form.hoTen} onChange={handleChange} placeholder="Họ tên" className="input" />
        <input type="date" name="ngaySinh" value={form.ngaySinh} onChange={handleChange} className="input" />
        <select name="gioiTinh" value={form.gioiTinh} onChange={handleChange} className="input">
          <option value="">-- Chọn giới tính --</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
        <input name="soDienThoai" value={form.soDienThoai} onChange={handleChange} placeholder="Số điện thoại" className="input" />
        <input name="bhyt" value={form.bhyt} onChange={handleChange} placeholder="Mã BHYT" className="input" />
        <textarea name="diaChi" value={form.diaChi} onChange={handleChange} placeholder="Địa chỉ" className="input col-span-2" />
      </div>

      <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded">
        ➕ Tạo hồ sơ
      </button>
    </div>
  );
};

export default DangKyBenhNhanPage;

import React, { useEffect, useState } from "react";
import {
  getAllPhieu,
  createPhieu,
  deletePhieu,
} from "../../../services/xetnghiem/phieuxetnghiemService";
import axios from "../../../api/axiosClient";

// Hàm lấy giờ GMT+7 cho input datetime-local
const getTodayVN = () => {
  const now = new Date();
  now.setHours(now.getHours() + 7);
  return now.toISOString().slice(0, 16);
};

// Hàm hiển thị định dạng giờ Việt Nam
const formatVNTime = (utcStr) => {
  return new Date(utcStr).toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const PhieuXetNghiemPage = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    maYeuCau: "",
    maXN: "",
    maNS: "",
    maHSBA: "",
    ngayThucHien: getTodayVN(),
    ghiChu: "",
  });

  const [yeuCauList, setYeuCauList] = useState([]);
  const [xetNghiemList, setXetNghiemList] = useState([]);
  const [nhanSuList, setNhanSuList] = useState([]);
  const [hoSoList, setHoSoList] = useState([]);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const res = await getAllPhieu();
    setList(res.data.data || []);
    const [yc, xn, ns, hs] = await Promise.all([
      axios.get("/yeucauxetnghiem"),
      axios.get("/xetnghiem"),
      axios.get("/nhansu"),
      axios.get("/hsba"),
    ]);
    setYeuCauList(yc.data.data || []);
    setXetNghiemList(xn.data.data || []);
    setNhanSuList(ns.data.data || []);
    setHoSoList(hs.data.data || []);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    await createPhieu(form);
    loadAll();
    setForm({
      maYeuCau: "",
      maXN: "",
      maNS: "",
      maHSBA: "",
      ngayThucHien: getTodayVN(),
      ghiChu: "",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá?")) {
      await deletePhieu(id);
      loadAll();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-blue-700">📄 Quản lý phiếu xét nghiệm</h2>

      {/* Form tạo phiếu */}
      <div className="bg-white p-6 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <select name="maYeuCau" value={form.maYeuCau} onChange={handleChange}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">-- Chọn yêu cầu --</option>
          {yeuCauList.map((item) => (
            <option key={item.maYeuCau} value={item.maYeuCau}>{item.maYeuCau}</option>
          ))}
        </select>

        <select name="maXN" value={form.maXN} onChange={handleChange}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">-- Chọn xét nghiệm --</option>
          {xetNghiemList.map((item) => (
            <option key={item.maXN} value={item.maXN}>{item.tenXN}</option>
          ))}
        </select>

        <select name="maNS" value={form.maNS} onChange={handleChange}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">-- Chọn nhân sự --</option>
          {nhanSuList.map((item) => (
            <option key={item.maNS} value={item.maNS}>{item.hoTen}</option>
          ))}
        </select>

        <select name="maHSBA" value={form.maHSBA} onChange={handleChange}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">-- Chọn hồ sơ bệnh án --</option>
          {hoSoList.map((item) => (
            <option key={item.maHSBA} value={item.maHSBA}>{item.maHSBA}</option>
          ))}
        </select>

        <input
          type="datetime-local"
          name="ngayThucHien"
          value={form.ngayThucHien}
          onChange={handleChange}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-2"
        />

        <textarea
          name="ghiChu"
          value={form.ghiChu}
          onChange={handleChange}
          placeholder="Ghi chú"
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-2"
        />

        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded col-span-2 transition">
          ➕ Tạo phiếu
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border shadow-md rounded-lg text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Mã phiếu</th>
              <th className="p-3">Yêu cầu</th>
              <th className="p-3">Xét nghiệm</th>
              <th className="p-3">Nhân sự</th>
              <th className="p-3">HSBA</th>
              <th className="p-3">Ngày</th>
              <th className="p-3">Kết quả</th>
              <th className="p-3">Ghi chú</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.maPhieuXN} className="border-t hover:bg-gray-50">
                <td className="p-3">{p.maPhieuXN}</td>
                <td className="p-3">{p.maYeuCau}</td>
                <td className="p-3">{p.XetNghiem?.tenXN}</td>
                <td className="p-3">{p.NhanSuYTe?.hoTen}</td>
                <td className="p-3">{p.maHSBA}</td>
                <td className="p-3">{formatVNTime(p.ngayThucHien)}</td>
                <td className="p-3">{p.ketQua || "-"}</td>
                <td className="p-3">{p.ghiChu || "-"}</td>
                <td className="p-3">
                  <button onClick={() => handleDelete(p.maPhieuXN)}
                    className="text-red-600 hover:underline">
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

export default PhieuXetNghiemPage;

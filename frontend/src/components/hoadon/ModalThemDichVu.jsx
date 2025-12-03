import React, { useEffect, useState } from "react";
import { addChiTietHD } from "../../services/hoadon/hoadonService";
import axios from "../../api/axiosClient";

const ModalThemDichVu = ({ maHD, onClose }) => {
  const [form, setForm] = useState({});
  const [danhSachDichVu, setDanhSachDichVu] = useState([]);

  useEffect(() => {
    if (form.loaiDichVu === "XetNghiem") {
      axios.get("/xetnghiem").then((res) => setDanhSachDichVu(res.data.data || []));
    } else if (form.loaiDichVu === "Kham") {
      axios.get("/kham").then((res) => setDanhSachDichVu(res.data.data || []));
    } else {
      setDanhSachDichVu([]);
    }
  }, [form.loaiDichVu]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!form.loaiDichVu || !form.maDichVu) {
      alert("❌ Vui lòng chọn loại và mã dịch vụ.");
      return;
    }
    await addChiTietHD({ maHD, loaiDichVu: form.loaiDichVu, maDichVu: form.maDichVu });
    alert("✔ Đã thêm dịch vụ vào hóa đơn");
    setForm({});
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl space-y-4 shadow-xl">
        <h3 className="text-blue-700 font-bold text-lg">➕ Thêm dịch vụ vào: {maHD}</h3>
        <div className="grid grid-cols-2 gap-4">
          <select
            name="loaiDichVu"
            value={form.loaiDichVu || ""}
            onChange={handleChange}
            className="border px-2 py-1 rounded"
          >
            <option value="">-- Loại dịch vụ --</option>
            <option value="XetNghiem">Xét nghiệm</option>
            <option value="Kham">Khám</option>
          </select>

          <select
            name="maDichVu"
            value={form.maDichVu || ""}
            onChange={handleChange}
            className="border px-2 py-1 rounded"
          >
            <option value="">-- Mã dịch vụ --</option>
            {danhSachDichVu.map((dv, idx) => (
              <option key={idx} value={dv.maXN || dv.maKham}>
                {(dv.maXN || dv.maKham)} - {(dv.tenXN || dv.tenKham)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
            Đóng
          </button>
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
            Thêm dịch vụ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalThemDichVu;

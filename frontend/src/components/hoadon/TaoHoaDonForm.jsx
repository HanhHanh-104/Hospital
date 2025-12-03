import React, { useState } from "react";
import { createHoaDon } from "../../services/hoadon/hoadonService";

const TaoHoaDonForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    maBN: "",
    maNS: "",
    tongTien: "",
    trangThai: "Chưa thanh toán",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    await createHoaDon({ ...form, trangThai: "Chưa thanh toán" });
    setForm({ maBN: "", maNS: "", tongTien: "", trangThai: "Chưa thanh toán" });
    onSuccess();
  };

  return (
    <section className="space-y-4">
      <h3 className="font-semibold text-blue-700 text-lg">➕ Tạo hóa đơn mới</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <input
          name="maBN"
          value={form.maBN}
          onChange={handleChange}
          placeholder="Mã BN"
          className="border px-2 py-1 rounded"
        />
        <input
          name="maNS"
          value={form.maNS}
          onChange={handleChange}
          placeholder="Mã nhân sự"
          className="border px-2 py-1 rounded"
        />
        <input
          name="tongTien"
          type="number"
          value={form.tongTien}
          onChange={handleChange}
          placeholder="Tổng tiền"
          className="border px-2 py-1 rounded"
        />
        <input
          disabled
          value="Chưa thanh toán"
          className="border px-2 py-1 rounded bg-gray-100"
        />
      </div>
      <button
        onClick={handleCreate}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
      >
        💾 Lưu hóa đơn
      </button>
    </section>
  );
};

export default TaoHoaDonForm;

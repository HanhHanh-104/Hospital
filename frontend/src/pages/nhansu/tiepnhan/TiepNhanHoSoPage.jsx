import React, { useEffect, useState } from "react";
import { getAllHoSo, createHoSo, deleteHoSo } from "../../../services/nhansu/tiepnhan/hsbaService";
import axios from "../../../api/axiosClient";

const TiepNhanHoSoPage = () => {
  const [list, setList] = useState([]);
  const [benhNhanList, setBenhNhanList] = useState([]);
  const [form, setForm] = useState({
    maBN: "",
    dotKhamBenh: "",
    lichSuBenh: "",
    ghiChu: "",
  });

  useEffect(() => {
    fetchData();
    fetchBenhNhan();
  }, []);

  const fetchData = async () => {
    const res = await getAllHoSo();
    setList(res.data.data || []);
  };

  const fetchBenhNhan = async () => {
    const res = await axios.get("/benhnhan");
    setBenhNhanList(res.data.data || []);
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const yyyy = date.getFullYear();
    const mm = `${date.getMonth() + 1}`.padStart(2, "0");
    const dd = `${date.getDate()}`.padStart(2, "0");
    const hh = `${date.getHours()}`.padStart(2, "0");
    const min = `${date.getMinutes()}`.padStart(2, "0");
    const ss = `${date.getSeconds()}`.padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      const selectedDate = form.dotKhamBenh?.split("T")[0];

      const now = new Date();
      const vietnamTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
      const hh = vietnamTime.getHours().toString().padStart(2, "0");
      const mm = vietnamTime.getMinutes().toString().padStart(2, "0");

      const finalDateTime = `${selectedDate}T${hh}:${mm}`;
      const payload = {
        ...form,
        dotKhamBenh: new Date(finalDateTime).toISOString(),
      };

      await createHoSo(payload);
      fetchData();
      setForm({ maBN: "", dotKhamBenh: "", lichSuBenh: "", ghiChu: "" });
    } catch (error) {
      console.error("❌ Lỗi tạo hồ sơ:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá?")) {
      await deleteHoSo(id);
      fetchData();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-blue-700">📁 Tiếp nhận hồ sơ bệnh án</h2>

      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            name="maBN"
            value={form.maBN}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          >
            <option value="">-- Chọn bệnh nhân --</option>
            {benhNhanList.map((bn) => (
              <option key={bn.maBN} value={bn.maBN}>
                {bn.hoTen}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="dotKhamBenh"
            value={form.dotKhamBenh}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />

          <textarea
            name="lichSuBenh"
            value={form.lichSuBenh}
            onChange={handleChange}
            placeholder="Lịch sử bệnh"
            className="border rounded px-3 py-2"
          />

          <textarea
            name="ghiChu"
            value={form.ghiChu}
            onChange={handleChange}
            placeholder="Ghi chú"
            className="border rounded px-3 py-2"
          />
        </div>

        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
        >
          ➕ Tạo hồ sơ
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-blue-100 text-blue-700">
            <tr>
              <th className="p-2">Mã HSBA</th>
              <th className="p-2">Bệnh nhân</th>
              <th className="p-2">Đợt khám</th>
              <th className="p-2">Lịch sử bệnh</th>
              <th className="p-2">Ghi chú</th>
              <th className="p-2">Ngày lập</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {list.map((hs) => (
              <tr key={hs.maHSBA} className="border-t">
                <td className="p-2">{hs.maHSBA}</td>
                <td className="p-2">{hs.BenhNhan?.hoTen}</td>
                <td className="p-2">{formatDateTime(hs.dotKhamBenh)}</td>
                <td className="p-2">{hs.lichSuBenh}</td>
                <td className="p-2">{hs.ghiChu}</td>
                <td className="p-2">{formatDateTime(hs.ngayLap)}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(hs.maHSBA)}
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

export default TiepNhanHoSoPage;

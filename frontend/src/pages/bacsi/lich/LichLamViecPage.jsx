import React, { useEffect, useState } from "react";
import {
  getLichByBS,
  createLich,
  deleteLich,
} from "../../../services/lich/lichlamviecService";
import axios from "../../../api/axiosClient";

const LichLamViecPage = () => {
  const maBS = localStorage.getItem("maBS");

  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    maCa: "",
    ngayLamViec: "",
    maNS: "",
  });

  const [caList, setCaList] = useState([]);
  const [nhanSuList, setNhanSuList] = useState([]);

  useEffect(() => {
    const nowVN = new Date().toLocaleString("en-CA", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).split(",")[0];
    setForm((f) => ({ ...f, ngayLamViec: nowVN }));
  }, []);

  useEffect(() => {
    if (maBS) {
      fetchData();
    }
    fetchCaList();
    fetchNhanSuList();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getLichByBS(maBS);
      setList(res.data.data || []);
    } catch (err) {
      console.error("❌ Lỗi khi tải lịch làm việc:", err);
    }
  };

  const fetchCaList = async () => {
    const res = await axios.get("/catruc");
    setCaList(res.data.data || []);
  };

  const fetchNhanSuList = async () => {
    const res = await axios.get("/nhansu");
    setNhanSuList(res.data.data || []);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async () => {
    if (!form.maCa || !form.ngayLamViec || !form.maNS) {
      return alert("Vui lòng nhập đầy đủ thông tin");
    }

    await createLich({
      maCa: form.maCa,
      ngayLamViec: form.ngayLamViec,
      maNS: form.maNS,
      maBS: maBS,
    });

    fetchData();
    setForm((f) => ({ ...f, maCa: "", maNS: "" }));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xoá lịch này?")) {
      await deleteLich(id);
      fetchData();
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-blue-700">📅 Lịch làm việc cá nhân</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow">
        <select
          name="maCa"
          value={form.maCa}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="">-- Chọn ca trực --</option>
          {caList.map((ca) => (
            <option key={ca.maCa} value={ca.maCa}>
              {ca.maCa} - {ca.tenCa}
            </option>
          ))}
        </select>

        <select
          name="maNS"
          value={form.maNS}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="">-- Chọn nhân viên phụ trách --</option>
          {nhanSuList.map((ns) => (
            <option key={ns.maNS} value={ns.maNS}>
              {ns.maNS} - {ns.hoTen}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="ngayLamViec"
          value={form.ngayLamViec}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        />

        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition duration-200"
        >
          ➕ Thêm lịch
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm bg-white shadow rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-left text-gray-700">
            <tr>
              <th className="px-4 py-2">Mã lịch</th>
              <th className="px-4 py-2">Mã ca</th>
              <th className="px-4 py-2">Ngày</th>
              <th className="px-4 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {list.map((row) => (
              <tr key={row.maLichLV} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{row.maLichLV}</td>
                <td className="px-4 py-2">{row.maCa}</td>
                <td className="px-4 py-2">{row.ngayLamViec?.split("T")[0]}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(row.maLichLV)}
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

export default LichLamViecPage;

import React, { useEffect, useState } from "react";
import { getAllHoSo, ghiNhanTinhTrang } from "../../../services/nhansu/YTa/hosobenhan/hsbaService";

const GhiNhanTinhTrangPage = () => {
  const [list, setList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ lichSuBenh: "", ghiChu: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getAllHoSo();
    const formattedList = (res.data?.data || []).map((item) => ({
      ...item,
      dotKhamBenh: formatDateTime(item.dotKhamBenh),
      ngayLap: formatDateTime(item.ngayLap),
    }));
    setList(formattedList);
  };

  const formatDateTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
  };

  const handleEdit = (hsba) => {
    setEditId(hsba.maHSBA);
    setForm({ lichSuBenh: hsba.lichSuBenh || "", ghiChu: hsba.ghiChu || "" });
  };

  const handleSave = async () => {
    await ghiNhanTinhTrang(editId, form);
    fetchData();
    setEditId(null);
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ lichSuBenh: "", ghiChu: "" });
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-blue-700">📋 Ghi nhận tình trạng bệnh nhân (Y TÁ)</h2>

      <div className="overflow-auto rounded shadow border bg-white">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100">
            <tr className="border-b">
              <th className="p-2">Mã HSBA</th>
              <th className="p-2">Mã BN</th>
              <th className="p-2">Đợt khám</th>
              <th className="p-2">Lịch sử bệnh</th>
              <th className="p-2">Ghi chú</th>
              <th className="p-2">Ngày lập</th>
              <th className="p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.maHSBA} className="border-t hover:bg-gray-50">
                <td className="p-2">{item.maHSBA}</td>
                <td className="p-2">{item.maBN}</td>
                <td className="p-2">{item.dotKhamBenh}</td>
                <td className="p-2">
                  {editId === item.maHSBA ? (
                    <textarea
                      name="lichSuBenh"
                      value={form.lichSuBenh}
                      onChange={handleChange}
                      className="w-40 border p-1 rounded"
                    />
                  ) : (
                    item.lichSuBenh
                  )}
                </td>
                <td className="p-2">
                  {editId === item.maHSBA ? (
                    <textarea
                      name="ghiChu"
                      value={form.ghiChu}
                      onChange={handleChange}
                      className="w-40 border p-1 rounded"
                    />
                  ) : (
                    item.ghiChu
                  )}
                </td>
                <td className="p-2">{item.ngayLap}</td>
                <td className="p-2 space-x-2">
                  {editId === item.maHSBA ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="text-green-600 hover:underline font-medium"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-gray-600 hover:underline font-medium"
                      >
                        Huỷ
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Sửa
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GhiNhanTinhTrangPage;

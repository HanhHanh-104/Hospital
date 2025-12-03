import React, { useEffect, useState } from "react";
import {
  getAllYeuCau,
  updateTrangThai,
} from "../../../services/nhansu/xetnghiem/yeucauxetnghiemService";

const YeuCauXNTruocPage = () => {
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState("CHUA_THUC_HIEN");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getAllYeuCau();
    setList(res.data.data || []);
  };

  const handleXacNhan = async (id) => {
    await updateTrangThai(id, { trangThai: "DA_LAY_MAU" });
    fetchData();
  };

  const filteredList = list.filter((item) => item.trangThai === filter);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold text-blue-700">🧪 Xử lý yêu cầu xét nghiệm</h2>

      {/* Bộ lọc */}
      <div className="flex gap-4 items-center mb-2">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input">
          <option value="CHUA_THUC_HIEN">Chưa thực hiện</option>
          <option value="DA_LAY_MAU">Đã lấy mẫu</option>
          <option value="DA_HOAN_THANH">Đã hoàn thành</option>
        </select>
      </div>

      {/* Table */}
      <table className="min-w-full text-sm bg-white shadow rounded">
        <thead>
          <tr>
            <th>Mã YC</th>
            <th>Bệnh nhân</th>
            <th>Bác sĩ</th>
            <th>Loại</th>
            <th>Trạng thái</th>
            <th>Ngày</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredList.map((item) => (
            <tr key={item.maYeuCau} className="border-t">
              <td>{item.maYeuCau}</td>
              <td>{item.BenhNhan?.hoTen}</td>
              <td>{item.BacSi?.hoTen}</td>
              <td>{item.loaiYeuCau}</td>
              <td>{item.trangThai}</td>
              <td>{item.ngayYeuCau}</td>
              <td>
                {item.trangThai === "CHUA_THUC_HIEN" && (
                  <button
                    onClick={() => handleXacNhan(item.maYeuCau)}
                    className="text-blue-600 hover:underline"
                  >
                    ✅ Đã lấy mẫu
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default YeuCauXNTruocPage;

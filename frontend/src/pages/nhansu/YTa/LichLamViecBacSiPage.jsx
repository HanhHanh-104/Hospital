import React, { useEffect, useState } from "react";
import axios from "../../../api/axiosClient";

const LichLamViecBacSiPage = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    axios.get("/lichlamviec").then((res) => {
      setList(res.data.data || []);
    });
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold text-blue-700">📅 Lịch làm việc của bác sĩ</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm bg-white shadow rounded border border-gray-200">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Mã lịch</th>
              <th className="px-4 py-2">Mã bác sĩ</th>
              <th className="px-4 py-2">Mã ca</th>
              <th className="px-4 py-2">Ngày làm việc</th>
            </tr>
          </thead>
          <tbody>
            {list.map((row) => (
              <tr key={row.maLichLV} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2">{row.maLichLV}</td>
                <td className="px-4 py-2">{row.maBS}</td>
                <td className="px-4 py-2">{row.maCa}</td>
                <td className="px-4 py-2">{formatDate(row.ngayLamViec)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LichLamViecBacSiPage;

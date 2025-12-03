import React from "react";

const HoaDonList = ({ data, onChiTietClick }) => {
  return (
    <section className="space-y-4">
      <h3 className="font-semibold text-blue-700 text-lg">📋 Danh sách hóa đơn</h3>
      <table className="min-w-full text-sm border rounded shadow bg-white">
        <thead className="bg-blue-50 text-left">
          <tr>
            <th className="p-2">Mã HD</th>
            <th>Mã BN</th>
            <th>Mã NS</th>
            <th>Tổng</th>
            <th>Trạng thái</th>
            <th>Ngày lập</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((hd) => (
            <tr key={hd.maHD} className="border-t hover:bg-gray-50">
              <td className="p-2">{hd.maHD}</td>
              <td>{hd.maBN}</td>
              <td>{hd.maNS}</td>
              <td>{hd.tongTien}</td>
              <td>{hd.trangThai}</td>
              <td>{hd.ngayLap}</td>
              <td>
                <button
                  onClick={() => onChiTietClick(hd.maHD)}
                  className="text-blue-600 hover:underline"
                >
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default HoaDonList;

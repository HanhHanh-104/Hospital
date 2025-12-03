import React from "react";

const LichTable = ({
  data,
  editForm,
  onEditStart,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  onDelete
}) => {
  return (
    <div className="overflow-auto rounded-xl shadow">
      <table className="min-w-full text-sm text-left bg-white border border-gray-200">
        <thead className="bg-blue-50 text-gray-700 font-semibold">
          <tr>
            <th className="px-4 py-2">Mã</th>
            <th className="px-4 py-2">Bệnh nhân</th>
            <th className="px-4 py-2">Bác sĩ</th>
            <th className="px-4 py-2">Ngày</th>
            <th className="px-4 py-2">Giờ</th>
            <th className="px-4 py-2">Phòng</th>
            <th className="px-4 py-2">Ghi chú</th>
            <th className="px-4 py-2 text-center">#</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.maLich} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{item.maLich}</td>
              <td className="px-4 py-2">{item.BenhNhan?.hoTen}</td>
              <td className="px-4 py-2">{item.BacSi?.hoTen}</td>
              <td className="px-4 py-2">
                {editForm.maLich === item.maLich ? (
                  <input
                    type="date"
                    name="ngayKham"
                    value={editForm.ngayKham}
                    onChange={onEditChange}
                    className="border px-2 py-1 rounded w-full"
                  />
                ) : (
                  item.ngayKham
                )}
              </td>
              <td className="px-4 py-2">
                {editForm.maLich === item.maLich ? (
                  <input
                    type="time"
                    name="gioKham"
                    value={editForm.gioKham}
                    onChange={onEditChange}
                    className="border px-2 py-1 rounded w-full"
                  />
                ) : (
                  item.gioKham
                )}
              </td>
              <td className="px-4 py-2">
                {editForm.maLich === item.maLich ? (
                  <input
                    type="text"
                    name="phong"
                    value={editForm.phong}
                    onChange={onEditChange}
                    className="border px-2 py-1 rounded w-full"
                  />
                ) : (
                  item.phong
                )}
              </td>
              <td className="px-4 py-2">
                {editForm.maLich === item.maLich ? (
                  <textarea
                    name="ghiChu"
                    value={editForm.ghiChu}
                    onChange={onEditChange}
                    className="border px-2 py-1 rounded w-full"
                  />
                ) : (
                  item.ghiChu
                )}
              </td>
              <td className="px-4 py-2 text-center">
                {editForm.maLich === item.maLich ? (
                  <div className="space-x-1">
                    <button
                      onClick={onSaveEdit}
                      className="text-green-600 hover:underline"
                    >
                      💾
                    </button>
                    <button
                      onClick={onCancelEdit}
                      className="text-gray-600 hover:underline"
                    >
                      ✖
                    </button>
                  </div>
                ) : (
                  <div className="space-x-2">
                    <button
                      onClick={() => onEditStart(item)}
                      className="text-blue-600 hover:underline"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => onDelete(item.maLich)}
                      className="text-red-600 hover:underline"
                    >
                      Xoá
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LichTable;

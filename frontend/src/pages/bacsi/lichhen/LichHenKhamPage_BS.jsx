// Tệp: frontend/src/pages/bacsi/lichhen/LichHenKhamPage_BS.jsx
// NỘI DUNG ĐÃ ĐƯỢC SỬA LỖI (BỔ SUNG TRY...CATCH)

import React, { useEffect, useState } from "react";
import LichTable from "../../../components/lichkham/LichTable";
import {
  getLichHenByBacSi, // SỬA: Dùng hàm mới
  updateLichHen,
  deleteLichHen,
} from "../../../services/lichkham_BS/lichkhamService";

const LichHenKhamPage = () => {
  const [lichList, setLichList] = useState([]);
  // Xóa state bacSiList
  const [filter, setFilter] = useState({ tuNgay: "", denNgay: "" }); // Xóa maBS khỏi filter
  const [editForm, setEditForm] = useState({});
  const [maBS_User, setMaBS_User] = useState(null); // Thêm state để lưu maBS

  useEffect(() => {
    // Lấy maBS từ localStorage (được lưu khi đăng nhập)
    const maBS = localStorage.getItem("maBS");
    if (maBS) {
      setMaBS_User(maBS); // Lưu lại maBS
      loadData(maBS);
    } else {
      alert("Lỗi: Không tìm thấy mã bác sĩ. Vui lòng đăng nhập lại.");
    }
  }, []);

  // === SỬA LỖI 1: Bổ sung TRY...CATCH và kiểm tra dữ liệu ===
  const loadData = async (maBS) => {
    try {
      const res = await getLichHenByBacSi(maBS); // Gọi API theo maBS
      // Đảm bảo res.data.data là một mảng trước khi set state
      setLichList(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (error) {
      console.error("Lỗi khi tải lịch hẹn:", error);
      setLichList([]); // Set mảng rỗng khi có lỗi để tránh crash
    }
  };
  // === KẾT THÚC SỬA 1 ===

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const filteredList = lichList.filter((item) => {
    const ngay = new Date(item.ngayKham);
    const tu = filter.tuNgay ? new Date(filter.tuNgay) : null;
    const den = filter.denNgay ? new Date(filter.denNgay) : null;
    const matchNgay = (!tu || ngay >= tu) && (!den || ngay <= den);
    // Đã xóa matchBS
    return matchNgay;
  });

  const startEdit = (lich) => setEditForm({ ...lich });
  const handleEditChange = (e) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  const cancelEdit = () => setEditForm({});

  // === SỬA LỖI 2: Bổ sung TRY...CATCH ===
  const saveEdit = async () => {
    try {
      await updateLichHen(editForm.maLich, {
        phong: editForm.phong,
        ghiChu: editForm.ghiChu,
        ngayKham: editForm.ngayKham,
        gioKham: editForm.gioKham,
      });
      alert("✅ Cập nhật thành công");
      setEditForm({});
      if (maBS_User) loadData(maBS_User); // Tải lại dữ liệu
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert("❌ Cập nhật thất bại.");
    }
  };
  // === KẾT THÚC SỬA 2 ===

  // === SỬA LỖI 3: Bổ sung TRY...CATCH ===
  const handleDelete = async (id) => {
    if (window.confirm("❌ Xác nhận xoá lịch hẹn?")) {
      try {
        await deleteLichHen(id);
        if (maBS_User) loadData(maBS_User); // Tải lại dữ liệu
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
        alert("❌ Xóa thất bại.");
      }
    }
  };
  // === KẾT THÚC SỬA 3 ===

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          📅 Lịch hẹn của tôi
        </h2>
      </div>

      {/* Xóa FilterBar và thay bằng 2 ô input ngày */}
      <div className="bg-white shadow rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          name="tuNgay"
          type="date"
          value={filter.tuNgay}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="denNgay"
          type="date"
          value={filter.denNgay}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white shadow rounded-xl p-4">
        <LichTable
          data={filteredList}
          editForm={editForm}
          onEditStart={startEdit}
          onEditChange={handleEditChange}
          onSaveEdit={saveEdit}
          onCancelEdit={cancelEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default LichHenKhamPage;
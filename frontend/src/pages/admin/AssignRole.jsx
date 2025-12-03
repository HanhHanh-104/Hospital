import React, { useEffect, useState } from "react";
import axios from "../../api/axiosClient";
import toast from "react-hot-toast";

function AssignRole() {
  const [users, setUsers] = useState([]);
  const [updatedRoles, setUpdatedRoles] = useState({});
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/tai-khoan", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.data || []); // ✅ Đảm bảo là array
    } catch (err) {
      toast.error("Không thể tải danh sách tài khoản");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (id, newRole) => {
    setUpdatedRoles((prev) => ({ ...prev, [id]: newRole }));
  };

  const handleSave = async (id) => {
    const maNhom = updatedRoles[id];
    try {
      await axios.put(`/tai-khoan/${id}`, { maNhom }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Cập nhật quyền thành công");
      fetchUsers();
    } catch (err) {
      toast.error("Lỗi khi cập nhật quyền");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">🛡️ Phân quyền người dùng</h2>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">👤 Tên đăng nhập</th>
              <th className="p-3">📧 Email</th>
              <th className="p-3">🎯 Quyền hiện tại</th>
              <th className="p-3">🛠️ Gán quyền mới</th>
              <th className="p-3">💾 Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center italic text-gray-500">
                  Không có tài khoản nào
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.maTK} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">{u.tenDangNhap}</td>
                  <td className="p-3">{u.email || <i className="text-gray-400">Chưa có</i>}</td>
                  <td className="p-3">{u.maNhom}</td>
                  <td className="p-3">
                    <select
                      value={updatedRoles[u.maTK] || u.maNhom}
                      onChange={(e) => handleChange(u.maTK, e.target.value)}
                      className="border p-1 rounded"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="BACSI">Bác sĩ</option>
                      <option value="NHANSU">Nhân viên y tế</option>
                      <option value="BENHNHAN">Bệnh nhân</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleSave(u.maTK)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Lưu
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AssignRole;

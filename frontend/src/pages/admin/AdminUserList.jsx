import React, { useEffect, useState, useMemo } from "react";
import axios from "../../api/axiosClient";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Search, UserPlus, Edit, Trash2, Users, Shield, Stethoscope, Activity } from 'lucide-react';

function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ALL");
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/tai-khoan", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error(err.response?.data?.message || "Không thể tải danh sách tài khoản");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Bạn chưa đăng nhập");
      return;
    }
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) return;
    try {
      await axios.delete(`/tai-khoan/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Đã xóa tài khoản");
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error(err.response?.data?.message || "Lỗi khi xóa tài khoản");
    }
  };

  const filtered = useMemo(() => {
    let result = users.filter(
      (u) =>
        u.tenDangNhap?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (activeTab !== "ALL") {
      result = result.filter((u) => u.maNhom === activeTab);
    }

    return result;
  }, [users, search, activeTab]);

  const grouped = useMemo(() => ({
    ADMIN: users.filter((u) => u.maNhom === "ADMIN").length,
    BACSI: users.filter((u) => u.maNhom === "BACSI").length,
    NHANSU: users.filter((u) => u.maNhom === "NHANSU").length,
    BENHNHAN: users.filter((u) => u.maNhom === "BENHNHAN").length,
  }), [users]);

  const tabs = [
    { id: "ALL", label: "Tất cả", count: users.length, icon: Users },
    { id: "ADMIN", label: "Admin", count: grouped.ADMIN, icon: Shield, color: "blue" },
    { id: "BACSI", label: "Bác sĩ", count: grouped.BACSI, icon: Stethoscope, color: "green" },
    { id: "NHANSU", label: "Nhân sự", count: grouped.NHANSU, icon: Activity, color: "yellow" },
    { id: "BENHNHAN", label: "Bệnh nhân", count: grouped.BENHNHAN, icon: Users, color: "purple" },
  ];

  const getRoleBadge = (role) => {
    const colors = {
      ADMIN: "bg-blue-100 text-blue-800 border-blue-200",
      BACSI: "bg-green-100 text-green-800 border-green-200",
      NHANSU: "bg-yellow-100 text-yellow-800 border-yellow-200",
      BENHNHAN: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${colors[role] || "bg-gray-100 text-gray-800"}`}>
        {role}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-xl shadow-lg">
              <Users size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý tài khoản</h1>
              <p className="text-gray-600">Quản lý tất cả tài khoản trong hệ thống</p>
            </div>
          </div>
          <Link
            to="/admin/taikhoan/tao-moi"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <UserPlus size={20} />
            Tạo tài khoản
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên đăng nhập hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }
              `}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Users size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Không có tài khoản nào</h3>
          <p className="text-gray-500">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Mã TK</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Tên đăng nhập</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Vai trò</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Trạng thái</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Thông tin thêm</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((user) => (
                  <tr key={user.maTK} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{user.maTK}</td>
                    <td className="px-6 py-4 text-gray-700">{user.tenDangNhap}</td>
                    <td className="px-6 py-4 text-gray-700">{user.email}</td>
                    <td className="px-6 py-4">{getRoleBadge(user.maNhom)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.trangThai === 1 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {user.trangThai === 1 ? "Hoạt động" : "Đã khóa"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs">
                      {user.maNhom === "BACSI" && (
                        <div>
                          <div>BS: {user.maBS || "-"}</div>
                          <div>Khoa: {user.tenKhoa || user.maKhoa || "-"}</div>
                        </div>
                      )}
                      {user.maNhom === "NHANSU" && (
                        <div>
                          <div>NS: {user.maNS || "-"}</div>
                          <div>Loại: {user.loaiNS || "-"}</div>
                        </div>
                      )}
                      {user.maNhom === "BENHNHAN" && (
                        <div>
                          <div>BN: {user.maBN || "-"}</div>
                          <div>{user.hoTen || "-"}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/admin/taikhoan/sua/${user.maTK}`}
                          state={{ user }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(user.maTK)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUserList;

import React, { useEffect, useState, useMemo } from "react";
import axios from "../../api/axiosClient";
import toast from "react-hot-toast";
import { Users, Search, Edit, Trash2, X, Phone, MapPin, Calendar } from 'lucide-react';
import dayjs from 'dayjs';

function ManageBenhNhan() {
  const [dsBenhNhan, setDsBenhNhan] = useState([]);
  const [form, setForm] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchBenhNhan = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/benhnhan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDsBenhNhan(Array.isArray(res.data.data) ? res.data.data : res.data);
    } catch (err) {
      toast.error("Lỗi khi tải danh sách bệnh nhân");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBenhNhan();
  }, []);

  const handleEdit = (bn) => {
    const formattedDate = bn.ngaySinh ? dayjs(bn.ngaySinh).format('YYYY-MM-DD') : '';
    setForm({ ...bn, ngaySinh: formattedDate });
  };

  const handleDelete = async (maBN) => {
    if (!window.confirm("Xác nhận xóa bệnh nhân này?")) return;
    try {
      await axios.delete(`/benhnhan/${maBN}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Đã xóa bệnh nhân");
      fetchBenhNhan();
    } catch (err) {
      toast.error("Không thể xóa bệnh nhân");
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form) return;
    try {
      await axios.put(`/benhnhan/${form.maBN}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Cập nhật bệnh nhân thành công");
      setForm(null);
      fetchBenhNhan();
    } catch (err) {
      toast.error("Lỗi khi cập nhật bệnh nhân");
    }
  };

  const filtered = useMemo(() => {
    return dsBenhNhan.filter(
      (bn) =>
        bn.hoTen?.toLowerCase().includes(search.toLowerCase()) ||
        bn.maBN?.toLowerCase().includes(search.toLowerCase()) ||
        bn.soDienThoai?.includes(search) ||
        bn.bhyt?.includes(search)
    );
  }, [dsBenhNhan, search]);

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
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-xl shadow-lg">
            <Users size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý bệnh nhân</h1>
            <p className="text-gray-600">Quản lý thông tin bệnh nhân trong hệ thống</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, mã BN, SĐT hoặc BHYT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Edit Form Modal */}
      {form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Cập nhật thông tin bệnh nhân</h2>
              <button
                onClick={() => setForm(null)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ tên *</label>
                  <input
                    name="hoTen"
                    value={form.hoTen || ""}
                    onChange={handleChange}
                    placeholder="Họ tên"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính *</label>
                  <select
                    name="gioiTinh"
                    value={form.gioiTinh || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">-- Chọn giới tính --</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh *</label>
                  <input
                    type="date"
                    name="ngaySinh"
                    value={form.ngaySinh || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại *</label>
                  <input
                    name="soDienThoai"
                    value={form.soDienThoai || ""}
                    onChange={handleChange}
                    placeholder="Số điện thoại"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ *</label>
                  <input
                    name="diaChi"
                    value={form.diaChi || ""}
                    onChange={handleChange}
                    placeholder="Địa chỉ"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số BHYT (nếu có)</label>
                  <input
                    name="bhyt"
                    value={form.bhyt || ""}
                    onChange={handleChange}
                    placeholder="Số BHYT"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setForm(null)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
                >
                  Lưu cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Users size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Không có bệnh nhân nào</h3>
          <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Mã BN</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Họ tên</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Giới tính</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Ngày sinh</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">SĐT</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Địa chỉ</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">BHYT</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((bn) => (
                  <tr key={bn.maBN} className="hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                        {bn.maBN}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-semibold">{bn.hoTen}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        bn.gioiTinh === 'Nam' 
                          ? 'bg-blue-100 text-blue-800' 
                          : bn.gioiTinh === 'Nữ'
                          ? 'bg-pink-100 text-pink-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {bn.gioiTinh}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {bn.ngaySinh ? dayjs(bn.ngaySinh).format('DD/MM/YYYY') : '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-700 flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      {bn.soDienThoai}
                    </td>
                    <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="max-w-xs truncate">{bn.diaChi || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      {bn.bhyt ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          {bn.bhyt}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic text-xs">Chưa có</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(bn)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(bn.maBN)}
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

export default ManageBenhNhan;

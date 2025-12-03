import React, { useEffect, useState, useMemo } from "react";
import { getAllPhanHoi, updatePhanHoi, deletePhanHoi, getPhanHoiStats } from "../../services/phanhoi/phanhoiService";
import toast from "react-hot-toast";
import { MessageSquare, Search, Edit, Trash2, X, Save, Clock, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react';
import dayjs from 'dayjs';

const ManagePhanHoiPage = () => {
  const [phanHoiList, setPhanHoiList] = useState([]);
  const [stats, setStats] = useState({ total: 0, choXuLy: 0, daXuLy: 0, dangXuLy: 0 });
  const [form, setForm] = useState(null);
  const [search, setSearch] = useState("");
  const [filterTrangThai, setFilterTrangThai] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
    fetchStats();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterTrangThai) params.trangThai = filterTrangThai;
      const res = await getAllPhanHoi(params);
      setPhanHoiList(res.data.data || []);
    } catch (err) {
      toast.error("Lỗi khi tải danh sách phản hồi");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await getPhanHoiStats();
      setStats(res.data.data);
    } catch (err) {
      console.error("Lỗi thống kê:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterTrangThai]);

  const handleEdit = (ph) => {
    setForm({ ...ph });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form) return;
    try {
      await updatePhanHoi(form.maPH, {
        phanHoi: form.phanHoi,
        trangThai: form.trangThai || "DA_XU_LY"
      });
      toast.success("Cập nhật phản hồi thành công");
      setForm(null);
      fetchData();
      fetchStats();
    } catch (err) {
      toast.error("Lỗi khi cập nhật phản hồi");
    }
  };

  const handleDelete = async (maPH) => {
    if (!window.confirm("Xác nhận xóa phản hồi này?")) return;
    try {
      await deletePhanHoi(maPH);
      toast.success("Đã xóa phản hồi");
      fetchData();
      fetchStats();
    } catch (err) {
      toast.error("Lỗi khi xóa phản hồi");
    }
  };

  const filtered = useMemo(() => {
    return phanHoiList.filter(
      (ph) =>
        ph.tieuDe?.toLowerCase().includes(search.toLowerCase()) ||
        ph.noiDung?.toLowerCase().includes(search.toLowerCase()) ||
        ph.BenhNhan?.hoTen?.toLowerCase().includes(search.toLowerCase())
    );
  }, [phanHoiList, search]);

  const getStatusBadge = (trangThai) => {
    const statusMap = {
      'CHO_XU_LY': { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
      'DANG_XU_LY': { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: AlertCircle },
      'DA_XU_LY': { label: 'Đã xử lý', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
    };
    const status = statusMap[trangThai] || { label: trangThai, color: 'bg-gray-100 text-gray-800', icon: Clock };
    const Icon = status.icon;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${status.color}`}>
        <Icon size={14} />
        {status.label}
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
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-xl shadow-lg">
            <MessageSquare size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý phản hồi & Ý kiến</h1>
            <p className="text-gray-600">Xem và xử lý phản hồi từ bệnh nhân</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="text-blue-600" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stats.total}</h3>
            <p className="text-sm text-gray-500">Tổng phản hồi</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Clock className="text-yellow-600" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stats.choXuLy}</h3>
            <p className="text-sm text-gray-500">Chờ xử lý</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="text-blue-600" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stats.dangXuLy}</h3>
            <p className="text-sm text-gray-500">Đang xử lý</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stats.daXuLy}</h3>
            <p className="text-sm text-gray-500">Đã xử lý</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
          <select
            value={filterTrangThai}
            onChange={(e) => setFilterTrangThai(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="CHO_XU_LY">Chờ xử lý</option>
            <option value="DANG_XU_LY">Đang xử lý</option>
            <option value="DA_XU_LY">Đã xử lý</option>
          </select>
        </div>
      </div>

      {/* Edit Modal */}
      {form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Xử lý phản hồi</h2>
              <button
                onClick={() => setForm(null)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-2">Từ: {form.BenhNhan?.hoTen || form.maBN}</p>
                <p className="text-sm text-gray-600 mb-2">{dayjs(form.ngayGui).format("DD/MM/YYYY HH:mm")}</p>
                <p className="text-gray-800">{form.noiDung}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phản hồi *</label>
                <textarea
                  value={form.phanHoi || ""}
                  onChange={(e) => setForm({ ...form, phanHoi: e.target.value })}
                  placeholder="Nhập phản hồi cho bệnh nhân..."
                  rows={5}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                <select
                  value={form.trangThai || "DA_XU_LY"}
                  onChange={(e) => setForm({ ...form, trangThai: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="CHO_XU_LY">Chờ xử lý</option>
                  <option value="DANG_XU_LY">Đang xử lý</option>
                  <option value="DA_XU_LY">Đã xử lý</option>
                </select>
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
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md flex items-center gap-2"
                >
                  <Save size={18} />
                  Lưu phản hồi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <MessageSquare size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Không có phản hồi nào</h3>
          <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Mã PH</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Bệnh nhân</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Tiêu đề</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Nội dung</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Ngày gửi</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Trạng thái</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((ph) => (
                  <tr key={ph.maPH} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{ph.maPH}</td>
                    <td className="px-6 py-4 text-gray-700">{ph.BenhNhan?.hoTen || ph.maBN}</td>
                    <td className="px-6 py-4 text-gray-700 font-semibold">{ph.tieuDe || "Phản hồi"}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{ph.noiDung}</td>
                    <td className="px-6 py-4 text-gray-600">{dayjs(ph.ngayGui).format("DD/MM/YYYY HH:mm")}</td>
                    <td className="px-6 py-4">{getStatusBadge(ph.trangThai)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(ph)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Xử lý"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(ph.maPH)}
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
};

export default ManagePhanHoiPage;


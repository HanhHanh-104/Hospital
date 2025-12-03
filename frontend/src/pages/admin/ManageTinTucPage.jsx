import React, { useEffect, useState, useMemo } from "react";
import { getAllTinTuc, createTinTuc, updateTinTuc, deleteTinTuc } from "../../services/tintuc/tintucService";
import toast from "react-hot-toast";
import { Newspaper, Search, Edit, Trash2, X, Plus, Save, Eye, Calendar } from 'lucide-react';
import dayjs from 'dayjs';

const ManageTinTucPage = () => {
  const [tinTucList, setTinTucList] = useState([]);
  const [form, setForm] = useState(null);
  const [search, setSearch] = useState("");
  const [filterTrangThai, setFilterTrangThai] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [filterTrangThai]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterTrangThai) params.trangThai = filterTrangThai;
      const res = await getAllTinTuc(params);
      setTinTucList(res.data.data || []);
    } catch (err) {
      toast.error("Lỗi khi tải danh sách tin tức");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tin) => {
    setForm({ ...tin });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;
    try {
      if (form.maTin) {
        await updateTinTuc(form.maTin, form);
        toast.success("Cập nhật tin tức thành công");
      } else {
        await createTinTuc(form);
        toast.success("Tạo tin tức thành công");
      }
      setForm(null);
      fetchData();
    } catch (err) {
      toast.error("Lỗi khi lưu tin tức");
    }
  };

  const handleDelete = async (maTin) => {
    if (!window.confirm("Xác nhận xóa tin tức này?")) return;
    try {
      await deleteTinTuc(maTin);
      toast.success("Đã xóa tin tức");
      fetchData();
    } catch (err) {
      toast.error("Lỗi khi xóa tin tức");
    }
  };

  const handleNew = () => {
    setForm({
      tieuDe: "",
      tomTat: "",
      noiDung: "",
      hinhAnh: "",
      loai: "TIN_TUC",
      trangThai: "HIEN_THI"
    });
  };

  const filtered = useMemo(() => {
    return tinTucList.filter(
      (tin) =>
        tin.tieuDe?.toLowerCase().includes(search.toLowerCase()) ||
        tin.tomTat?.toLowerCase().includes(search.toLowerCase())
    );
  }, [tinTucList, search]);

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
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-xl shadow-lg">
              <Newspaper size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý tin tức</h1>
              <p className="text-gray-600">Quản lý tin tức và thông báo từ bệnh viện</p>
            </div>
          </div>
          <button
            onClick={handleNew}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Thêm tin tức
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm tin tức..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
          <select
            value={filterTrangThai}
            onChange={(e) => setFilterTrangThai(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="HIEN_THI">Hiển thị</option>
            <option value="AN">Ẩn</option>
          </select>
        </div>
      </div>

      {/* Form Modal */}
      {form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {form.maTin ? "Cập nhật tin tức" : "Thêm tin tức mới"}
              </h2>
              <button
                onClick={() => setForm(null)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề *</label>
                  <input
                    type="text"
                    value={form.tieuDe || ""}
                    onChange={(e) => setForm({ ...form, tieuDe: e.target.value })}
                    placeholder="Tiêu đề tin tức"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại</label>
                  <select
                    value={form.loai || "TIN_TUC"}
                    onChange={(e) => setForm({ ...form, loai: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="TIN_TUC">Tin tức</option>
                    <option value="THONG_BAO">Thông báo</option>
                    <option value="HUONG_DAN">Hướng dẫn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                  <select
                    value={form.trangThai || "HIEN_THI"}
                    onChange={(e) => setForm({ ...form, trangThai: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="HIEN_THI">Hiển thị</option>
                    <option value="AN">Ẩn</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tóm tắt</label>
                  <textarea
                    value={form.tomTat || ""}
                    onChange={(e) => setForm({ ...form, tomTat: e.target.value })}
                    placeholder="Tóm tắt ngắn gọn..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL hình ảnh</label>
                  <input
                    type="text"
                    value={form.hinhAnh || ""}
                    onChange={(e) => setForm({ ...form, hinhAnh: e.target.value })}
                    placeholder="https://..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung *</label>
                  <textarea
                    value={form.noiDung || ""}
                    onChange={(e) => setForm({ ...form, noiDung: e.target.value })}
                    placeholder="Nội dung tin tức..."
                    rows={10}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md flex items-center gap-2"
                >
                  <Save size={18} />
                  {form.maTin ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Newspaper size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Không có tin tức nào</h3>
          <p className="text-gray-500">Thử thay đổi bộ lọc hoặc thêm tin tức mới</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Tiêu đề</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Loại</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Ngày đăng</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Lượt xem</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Trạng thái</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((tin) => (
                  <tr key={tin.maTin} className="hover:bg-green-50 transition-colors">
                    <td className="px-6 py-4 text-gray-700 font-semibold">{tin.tieuDe}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {tin.loai}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      {dayjs(tin.ngayDang).format("DD/MM/YYYY")}
                    </td>
                    <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                      <Eye size={16} className="text-gray-400" />
                      {tin.luotXem || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        tin.trangThai === 'HIEN_THI' 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                        {tin.trangThai === 'HIEN_THI' ? 'Hiển thị' : 'Ẩn'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(tin)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(tin.maTin)}
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

export default ManageTinTucPage;


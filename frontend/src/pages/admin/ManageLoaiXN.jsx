import React, { useEffect, useState, useMemo } from "react";
import axios from "../../api/axiosClient";
import toast from "react-hot-toast";
import { ClipboardList, Search, Edit, Trash2, X, Plus, Save } from 'lucide-react';

function ManageLoaiXN() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/loaixetnghiem", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setList(res.data.data || res.data);
    } catch {
      toast.error("Lỗi khi tải danh sách loại xét nghiệm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;
    try {
      if (form?.maLoaiXN) {
        await axios.put(`/loaixetnghiem/${form.maLoaiXN}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Đã cập nhật loại xét nghiệm");
      } else {
        await axios.post(`/loaixetnghiem`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Đã thêm loại xét nghiệm");
      }
      setForm(null);
      fetchAll();
    } catch {
      toast.error("Lỗi khi lưu loại xét nghiệm");
    }
  };

  const handleEdit = (item) => setForm({ ...item });
  const handleNew = () => setForm({ tenLoai: "", moTa: "" });

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá loại xét nghiệm này?")) return;
    try {
      await axios.delete(`/loaixetnghiem/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Đã xoá loại xét nghiệm");
      fetchAll();
    } catch {
      toast.error("Lỗi khi xoá");
    }
  };

  const filtered = useMemo(() => {
    return list.filter(
      (item) =>
        item.tenLoai?.toLowerCase().includes(search.toLowerCase()) ||
        item.maLoaiXN?.toLowerCase().includes(search.toLowerCase()) ||
        item.moTa?.toLowerCase().includes(search.toLowerCase())
    );
  }, [list, search]);

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
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4 rounded-xl shadow-lg">
              <ClipboardList size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý loại xét nghiệm</h1>
              <p className="text-gray-600">Quản lý danh mục loại xét nghiệm</p>
            </div>
          </div>
          <button
            onClick={handleNew}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Thêm loại mới
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên loại, mã loại hoặc mô tả..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Form Modal */}
      {form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-cyan-600 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {form.maLoaiXN ? "Cập nhật loại xét nghiệm" : "Thêm loại xét nghiệm mới"}
              </h2>
              <button
                onClick={() => setForm(null)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên loại xét nghiệm *</label>
          <input
            name="tenLoai"
                  value={form.tenLoai || ""}
            onChange={handleChange}
            placeholder="Tên loại xét nghiệm"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <textarea
            name="moTa"
                  value={form.moTa || ""}
            onChange={handleChange}
                  placeholder="Mô tả về loại xét nghiệm..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
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
                  className="px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all shadow-md flex items-center gap-2"
                >
                  <Save size={18} />
            {form?.maLoaiXN ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>
      </form>
          </div>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <ClipboardList size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Không có loại xét nghiệm nào</h3>
          <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc thêm loại mới</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Mã loại</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Tên loại</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Mô tả</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Thao tác</th>
          </tr>
        </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((item, index) => (
                  <tr key={item.maLoaiXN || index} className="hover:bg-teal-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-semibold">
                        {item.maLoaiXN}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-semibold">{item.tenLoai}</td>
                    <td className="px-6 py-4 text-gray-600">{item.moTa || <span className="text-gray-400 italic">Không có mô tả</span>}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.maLoaiXN)}
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

export default ManageLoaiXN;

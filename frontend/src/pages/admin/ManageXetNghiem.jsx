import React, { useEffect, useState, useMemo } from "react";
import axios from "../../api/axiosClient";
import toast from "react-hot-toast";
import { FlaskConical, Search, Edit, Trash2, X, Plus, Save, DollarSign, Clock } from 'lucide-react';

function ManageXetNghiem() {
  const [list, setList] = useState([]);
  const [dsLoai, setDsLoai] = useState([]);
  const [form, setForm] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [xnRes, loaiRes] = await Promise.all([
        axios.get("/xetnghiem", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/loaixetnghiem", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setList(Array.isArray(xnRes.data.data) ? xnRes.data.data : xnRes.data);
      setDsLoai(loaiRes.data.data || []);
    } catch {
      toast.error("Lỗi tải dữ liệu xét nghiệm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;
    try {
      if (form?.maXN) {
        await axios.put(`/xetnghiem/${form.maXN}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Đã cập nhật xét nghiệm");
      } else {
        await axios.post("/xetnghiem", form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Đã thêm xét nghiệm");
      }
      setForm(null);
      fetchAll();
    } catch {
      toast.error("Lỗi khi lưu xét nghiệm");
    }
  };

  const handleEdit = (item) => setForm({ ...item });
  const handleNew = () => setForm({ tenXN: "", maLoaiXN: "", chiPhi: "", thoiGianTraKetQua: "" });

  const handleDelete = async (id) => {
    if (!window.confirm("Xác nhận xoá xét nghiệm này?")) return;
    try {
      await axios.delete(`/xetnghiem/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Đã xoá");
      fetchAll();
    } catch {
      toast.error("Lỗi xoá xét nghiệm");
    }
  };

  const filtered = useMemo(() => {
    return list.filter(
      (item) =>
        item.tenXN?.toLowerCase().includes(search.toLowerCase()) ||
        item.maXN?.toLowerCase().includes(search.toLowerCase()) ||
        item.maLoaiXN?.toLowerCase().includes(search.toLowerCase())
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
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 rounded-xl shadow-lg">
              <FlaskConical size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý xét nghiệm</h1>
              <p className="text-gray-600">Quản lý danh mục xét nghiệm trong hệ thống</p>
            </div>
          </div>
          <button
            onClick={handleNew}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Thêm xét nghiệm
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, mã XN hoặc loại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Form Modal */}
      {form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-cyan-600 to-blue-600 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {form.maXN ? "Cập nhật xét nghiệm" : "Thêm xét nghiệm mới"}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên xét nghiệm *</label>
                  <input
                    name="tenXN"
                    value={form.tenXN || ""}
                    onChange={handleChange}
                    placeholder="Tên xét nghiệm"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại xét nghiệm *</label>
                  <select
                    name="maLoaiXN"
                    value={form.maLoaiXN || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                  >
                    <option value="">-- Chọn loại --</option>
                    {dsLoai.map((loai) => (
                      <option key={loai.maLoaiXN} value={loai.maLoaiXN}>
                        {loai.tenLoai}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign size={16} />
                    Chi phí (VNĐ) *
                  </label>
                  <input
                    name="chiPhi"
                    type="number"
                    step="0.01"
                    value={form.chiPhi || ""}
                    onChange={handleChange}
                    placeholder="Chi phí"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Clock size={16} />
                    Thời gian trả kết quả
                  </label>
                  <input
                    name="thoiGianTraKetQua"
                    value={form.thoiGianTraKetQua || ""}
                    onChange={handleChange}
                    placeholder="VD: 1 ngày, 2 giờ..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                  className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all shadow-md flex items-center gap-2"
                >
                  <Save size={18} />
                  {form?.maXN ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FlaskConical size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Không có xét nghiệm nào</h3>
          <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc thêm xét nghiệm mới</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Mã XN</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Tên xét nghiệm</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Loại</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Chi phí</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Thời gian trả KQ</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((item, idx) => (
                  <tr key={item.maXN || idx} className="hover:bg-cyan-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs font-semibold">
                        {item.maXN}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-semibold">{item.tenXN}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {item.maLoaiXN}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-semibold">
                      {item.chiPhi ? `${parseFloat(item.chiPhi).toLocaleString('vi-VN')} VNĐ` : "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      {item.thoiGianTraKetQua || "-"}
                    </td>
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
                          onClick={() => handleDelete(item.maXN)}
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

export default ManageXetNghiem;

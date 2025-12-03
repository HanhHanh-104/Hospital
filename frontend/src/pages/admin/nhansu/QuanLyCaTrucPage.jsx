import React, { useEffect, useState, useMemo } from "react";
import {
  getAllCaTruc,
  createCaTruc,
  updateCaTruc,
  deleteCaTruc,
} from "../../../services/catruc/catrucService";
import toast from "react-hot-toast";
import { Clock, Search, Edit, Trash2, X, Plus, Save } from 'lucide-react';

const QuanLyCaTrucPage = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
    const res = await getAllCaTruc();
    setList(res.data.data || []);
    } catch (err) {
      toast.error("Lỗi khi tải dữ liệu ca trực");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form) return;
    try {
    await createCaTruc(form);
      toast.success("Thêm ca trực thành công");
      setForm(null);
    fetchData();
    } catch (err) {
      toast.error("Lỗi khi thêm ca trực");
    }
  };

  const handleEdit = (ca) => {
    setForm({ ...ca });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form || !form.maCa) return;
    try {
      await updateCaTruc(form.maCa, {
        tenCa: form.tenCa,
        thoiGianBatDau: form.thoiGianBatDau,
        thoiGianKetThuc: form.thoiGianKetThuc,
      });
      toast.success("Cập nhật ca trực thành công");
      setForm(null);
      fetchData();
    } catch (err) {
      toast.error("Lỗi khi cập nhật ca trực");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá ca trực này?")) return;
    try {
      await deleteCaTruc(id);
      toast.success("Đã xoá ca trực");
      fetchData();
    } catch (err) {
      toast.error("Lỗi khi xoá ca trực");
    }
  };

  const handleNew = () => {
    setForm({
      tenCa: "",
      thoiGianBatDau: "",
      thoiGianKetThuc: "",
    });
  };

  const filtered = useMemo(() => {
    return list.filter(
      (ca) =>
        ca.tenCa?.toLowerCase().includes(search.toLowerCase()) ||
        ca.maCa?.toLowerCase().includes(search.toLowerCase())
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
            <div className="bg-gradient-to-r from-slate-600 to-gray-600 p-4 rounded-xl shadow-lg">
              <Clock size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý ca trực</h1>
              <p className="text-gray-600">Quản lý các ca trực bệnh viện</p>
            </div>
          </div>
          <button
            onClick={handleNew}
            className="bg-gradient-to-r from-slate-600 to-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-slate-700 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Thêm ca trực
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên ca hoặc mã ca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Form Modal */}
      {form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-slate-600 to-gray-600 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {form.maCa ? "Cập nhật ca trực" : "Thêm ca trực mới"}
              </h2>
              <button
                onClick={() => setForm(null)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={form.maCa ? handleUpdate : handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên ca *</label>
        <input
          name="tenCa"
                  value={form.tenCa || ""}
          onChange={handleChange}
                  placeholder="Tên ca (VD: Ca sáng, Ca chiều, Ca đêm)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  required
        />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giờ bắt đầu *</label>
        <input
          type="time"
          name="thoiGianBatDau"
                    value={form.thoiGianBatDau || ""}
          onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    required
        />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giờ kết thúc *</label>
        <input
          type="time"
          name="thoiGianKetThuc"
                    value={form.thoiGianKetThuc || ""}
          onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    required
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
                  className="px-6 py-2 bg-gradient-to-r from-slate-600 to-gray-600 text-white rounded-lg hover:from-slate-700 hover:to-gray-700 transition-all shadow-md flex items-center gap-2"
                >
                  <Save size={18} />
                  {form.maCa ? "Cập nhật" : "Thêm mới"}
        </button>
      </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Clock size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Không có ca trực nào</h3>
          <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc thêm ca trực mới</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Mã ca</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Tên ca</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Giờ bắt đầu</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Giờ kết thúc</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Thao tác</th>
          </tr>
        </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((ca) => (
                  <tr key={ca.maCa} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-semibold">
                        {ca.maCa}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-semibold">{ca.tenCa}</td>
                    <td className="px-6 py-4 text-gray-700 flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      {ca.thoiGianBatDau}
                    </td>
                    <td className="px-6 py-4 text-gray-700 flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      {ca.thoiGianKetThuc}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(ca)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(ca.maCa)}
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

export default QuanLyCaTrucPage;

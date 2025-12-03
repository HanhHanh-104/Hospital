import React, { useEffect, useState, useMemo } from "react";
import {
  getAllNhomThuoc,
  getOneNhomThuoc,
  createNhomThuoc,
  updateNhomThuoc,
  deleteNhomThuoc,
} from "../../../services/thuoc/nhomthuocService";
import toast from "react-hot-toast";
import { Package, Search, Edit, Trash2, X, Plus, Save } from 'lucide-react';

const QuanLyNhomThuoc = () => {
  const [list, setList] = useState([]);
  const [formData, setFormData] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const ds = await getAllNhomThuoc();
      setList(ds || []);
    } catch (err) {
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = async (id) => {
    try {
      const res = await getOneNhomThuoc(id);
      if (res) {
        setFormData(res);
      }
    } catch (err) {
      toast.error("Lỗi khi tải thông tin");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData) return;
    
    try {
      if (formData.maNhom) {
        await updateNhomThuoc(formData.maNhom, formData);
        toast.success("Cập nhật nhóm thuốc thành công");
      } else {
        await createNhomThuoc(formData);
        toast.success("Thêm nhóm thuốc thành công");
      }
      setFormData(null);
      fetchData();
    } catch (err) {
      toast.error("Lỗi khi lưu nhóm thuốc");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá nhóm thuốc này?")) return;
    try {
      await deleteNhomThuoc(id);
      toast.success("Đã xoá nhóm thuốc");
      fetchData();
    } catch (err) {
      toast.error("Lỗi khi xoá nhóm thuốc");
    }
  };

  const handleNew = () => {
    setFormData({ tenNhom: "", moTa: "" });
  };

  const filtered = useMemo(() => {
    return list.filter(
      (item) =>
        item.tenNhom?.toLowerCase().includes(search.toLowerCase()) ||
        item.maNhom?.toLowerCase().includes(search.toLowerCase()) ||
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
              <Package size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý nhóm thuốc</h1>
              <p className="text-gray-600">Quản lý các nhóm thuốc trong hệ thống</p>
            </div>
          </div>
          <button
            onClick={handleNew}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Thêm nhóm thuốc
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, mã nhóm thuốc hoặc mô tả..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Form Modal */}
      {formData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-cyan-600 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {formData.maNhom ? "Cập nhật nhóm thuốc" : "Thêm nhóm thuốc mới"}
              </h2>
              <button
                onClick={() => setFormData(null)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên nhóm thuốc *</label>
                <input
                  name="tenNhom"
                  value={formData.tenNhom || ""}
                  onChange={handleChange}
                  placeholder="Tên nhóm thuốc"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <textarea
                  name="moTa"
                  value={formData.moTa || ""}
                  onChange={handleChange}
                  placeholder="Mô tả về nhóm thuốc..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setFormData(null)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all shadow-md flex items-center gap-2"
                >
                  <Save size={18} />
                  {formData.maNhom ? "Cập nhật" : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Không có nhóm thuốc nào</h3>
          <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc thêm nhóm thuốc mới</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Mã nhóm</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Tên nhóm thuốc</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Mô tả</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((item) => (
                  <tr key={item.maNhom} className="hover:bg-teal-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-semibold">
                        {item.maNhom}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-semibold">{item.tenNhom}</td>
                    <td className="px-6 py-4 text-gray-600">{item.moTa || <span className="text-gray-400 italic">Không có mô tả</span>}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item.maNhom)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.maNhom)}
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

export default QuanLyNhomThuoc;

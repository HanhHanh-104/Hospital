import React, { useEffect, useState, useMemo } from "react";
import {
  getAllDonViTinh,
  getOneDonViTinh,
  createDonViTinh,
  updateDonViTinh,
  deleteDonViTinh,
} from "../../../services/thuoc/donvitinhService";
import toast from "react-hot-toast";
import { Ruler, Search, Edit, Trash2, X, Plus, Save } from 'lucide-react';

const QuanLyDonViTinh = () => {
  const [list, setList] = useState([]);
  const [formData, setFormData] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const ds = await getAllDonViTinh();
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
      const res = await getOneDonViTinh(id);
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
      if (formData.maDVT) {
        await updateDonViTinh(formData.maDVT, formData);
        toast.success("Cập nhật đơn vị tính thành công");
      } else {
        await createDonViTinh(formData);
        toast.success("Thêm đơn vị tính thành công");
      }
      setFormData(null);
      fetchData();
    } catch (err) {
      toast.error("Lỗi khi lưu đơn vị tính");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá đơn vị tính này?")) return;
    try {
      await deleteDonViTinh(id);
      toast.success("Đã xoá đơn vị tính");
      fetchData();
    } catch (err) {
      toast.error("Lỗi khi xoá đơn vị tính");
    }
  };

  const handleNew = () => {
    setFormData({ tenDVT: "", moTa: "" });
  };

  const filtered = useMemo(() => {
    return list.filter(
      (item) =>
        item.tenDVT?.toLowerCase().includes(search.toLowerCase()) ||
        item.maDVT?.toLowerCase().includes(search.toLowerCase()) ||
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
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-4 rounded-xl shadow-lg">
              <Ruler size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý đơn vị tính</h1>
              <p className="text-gray-600">Quản lý các đơn vị tính thuốc trong hệ thống</p>
            </div>
          </div>
          <button
            onClick={handleNew}
            className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Thêm đơn vị tính
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, mã đơn vị tính hoặc mô tả..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Form Modal */}
      {formData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {formData.maDVT ? "Cập nhật đơn vị tính" : "Thêm đơn vị tính mới"}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên đơn vị tính *</label>
                <input
                  name="tenDVT"
                  value={formData.tenDVT || ""}
                  onChange={handleChange}
                  placeholder="Tên đơn vị tính"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <textarea
                  name="moTa"
                  value={formData.moTa || ""}
                  onChange={handleChange}
                  placeholder="Mô tả về đơn vị tính..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                  className="px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all shadow-md flex items-center gap-2"
                >
                  <Save size={18} />
                  {formData.maDVT ? "Cập nhật" : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Ruler size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Không có đơn vị tính nào</h3>
          <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc thêm đơn vị tính mới</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Mã DVT</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Tên đơn vị tính</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Mô tả</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((item) => (
                  <tr key={item.maDVT} className="hover:bg-amber-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                        {item.maDVT}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-semibold">{item.tenDVT}</td>
                    <td className="px-6 py-4 text-gray-600">{item.moTa || <span className="text-gray-400 italic">Không có mô tả</span>}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item.maDVT)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.maDVT)}
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

export default QuanLyDonViTinh;

import React, { useEffect, useState, useMemo } from "react";
import axios from "../../api/axiosClient";
import toast from "react-hot-toast";
import { UserCog, Search, Edit, Trash2, X } from 'lucide-react';

function ManageNhanSu() {
  const [dsNhanSu, setDsNhanSu] = useState([]);
  const [dsKhoa, setDsKhoa] = useState([]);
  const [form, setForm] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchNhanSu();
    fetchKhoa();
  }, []);

  const fetchNhanSu = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/nhansu", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDsNhanSu(res.data.data || []);
    } catch {
      toast.error("Không thể tải danh sách nhân sự");
    } finally {
      setLoading(false);
    }
  };

  const fetchKhoa = async () => {
    try {
      const res = await axios.get("/khoa", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDsKhoa(res.data.data || []);
    } catch {
      toast.error("Không thể tải danh sách khoa");
    }
  };

  const handleEdit = (ns) => setForm({ ...ns });

  const handleDelete = async (maNS) => {
    if (!window.confirm("Xác nhận xoá nhân sự này?")) return;
    try {
      await axios.delete(`/nhansu/${maNS}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Đã xoá nhân sự");
      fetchNhanSu();
    } catch {
      toast.error("Không thể xoá nhân sự");
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form) return;
    try {
      await axios.put(`/nhansu/${form.maNS}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Cập nhật thành công");
      setForm(null);
      fetchNhanSu();
    } catch {
      toast.error("Lỗi khi cập nhật");
    }
  };

  const filtered = useMemo(() => {
    return dsNhanSu.filter(
      (ns) =>
        ns.hoTen?.toLowerCase().includes(search.toLowerCase()) ||
        ns.maNS?.toLowerCase().includes(search.toLowerCase()) ||
        ns.loaiNS?.toLowerCase().includes(search.toLowerCase()) ||
        ns.chuyenMon?.toLowerCase().includes(search.toLowerCase())
    );
  }, [dsNhanSu, search]);

  const getLoaiNSLabel = (loai) => {
    const labels = {
      YT: "Y tá / Điều dưỡng",
      TN: "Tiếp nhận",
      XN: "Nhân viên xét nghiệm",
      HC: "Hành chính",
      KT: "Kế toán",
    };
    return labels[loai] || loai;
  };

  const getLoaiNSColor = (loai) => {
    const colors = {
      YT: "bg-green-100 text-green-800 border-green-200",
      TN: "bg-blue-100 text-blue-800 border-blue-200",
      XN: "bg-purple-100 text-purple-800 border-purple-200",
      HC: "bg-yellow-100 text-yellow-800 border-yellow-200",
      KT: "bg-orange-100 text-orange-800 border-orange-200",
    };
    return colors[loai] || "bg-gray-100 text-gray-800 border-gray-200";
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
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4 rounded-xl shadow-lg">
            <UserCog size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý nhân viên y tế</h1>
            <p className="text-gray-600">Quản lý thông tin nhân sự trong hệ thống</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, mã NS, loại hoặc chuyên môn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Edit Form Modal */}
      {form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-yellow-600 to-orange-600 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Cập nhật thông tin nhân sự</h2>
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại nhân sự *</label>
                  <select
                    name="loaiNS"
                    value={form.loaiNS || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  >
                    <option value="">-- Chọn loại nhân sự --</option>
                    <option value="YT">Y tá / Điều dưỡng</option>
                    <option value="TN">Tiếp nhận</option>
                    <option value="XN">Nhân viên xét nghiệm</option>
                    <option value="HC">Hành chính</option>
                    <option value="KT">Kế toán</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cấp bậc *</label>
                  <input
                    name="capBac"
                    value={form.capBac || ""}
                    onChange={handleChange}
                    placeholder="Cấp bậc"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chuyên môn *</label>
                  <input
                    name="chuyenMon"
                    value={form.chuyenMon || ""}
                    onChange={handleChange}
                    placeholder="Chuyên môn"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Khoa *</label>
                  <select
                    name="maKhoa"
                    value={form.maKhoa || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  >
                    <option value="">-- Chọn khoa --</option>
                    {dsKhoa.map((k) => (
                      <option key={k.maKhoa} value={k.maKhoa}>
                        {k.tenKhoa} ({k.maKhoa})
                      </option>
                    ))}
                  </select>
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
                  className="px-6 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all shadow-md"
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
          <UserCog size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Không có nhân sự nào</h3>
          <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Mã NS</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Họ tên</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Loại</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Cấp bậc</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Chuyên môn</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Khoa</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((ns) => (
                  <tr key={ns.maNS} className="hover:bg-yellow-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{ns.maNS}</td>
                    <td className="px-6 py-4 text-gray-700 font-semibold">{ns.hoTen}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getLoaiNSColor(ns.loaiNS)}`}>
                        {getLoaiNSLabel(ns.loaiNS)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{ns.capBac}</td>
                    <td className="px-6 py-4 text-gray-700">{ns.chuyenMon}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {dsKhoa.find(k => k.maKhoa === ns.maKhoa)?.tenKhoa || ns.maKhoa}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(ns)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(ns.maNS)}
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

export default ManageNhanSu;

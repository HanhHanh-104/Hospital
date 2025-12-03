import React, { useEffect, useState, useMemo } from "react";
import axios from "../../api/axiosClient";
import toast from "react-hot-toast";
import { FileText, Search, Plus, X, Save, User, Calendar, Clock, Eye } from 'lucide-react';
import { Link } from "react-router-dom";
import dayjs from "dayjs";

function ManageHoSoBenhAn() {
  const [list, setList] = useState([]);
  const [dsBN, setDsBN] = useState([]);
  const [form, setForm] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("role") === "ADMIN";

  const getVNDateTimeLocal = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [res, bnRes] = await Promise.all([
        axios.get("/hsba", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/benhnhan", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (!res.data.success) throw new Error("API trả về lỗi");
      setList(res.data.data || []);
      setDsBN(bnRes.data.data || []);
    } catch (err) {
      console.error("❌ Lỗi tải dữ liệu:", err);
      toast.error("Lỗi tải dữ liệu hồ sơ bệnh án");
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
      await axios.post("/hsba", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Tạo hồ sơ thành công");
      setForm(null);
      fetchAll();
    } catch {
      toast.error("Lỗi khi lưu hồ sơ");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xác nhận xoá hồ sơ?")) return;
    try {
      await axios.delete(`/hsba/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Đã xoá hồ sơ");
      fetchAll();
    } catch {
      toast.error("Lỗi xoá hồ sơ");
    }
  };

  const handleNew = () => {
    setForm({
      maBN: "",
      dotKhamBenh: getVNDateTimeLocal(),
      lichSuBenh: "",
      ghiChu: ""
    });
  };

  const filtered = useMemo(() => {
    return list.filter(
      (row) =>
        row.maHSBA?.toLowerCase().includes(search.toLowerCase()) ||
        row.BenhNhan?.hoTen?.toLowerCase().includes(search.toLowerCase()) ||
        row.lichSuBenh?.toLowerCase().includes(search.toLowerCase())
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
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-4 rounded-xl shadow-lg">
              <FileText size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý hồ sơ bệnh án</h1>
              <p className="text-gray-600">Quản lý tất cả hồ sơ bệnh án trong hệ thống</p>
            </div>
          </div>
          {!isAdmin && (
            <button
              onClick={handleNew}
              className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Plus size={20} />
              Tạo hồ sơ mới
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã HSBA, tên bệnh nhân hoặc lịch sử bệnh..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Form Modal */}
      {form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-violet-600 to-purple-600 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Tạo hồ sơ bệnh án mới</h2>
              <button
                onClick={() => setForm(null)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <User size={16} />
                    Bệnh nhân *
                  </label>
                  <select
                    name="maBN"
                    value={form.maBN || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    required
                  >
                    <option value="">-- Chọn bệnh nhân --</option>
                    {dsBN.map((bn) => (
                      <option key={bn.maBN} value={bn.maBN}>
                        {bn.hoTen} ({bn.maBN})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} />
                    Đợt khám bệnh *
                  </label>
                  <input
                    type="datetime-local"
                    name="dotKhamBenh"
                    value={form.dotKhamBenh || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lịch sử bệnh *</label>
                  <textarea
                    name="lichSuBenh"
                    value={form.lichSuBenh || ""}
                    onChange={handleChange}
                    placeholder="Lịch sử bệnh..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                  <textarea
                    name="ghiChu"
                    value={form.ghiChu || ""}
                    onChange={handleChange}
                    placeholder="Ghi chú..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
                  className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all shadow-md flex items-center gap-2"
                >
                  <Save size={18} />
                  Tạo hồ sơ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FileText size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Không có hồ sơ bệnh án nào</h3>
          <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc tạo hồ sơ mới</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Mã HSBA</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Bệnh nhân</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Đợt khám</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Lịch sử bệnh</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Ghi chú</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((row) => (
                  <tr key={row.maHSBA} className="hover:bg-violet-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      <span className="px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-xs font-semibold">
                        {row.maHSBA}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-semibold">
                      {row.BenhNhan?.hoTen || row.maBN}
                    </td>
                    <td className="px-6 py-4 text-gray-700 flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      {dayjs(row.dotKhamBenh).format("DD/MM/YYYY HH:mm")}
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{row.lichSuBenh}</td>
                    <td className="px-6 py-4 text-gray-600">{row.ghiChu || <span className="text-gray-400 italic">-</span>}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/admin/hosobenhan/${row.maHSBA}`}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </Link>
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

export default ManageHoSoBenhAn;

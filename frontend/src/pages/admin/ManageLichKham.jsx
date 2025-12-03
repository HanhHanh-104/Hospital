import React, { useEffect, useState, useMemo } from "react";
import axios from "../../api/axiosClient";
import toast from "react-hot-toast";
import { Calendar, Search, Edit, Trash2, X, Plus, Save, Clock, User, Stethoscope } from 'lucide-react';
import dayjs from 'dayjs';

function ManageLichKham() {
  const [lichList, setLichList] = useState([]);
  const [form, setForm] = useState(null);
  const [dsBacSi, setDsBacSi] = useState([]);
  const [dsBenhNhan, setDsBenhNhan] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchLichKham = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/lichkham`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLichList(Array.isArray(res.data.data) ? res.data.data : res.data);
    } catch (err) {
      toast.error("Không thể tải lịch khám");
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const [bsRes, bnRes] = await Promise.all([
        axios.get(`/bacsi`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`/benhnhan`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setDsBacSi(bsRes.data.data || []);
      setDsBenhNhan(bnRes.data.data || []);
    } catch {
      toast.error("Lỗi khi tải bác sĩ hoặc bệnh nhân");
    }
  };

  useEffect(() => {
    fetchLichKham();
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;
    try {
      if (form.maLich) {
        await axios.put(`/lichkham/${form.maLich}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Cập nhật lịch khám thành công");
      } else {
        await axios.post(`/lichkham`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Thêm lịch khám mới");
      }
      setForm(null);
      fetchLichKham();
    } catch {
      toast.error("Lỗi khi lưu lịch khám");
    }
  };

  const handleEdit = (lich) => {
    const formattedDate = lich.ngayKham ? dayjs(lich.ngayKham).format('YYYY-MM-DD') : '';
    setForm({ ...lich, ngayKham: formattedDate });
  };

  const handleDelete = async (maLich) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lịch khám này?")) return;
    try {
      await axios.delete(`/lichkham/${maLich}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Đã xoá lịch khám");
      fetchLichKham();
    } catch {
      toast.error("Không thể xoá lịch khám");
    }
  };

  const handleNew = () => {
    setForm({
      maBS: "",
      maBN: "",
      ngayKham: "",
      gioKham: "",
      phong: "",
      ghiChu: ""
    });
  };

  const filtered = useMemo(() => {
    return lichList.filter(
      (lich) =>
        lich.BacSi?.hoTen?.toLowerCase().includes(search.toLowerCase()) ||
        lich.BenhNhan?.hoTen?.toLowerCase().includes(search.toLowerCase()) ||
        lich.maLich?.toLowerCase().includes(search.toLowerCase()) ||
        lich.phong?.toLowerCase().includes(search.toLowerCase())
    );
  }, [lichList, search]);

  const getStatusBadge = (trangThai) => {
    const statusMap = {
      'CHO_THANH_TOAN': { label: 'Chờ thanh toán', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'DA_THANH_TOAN': { label: 'Đã thanh toán', color: 'bg-green-100 text-green-800 border-green-200' },
      'DA_HUY': { label: 'Đã hủy', color: 'bg-red-100 text-red-800 border-red-200' },
    };
    const status = statusMap[trangThai] || { label: trangThai, color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4 rounded-xl shadow-lg">
              <Calendar size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý lịch khám</h1>
              <p className="text-gray-600">Quản lý tất cả lịch hẹn khám bệnh</p>
            </div>
          </div>
          <button
            onClick={handleNew}
            className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Tạo lịch mới
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo bác sĩ, bệnh nhân, mã lịch hoặc phòng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Form Modal */}
      {form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-red-600 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {form.maLich ? "Cập nhật lịch khám" : "Tạo lịch khám mới"}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Stethoscope size={16} />
                    Bác sĩ *
                  </label>
                  <select
                    name="maBS"
                    value={form.maBS || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="">-- Chọn bác sĩ --</option>
                    {dsBacSi.map((bs) => (
                      <option key={bs.maBS} value={bs.maBS}>{bs.hoTen} ({bs.maBS})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <User size={16} />
                    Bệnh nhân *
                  </label>
                  <select
                    name="maBN"
                    value={form.maBN || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="">-- Chọn bệnh nhân --</option>
                    {dsBenhNhan.map((bn) => (
                      <option key={bn.maBN} value={bn.maBN}>{bn.hoTen} ({bn.maBN})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} />
                    Ngày khám *
                  </label>
                  <input
                    type="date"
                    name="ngayKham"
                    value={form.ngayKham || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Clock size={16} />
                    Giờ khám *
                  </label>
                  <input
                    type="time"
                    name="gioKham"
                    value={form.gioKham || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phòng khám *</label>
                  <input
                    type="text"
                    name="phong"
                    value={form.phong || ""}
                    onChange={handleChange}
                    placeholder="Phòng khám"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                  <select
                    name="trangThai"
                    value={form.trangThai || "CHO_THANH_TOAN"}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="CHO_THANH_TOAN">Chờ thanh toán</option>
                    <option value="DA_THANH_TOAN">Đã thanh toán</option>
                    <option value="DA_HUY">Đã hủy</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                  <textarea
                    name="ghiChu"
                    value={form.ghiChu || ""}
                    onChange={handleChange}
                    placeholder="Ghi chú..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-md flex items-center gap-2"
                >
                  <Save size={18} />
                  {form.maLich ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Không có lịch khám nào</h3>
          <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc tạo lịch mới</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Mã lịch</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Bác sĩ</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Bệnh nhân</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Ngày</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Giờ</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Phòng</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Trạng thái</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((lich) => (
                  <tr key={lich.maLich} className="hover:bg-orange-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{lich.maLich}</td>
                    <td className="px-6 py-4 text-gray-700 font-semibold">
                      {lich.BacSi?.hoTen || lich.hoTenBS || lich.maBS}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {lich.BenhNhan?.hoTen || lich.hoTenBN || lich.maBN}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {lich.ngayKham ? dayjs(lich.ngayKham).format('DD/MM/YYYY') : lich.ngayKham}
                    </td>
                    <td className="px-6 py-4 text-gray-700 flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      {lich.gioKham}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {lich.phong || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(lich.trangThai)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(lich)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(lich.maLich)}
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

export default ManageLichKham;

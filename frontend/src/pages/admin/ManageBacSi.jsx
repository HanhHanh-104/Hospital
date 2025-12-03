import React, { useEffect, useState } from "react";
import axios from "../../api/axiosClient";
import toast from "react-hot-toast";
import { Stethoscope, Search, Edit, Trash2, Plus, X, Info } from 'lucide-react';
import { getChuyenMonByCapBac, getMoTaChuyenMon } from "../../constants/chuyenMon";

function ManageBacSi() {
  const [dsBacSi, setDsBacSi] = useState([]);
  const [dsKhoa, setDsKhoa] = useState([]);
  const [form, setForm] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchBacSi = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/bacsi`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDsBacSi(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      toast.error("Lỗi khi tải danh sách bác sĩ");
    } finally {
      setLoading(false);
    }
  };

  const fetchKhoa = async () => {
    try {
      const res = await axios.get(`/khoa`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDsKhoa(Array.isArray(res.data.data) ? res.data.data : res.data);
    } catch (err) {
      toast.error("Lỗi khi tải danh sách khoa");
    }
  };

  useEffect(() => {
    fetchBacSi();
    fetchKhoa();
  }, []);

  const handleEdit = (bs) => {
    setForm({ ...bs });
  };

  const handleDelete = async (maBS) => {
    if (!window.confirm("Xác nhận xóa bác sĩ?")) return;
    try {
      await axios.delete(`/bacsi/${maBS}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Đã xóa bác sĩ");
      fetchBacSi();
    } catch (err) {
      toast.error("Không thể xóa bác sĩ");
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form) return;
    try {
      await axios.put(`/bacsi/${form.maBS}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Cập nhật bác sĩ thành công");
      setForm(null);
      fetchBacSi();
    } catch (err) {
      toast.error("Lỗi khi cập nhật bác sĩ");
    }
  };

  const filtered = dsBacSi.filter(
    (bs) =>
      bs.hoTen?.toLowerCase().includes(search.toLowerCase()) ||
      bs.maBS?.toLowerCase().includes(search.toLowerCase()) ||
      bs.chuyenMon?.toLowerCase().includes(search.toLowerCase()) ||
      bs.capBac?.toLowerCase().includes(search.toLowerCase())
  );

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
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-xl shadow-lg">
            <Stethoscope size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý bác sĩ</h1>
            <p className="text-gray-600">Quản lý thông tin bác sĩ trong hệ thống</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, mã BS, chuyên môn hoặc cấp bậc..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Edit Form Modal */}
      {form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Cập nhật thông tin bác sĩ</h2>
              <button
                onClick={() => setForm(null)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ tên *</label>
                  <input
                    name="hoTen"
                    value={form.hoTen || ""}
                    onChange={handleChange}
                    placeholder="Họ tên"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    Chuyên môn *
                    {form.capBac && (
                      <span className="text-xs text-gray-500 font-normal flex items-center gap-1">
                        <Info size={14} />
                        {getMoTaChuyenMon(form.capBac)}
                      </span>
                    )}
                  </label>
                  <select
                    name="chuyenMon"
                    value={form.chuyenMon || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                    disabled={!form.capBac}
                  >
                    <option value="">
                      {form.capBac 
                        ? `-- Chọn chuyên môn (${getChuyenMonByCapBac(form.capBac).length} lựa chọn) --` 
                        : "-- Vui lòng chọn cấp bậc trước --"}
                    </option>
                    {form.capBac && getChuyenMonByCapBac(form.capBac).map((cm) => (
                      <option key={cm} value={cm}>
                        {cm}
                      </option>
                    ))}
                  </select>
                  {!form.capBac ? (
                    <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                      <Info size={12} />
                      Vui lòng chọn cấp bậc trước để hiển thị danh sách chuyên môn phù hợp
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      Có {getChuyenMonByCapBac(form.capBac).length} chuyên môn phù hợp với cấp bậc này
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trình độ *</label>
                  <input
                    name="trinhDo"
                    value={form.trinhDo || ""}
                    onChange={handleChange}
                    placeholder="Trình độ"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cấp bậc *</label>
                  <select
                    name="capBac"
                    value={form.capBac || ""}
                    onChange={(e) => {
                      handleChange(e);
                      // Reset chuyên môn khi thay đổi cấp bậc
                      setForm(prev => ({ ...prev, capBac: e.target.value, chuyenMon: "" }));
                    }}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">-- Chọn cấp bậc --</option>
                    <option value="Bác sĩ thực tập">1️⃣ Bác sĩ thực tập (Intern)</option>
                    <option value="Bác sĩ sơ cấp">2️⃣ Bác sĩ sơ cấp / Bác sĩ mới ra trường</option>
                    <option value="Bác sĩ điều trị">3️⃣ Bác sĩ điều trị (Resident Doctor)</option>
                    <option value="Bác sĩ chuyên khoa I">4️⃣ Bác sĩ chuyên khoa I (BSCK I)</option>
                    <option value="Bác sĩ chuyên khoa II">5️⃣ Bác sĩ chuyên khoa II (BSCK II)</option>
                    <option value="Thạc sĩ – Bác sĩ">6️⃣ Thạc sĩ – Bác sĩ (MSc – MD)</option>
                    <option value="Tiến sĩ – Bác sĩ">7️⃣ Tiến sĩ – Bác sĩ (PhD – MD)</option>
                    <option value="Phó giáo sư – Bác sĩ">8️⃣ Phó giáo sư – Bác sĩ (PGS – TS – BS)</option>
                    <option value="Giáo sư – Bác sĩ">9️⃣ Giáo sư – Bác sĩ (GS – TS – BS)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chức vụ *</label>
                  <input
                    name="chucVu"
                    value={form.chucVu || ""}
                    onChange={handleChange}
                    placeholder="Chức vụ"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Khoa *</label>
                  <select
                    name="maKhoa"
                    value={form.maKhoa || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">-- Chọn khoa --</option>
                    {dsKhoa.map((khoa) => (
                      <option key={khoa.maKhoa} value={khoa.maKhoa}>
                        {khoa.tenKhoa} ({khoa.maKhoa})
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
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md"
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
          <Stethoscope size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Không có bác sĩ nào</h3>
          <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Mã BS</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Họ tên</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Chuyên môn</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Cấp bậc</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Trình độ</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Chức vụ</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Khoa</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((bs) => (
                  <tr key={bs.maBS} className="hover:bg-green-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{bs.maBS}</td>
                    <td className="px-6 py-4 text-gray-700 font-semibold">{bs.hoTen}</td>
                    <td className="px-6 py-4 text-gray-700">{bs.chuyenMon}</td>
                    <td className="px-6 py-4">
                      {bs.capBac ? (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          bs.capBac === "Bác sĩ thực tập" ? "bg-gray-100 text-gray-700" :
                          bs.capBac === "Bác sĩ sơ cấp" ? "bg-blue-100 text-blue-700" :
                          bs.capBac === "Bác sĩ điều trị" ? "bg-green-100 text-green-700" :
                          bs.capBac === "Bác sĩ chuyên khoa I" ? "bg-purple-100 text-purple-700" :
                          bs.capBac === "Bác sĩ chuyên khoa II" ? "bg-indigo-100 text-indigo-700" :
                          bs.capBac === "Thạc sĩ – Bác sĩ" ? "bg-orange-100 text-orange-700" :
                          bs.capBac === "Tiến sĩ – Bác sĩ" ? "bg-red-100 text-red-700" :
                          bs.capBac === "Phó giáo sư – Bác sĩ" ? "bg-yellow-100 text-yellow-700" :
                          bs.capBac === "Giáo sư – Bác sĩ" ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-white" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {bs.capBac}
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">Chưa có</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{bs.trinhDo}</td>
                    <td className="px-6 py-4 text-gray-700">{bs.chucVu}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {dsKhoa.find(k => k.maKhoa === bs.maKhoa)?.tenKhoa || bs.maKhoa}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(bs)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(bs.maBS)}
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

export default ManageBacSi;

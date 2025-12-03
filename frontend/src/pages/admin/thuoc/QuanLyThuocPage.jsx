import React, { useEffect, useState, useMemo } from "react";
import {
  getAllThuoc,
  createThuoc,
  updateThuoc,
  deleteThuoc,
  getOneThuoc,
} from "../../../services/thuoc/thuocService";
import {
  getAllNhomThuoc
} from "../../../services/thuoc/nhomthuocService";
import {
  getAllDonViTinh
} from "../../../services/thuoc/donvitinhService";
import toast from "react-hot-toast";
import { Pill, Search, Edit, Trash2, X, Plus, Save, Package, DollarSign, Calendar } from 'lucide-react';
import dayjs from 'dayjs';

const QuanLyThuocPage = () => {
  const [thuocList, setThuocList] = useState([]);
  const [formData, setFormData] = useState(null);
  const [nhomThuocList, setNhomThuocList] = useState([]);
  const [donViTinhList, setDonViTinhList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dsThuoc, dsNhom, dsDonVi] = await Promise.all([
        getAllThuoc(), getAllNhomThuoc(), getAllDonViTinh()
      ]);
      setThuocList(dsThuoc || []);
      setNhomThuocList(dsNhom || []);
      setDonViTinhList(dsDonVi || []);
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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = async (maThuoc) => {
    try {
      const res = await getOneThuoc(maThuoc);
      if (res) {
        const formattedDate = res.hanSuDung ? dayjs(res.hanSuDung).format('YYYY-MM-DD') : '';
        setFormData({ ...res, hanSuDung: formattedDate });
      }
    } catch (err) {
      toast.error("Lỗi khi tải thông tin thuốc");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData) return;
    
    try {
      const dataToSubmit = {
        ...formData,
        hanSuDung: formData.hanSuDung?.slice(0, 10),
        trangThai: 1,
      };

      if (formData.maThuoc) {
        await updateThuoc(formData.maThuoc, dataToSubmit);
        toast.success("Cập nhật thuốc thành công");
      } else {
        await createThuoc(dataToSubmit);
        toast.success("Thêm thuốc mới thành công");
      }

      await fetchData();
      setFormData(null);
    } catch (err) {
      toast.error("Lỗi khi lưu thuốc");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn xoá thuốc này?")) return;
    try {
      await deleteThuoc(id);
      toast.success("Đã xoá thuốc");
      await fetchData();
    } catch (err) {
      toast.error("Lỗi khi xoá thuốc");
    }
  };

  const handleNew = () => {
    setFormData({
      tenThuoc: "",
      tenHoatChat: "",
      hamLuong: "",
      soDangKy: "",
      nuocSanXuat: "",
      hangSanXuat: "",
      giaNhap: "",
      giaBanLe: "",
      giaBanBuon: "",
      tonKhoToiThieu: "",
      tonKhoHienTai: "",
      hanSuDung: "",
      maNhom: "",
      maDVT: ""
    });
  };

  const filtered = useMemo(() => {
    return thuocList.filter(
      (t) =>
        t.tenThuoc?.toLowerCase().includes(search.toLowerCase()) ||
        t.maThuoc?.toLowerCase().includes(search.toLowerCase()) ||
        t.tenHoatChat?.toLowerCase().includes(search.toLowerCase())
    );
  }, [thuocList, search]);

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
            <div className="bg-gradient-to-r from-red-600 to-pink-600 p-4 rounded-xl shadow-lg">
              <Pill size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý thuốc</h1>
              <p className="text-gray-600">Quản lý danh mục thuốc trong hệ thống</p>
            </div>
          </div>
          <button
            onClick={handleNew}
            className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Thêm thuốc mới
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên thuốc, mã thuốc hoặc hoạt chất..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Form Modal */}
      {formData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-red-600 to-pink-600 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {formData.maThuoc ? "Cập nhật thuốc" : "Thêm thuốc mới"}
              </h2>
              <button
                onClick={() => setFormData(null)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên thuốc *</label>
                  <input
                    name="tenThuoc"
                    value={formData.tenThuoc || ""}
                    onChange={handleChange}
                    placeholder="Tên thuốc"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hoạt chất *</label>
                  <input
                    name="tenHoatChat"
                    value={formData.tenHoatChat || ""}
                    onChange={handleChange}
                    placeholder="Hoạt chất"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hàm lượng</label>
                  <input
                    name="hamLuong"
                    value={formData.hamLuong || ""}
                    onChange={handleChange}
                    placeholder="Hàm lượng"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số đăng ký</label>
                  <input
                    name="soDangKy"
                    value={formData.soDangKy || ""}
                    onChange={handleChange}
                    placeholder="Số đăng ký"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nước sản xuất</label>
                  <input
                    name="nuocSanXuat"
                    value={formData.nuocSanXuat || ""}
                    onChange={handleChange}
                    placeholder="Nước SX"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hãng sản xuất</label>
                  <input
                    name="hangSanXuat"
                    value={formData.hangSanXuat || ""}
                    onChange={handleChange}
                    placeholder="Hãng SX"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign size={16} />
                    Giá nhập
                  </label>
                  <input
                    type="number"
                    name="giaNhap"
                    value={formData.giaNhap || ""}
                    onChange={handleChange}
                    placeholder="Giá nhập"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign size={16} />
                    Giá bán lẻ
                  </label>
                  <input
                    type="number"
                    name="giaBanLe"
                    value={formData.giaBanLe || ""}
                    onChange={handleChange}
                    placeholder="Giá bán lẻ"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign size={16} />
                    Giá bán buôn
                  </label>
                  <input
                    type="number"
                    name="giaBanBuon"
                    value={formData.giaBanBuon || ""}
                    onChange={handleChange}
                    placeholder="Giá bán buôn"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Package size={16} />
                    Tồn tối thiểu
                  </label>
                  <input
                    type="number"
                    name="tonKhoToiThieu"
                    value={formData.tonKhoToiThieu || ""}
                    onChange={handleChange}
                    placeholder="Tồn tối thiểu"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Package size={16} />
                    Tồn hiện tại
                  </label>
                  <input
                    type="number"
                    name="tonKhoHienTai"
                    value={formData.tonKhoHienTai || ""}
                    onChange={handleChange}
                    placeholder="Tồn hiện tại"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} />
                    Hạn sử dụng
                  </label>
                  <input
                    type="date"
                    name="hanSuDung"
                    value={formData.hanSuDung || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nhóm thuốc *</label>
                  <select
                    name="maNhom"
                    value={formData.maNhom || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">-- Chọn nhóm thuốc --</option>
                    {nhomThuocList.map(n => <option key={n.maNhom} value={n.maNhom}>{n.tenNhom}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Đơn vị tính *</label>
                  <select
                    name="maDVT"
                    value={formData.maDVT || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">-- Chọn đơn vị tính --</option>
                    {donViTinhList.map(d => <option key={d.maDVT} value={d.maDVT}>{d.tenDVT}</option>)}
                  </select>
                </div>
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
                  className="px-6 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all shadow-md flex items-center gap-2"
                >
                  <Save size={18} />
                  {formData.maThuoc ? "Cập nhật" : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Pill size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Không có thuốc nào</h3>
          <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc thêm thuốc mới</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Mã</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Tên thuốc</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Hoạt chất</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">ĐVT</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Nhóm</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Tồn</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Hạn SD</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map(t => (
                  <tr key={t.maThuoc} className="hover:bg-red-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                        {t.maThuoc}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-semibold">{t.tenThuoc}</td>
                    <td className="px-6 py-4 text-gray-700">{t.tenHoatChat}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {t.DonViTinh?.tenDVT || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        {t.NhomThuoc?.tenNhom || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        (t.tonKhoHienTai || 0) < (t.tonKhoToiThieu || 0)
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {t.tonKhoHienTai || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {t.hanSuDung ? dayjs(t.hanSuDung).format('DD/MM/YYYY') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(t.maThuoc)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(t.maThuoc)}
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

export default QuanLyThuocPage;

import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { getAllKetQua } from "../../../services/xetnghiem_BN/ketquaxetnghiemService";
import { Calendar, Download, Filter, Microscope, Search, Shield } from "lucide-react";

const KetQuaXetNghiemPage = () => {
  const maBN = localStorage.getItem("maBN");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  useEffect(() => {
    dayjs.locale("vi");
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllKetQua();
      const all = res.data.data || [];
      const own = all.filter((item) => item.YeuCau?.maBN === maBN);
      setList(own);
    } catch (err) {
      console.error("❌ Lỗi tải kết quả xét nghiệm:", err);
      setError("Không thể tải danh sách kết quả. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const uniqueTypes = useMemo(() => {
    const map = new Map();
    list.forEach((item) => {
      const typeId = item.XetNghiem?.maLoaiXN || "Khác";
      const typeLabel = item.XetNghiem?.LoaiXN?.tenLoai || item.XetNghiem?.maLoaiXN || "Khác";
      if (!map.has(typeId)) {
        map.set(typeId, typeLabel);
      }
    });
    return Array.from(map.entries());
  }, [list]);

  const filteredResults = useMemo(() => {
    let result = [...list];
    if (dateFilter) {
      result = result.filter((item) =>
        dayjs(item.ngayThucHien).isSame(dayjs(dateFilter), "day")
      );
    }
    if (typeFilter !== "ALL") {
      result = result.filter((item) => (item.XetNghiem?.maLoaiXN || "Khác") === typeFilter);
    }
    if (keyword.trim()) {
      const lower = keyword.toLowerCase();
      result = result.filter(
        (item) =>
          item.XetNghiem?.tenXN?.toLowerCase().includes(lower) ||
          item.ketQua?.toLowerCase().includes(lower) ||
          item.NhanSuYTe?.hoTen?.toLowerCase().includes(lower)
      );
    }
    return result.sort((a, b) => {
      const aDate = new Date(a.ngayThucHien || 0).getTime();
      const bDate = new Date(b.ngayThucHien || 0).getTime();
      return bDate - aDate;
    });
  }, [list, dateFilter, typeFilter, keyword]);

  const totalCount = list.length;
  const latestResult = filteredResults[0];
  const completedCount = filteredResults.filter((item) => !!item.ketQua).length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-700 to-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-1/3 bg-white/10 blur-3xl"></div>
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-widest text-white/70 font-semibold">
                Kết quả xét nghiệm
              </p>
              <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                Theo dõi sức khỏe một cách khoa học
              </h1>
              <p className="text-white/85 max-w-2xl">
                Xem đầy đủ kết quả, ghi chú của kỹ thuật viên và tải báo cáo để chia sẻ với bác sĩ.
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-md min-w-[240px]">
              <p className="text-sm uppercase tracking-wider text-blue-100 font-semibold mb-1">
                Tổng số lần xét nghiệm
              </p>
              <div className="text-4xl font-extrabold">{totalCount}</div>
              <p className="text-sm text-white/80 mt-1">
                {completedCount} kết quả đã có báo cáo chi tiết
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Bộ lọc</h2>
              <p className="text-sm text-slate-500">Tìm nhanh kết quả bạn cần xem lại.</p>
            </div>
            <button
              onClick={() => {
                setKeyword("");
                setDateFilter("");
                setTypeFilter("ALL");
              }}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              Đặt lại bộ lọc
            </button>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <label className="text-sm text-slate-500 space-y-1">
              <span className="font-semibold text-slate-700">Tìm kiếm</span>
              <div className="flex items-center gap-2 border border-slate-200 rounded-2xl px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-100">
                <Search size={18} className="text-slate-400" />
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-slate-700"
                  placeholder="Tên xét nghiệm, người thực hiện..."
                />
              </div>
            </label>
            <label className="text-sm text-slate-500 space-y-1">
              <span className="font-semibold text-slate-700">Ngày thực hiện</span>
              <div className="flex items-center gap-2 border border-slate-200 rounded-2xl px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-100">
                <Calendar size={18} className="text-slate-400" />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-slate-700"
                />
              </div>
            </label>
            <label className="text-sm text-slate-500 space-y-1">
              <span className="font-semibold text-slate-700">Loại xét nghiệm</span>
              <div className="flex items-center gap-2 border border-slate-200 rounded-2xl px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-100">
                <Filter size={18} className="text-slate-400" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-slate-700"
                >
                  <option value="ALL">Tất cả</option>
                  {uniqueTypes.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </label>
            {latestResult && (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 flex items-start gap-3">
                <Shield size={20} className="text-indigo-500 mt-1" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Gần nhất</p>
                  <p className="font-semibold text-slate-900">
                    {latestResult.XetNghiem?.tenXN || "Xét nghiệm"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {dayjs(latestResult.ngayThucHien).format("DD/MM/YYYY HH:mm")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                Danh sách kết quả ({filteredResults.length})
              </h3>
              <p className="text-sm text-slate-500">
                Sắp xếp theo ngày thực hiện mới nhất.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="animate-pulse h-24 bg-slate-100 rounded-2xl"></div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-rose-50 text-rose-700 rounded-2xl p-6 text-center font-semibold">
              {error}
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center mb-4 text-slate-400 text-2xl">
                🧾
              </div>
              <p className="text-lg font-semibold text-slate-800">Không tìm thấy kết quả phù hợp</p>
              <p className="text-sm text-slate-500 mt-1">
                Thử đổi ngày hoặc loại xét nghiệm khác để xem thêm dữ liệu.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResults.map((item) => (
                <div
                  key={item.maPhieuXN}
                  className="rounded-2xl border border-slate-100 shadow-sm p-5 hover:border-indigo-200 transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Phiếu #{item.maPhieuXN}
                      </p>
                      <div className="flex items-center gap-2 text-slate-900 text-lg font-semibold">
                        <Microscope size={20} className="text-indigo-500" />
                        {item.XetNghiem?.tenXN || "Xét nghiệm"}
                      </div>
                      <p className="text-sm text-slate-500">
                        {dayjs(item.ngayThucHien).format("dddd, DD/MM/YYYY HH:mm")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full">
                      <Calendar size={16} /> Lệnh: {item.YeuCau?.maYeuCau || "N/A"}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 mt-4 text-sm">
                    <div className="bg-slate-50 rounded-xl px-4 py-3">
                      <p className="text-xs uppercase tracking-wide text-slate-400">Loại</p>
                      <p className="font-semibold text-slate-900 mt-1">
                        {item.XetNghiem?.LoaiXN?.tenLoai || item.XetNghiem?.maLoaiXN || "Khác"}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl px-4 py-3">
                      <p className="text-xs uppercase tracking-wide text-slate-400">Kết quả</p>
                      <p className="font-semibold text-slate-900 mt-1">
                        {item.ketQua || "Đang xử lý"}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl px-4 py-3">
                      <p className="text-xs uppercase tracking-wide text-slate-400">Kỹ thuật viên</p>
                      <p className="font-semibold text-slate-900 mt-1">
                        {item.NhanSuYTe?.hoTen || "Đang cập nhật"}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl px-4 py-3">
                      <p className="text-xs uppercase tracking-wide text-slate-400">Ghi chú</p>
                      <p className="font-semibold text-slate-900 mt-1">{item.ghiChu || "—"}</p>
                    </div>
                  </div>

                  {item.file && (
                    <div className="mt-4">
                      <a
                        href={item.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition"
                      >
                        <Download size={16} />
                        Tải báo cáo đính kèm
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KetQuaXetNghiemPage;

import React, { useEffect, useState, useMemo } from "react";
import { getAllTinTuc, getOneTinTuc } from "../../../services/tintuc/tintucService";
import { Link } from "react-router-dom";
import { Newspaper, Search, Calendar, Eye, ArrowRight } from 'lucide-react';
import dayjs from 'dayjs';

const TinTucPage = () => {
  const [tinTucList, setTinTucList] = useState([]);
  const [selectedTin, setSelectedTin] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTinTuc();
  }, []);

  const fetchTinTuc = async () => {
    setLoading(true);
    try {
      const res = await getAllTinTuc({ trangThai: "HIEN_THI" });
      setTinTucList(res.data.data || []);
    } catch (err) {
      console.error("Lỗi tải tin tức:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (maTin) => {
    try {
      const res = await getOneTinTuc(maTin);
      setSelectedTin(res.data.data);
    } catch (err) {
      console.error("Lỗi tải chi tiết:", err);
    }
  };

  const filtered = useMemo(() => {
    return tinTucList.filter(
      (tin) =>
        tin.tieuDe?.toLowerCase().includes(search.toLowerCase()) ||
        tin.tomTat?.toLowerCase().includes(search.toLowerCase()) ||
        tin.noiDung?.toLowerCase().includes(search.toLowerCase())
    );
  }, [tinTucList, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Đang tải tin tức...</p>
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
            <Newspaper size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Tin tức & Thông báo</h1>
            <p className="text-gray-600">Cập nhật thông tin sức khỏe và thông báo từ bệnh viện</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm tin tức..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Modal Chi tiết */}
      {selectedTin && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{selectedTin.tieuDe}</h2>
              <button
                onClick={() => setSelectedTin(null)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  {dayjs(selectedTin.ngayDang).format("DD/MM/YYYY HH:mm")}
                </span>
                <span className="flex items-center gap-2">
                  <Eye size={16} />
                  {selectedTin.luotXem || 0} lượt xem
                </span>
              </div>
              {selectedTin.hinhAnh && (
                <img src={selectedTin.hinhAnh} alt={selectedTin.tieuDe} className="w-full rounded-lg mb-4" />
              )}
              {selectedTin.tomTat && (
                <p className="text-lg text-gray-700 mb-4 font-medium">{selectedTin.tomTat}</p>
              )}
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selectedTin.noiDung }} />
            </div>
          </div>
        </div>
      )}

      {/* Danh sách tin tức */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Newspaper size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Không có tin tức nào</h3>
          <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tin) => (
            <div
              key={tin.maTin}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-all cursor-pointer"
              onClick={() => handleViewDetail(tin.maTin)}
            >
              {tin.hinhAnh && (
                <img src={tin.hinhAnh} alt={tin.tieuDe} className="w-full h-48 object-cover" />
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <Calendar size={14} />
                  {dayjs(tin.ngayDang).format("DD/MM/YYYY")}
                  <span className="mx-2">•</span>
                  <Eye size={14} />
                  {tin.luotXem || 0}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{tin.tieuDe}</h3>
                {tin.tomTat && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{tin.tomTat}</p>
                )}
                <button className="text-blue-600 font-semibold text-sm flex items-center gap-2 hover:text-blue-700">
                  Đọc thêm <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TinTucPage;


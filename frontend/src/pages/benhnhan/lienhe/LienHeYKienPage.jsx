import React, { useEffect, useState } from "react";
import { createPhanHoi, getPhanHoiByBenhNhan } from "../../../services/phanhoi/phanhoiService";
import toast from "react-hot-toast";
import { MessageSquare, Send, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';

const LienHeYKienPage = () => {
  const [form, setForm] = useState({ tieuDe: "", noiDung: "", loai: "PHAN_HOI" });
  const [phanHoiList, setPhanHoiList] = useState([]);
  const [loading, setLoading] = useState(false);
  const maBN = localStorage.getItem("maBN");

  useEffect(() => {
    if (maBN) {
      fetchPhanHoi();
    }
  }, [maBN]);

  const fetchPhanHoi = async () => {
    try {
      const res = await getPhanHoiByBenhNhan(maBN);
      setPhanHoiList(res.data.data || []);
    } catch (err) {
      console.error("Lỗi tải phản hồi:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.noiDung.trim()) {
      toast.error("Vui lòng nhập nội dung phản hồi");
      return;
    }

    setLoading(true);
    try {
      await createPhanHoi({ ...form, maBN });
      toast.success("Gửi phản hồi thành công!");
      setForm({ tieuDe: "", noiDung: "", loai: "PHAN_HOI" });
      fetchPhanHoi();
    } catch (err) {
      toast.error("Lỗi khi gửi phản hồi");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (trangThai) => {
    const statusMap = {
      'CHO_XU_LY': { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
      'DANG_XU_LY': { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: AlertCircle },
      'DA_XU_LY': { label: 'Đã xử lý', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
    };
    const status = statusMap[trangThai] || { label: trangThai, color: 'bg-gray-100 text-gray-800', icon: XCircle };
    const Icon = status.icon;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${status.color}`}>
        <Icon size={14} />
        {status.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-xl shadow-lg">
            <MessageSquare size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Liên hệ & Ý kiến</h1>
            <p className="text-gray-600">Gửi phản hồi về chất lượng dịch vụ hoặc đặt câu hỏi</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Gửi phản hồi */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Send size={24} className="text-blue-600" />
            Gửi phản hồi mới
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề (tùy chọn)</label>
              <input
                type="text"
                value={form.tieuDe}
                onChange={(e) => setForm({ ...form, tieuDe: e.target.value })}
                placeholder="VD: Phản hồi về dịch vụ khám bệnh"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loại phản hồi</label>
              <select
                value={form.loai}
                onChange={(e) => setForm({ ...form, loai: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="PHAN_HOI">Phản hồi</option>
                <option value="CAU_HOI">Câu hỏi</option>
                <option value="GOI_Y">Góp ý</option>
                <option value="KHAC">Khác</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung *</label>
              <textarea
                value={form.noiDung}
                onChange={(e) => setForm({ ...form, noiDung: e.target.value })}
                placeholder="Nhập nội dung phản hồi của bạn..."
                rows={6}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send size={18} />
              {loading ? "Đang gửi..." : "Gửi phản hồi"}
            </button>
          </form>
        </div>

        {/* Danh sách phản hồi */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MessageSquare size={24} className="text-blue-600" />
            Lịch sử phản hồi ({phanHoiList.length})
          </h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {phanHoiList.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Chưa có phản hồi nào</p>
              </div>
            ) : (
              phanHoiList.map((ph) => (
                <div key={ph.maPH} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{ph.tieuDe || "Phản hồi"}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {dayjs(ph.ngayGui).format("DD/MM/YYYY HH:mm")}
                      </p>
                    </div>
                    {getStatusBadge(ph.trangThai)}
                  </div>
                  <p className="text-gray-700 text-sm mb-3">{ph.noiDung}</p>
                  {ph.phanHoi && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg">
                      <p className="text-xs font-semibold text-blue-800 mb-1">Phản hồi từ bệnh viện:</p>
                      <p className="text-sm text-gray-700">{ph.phanHoi}</p>
                      {ph.ngayPhanHoi && (
                        <p className="text-xs text-gray-500 mt-2">
                          {dayjs(ph.ngayPhanHoi).format("DD/MM/YYYY HH:mm")}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LienHeYKienPage;


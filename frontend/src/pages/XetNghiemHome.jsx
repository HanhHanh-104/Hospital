import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axiosClient";
import {
  FlaskConical,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Activity,
  ClipboardCheck,
  TestTube
} from "lucide-react";
import toast from "react-hot-toast";

const StatCard = ({ icon: Icon, title, value, subtitle, color = "indigo", link }) => {
  const colorClasses = {
    indigo: "bg-indigo-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    green: "bg-green-500",
    red: "bg-red-500"
  };

  const content = (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`${colorClasses[color]} p-3 rounded-lg text-white`}>
          <Icon size={24} />
        </div>
        {subtitle && (
          <span className="text-xs text-gray-500 font-medium">{subtitle}</span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );

  if (link) {
    return <Link to={link}>{content}</Link>;
  }
  return content;
};

const XetNghiemHome = () => {
  const [stats, setStats] = useState({
    yeuCauChoXuLy: 0,
    phieuChoXuLy: 0,
    phieuHoanThanh: 0,
    tongYeuCau: 0
  });
  const [loading, setLoading] = useState(true);
  const [nhanSuInfo, setNhanSuInfo] = useState(null);

  useEffect(() => {
    fetchNhanSuInfo();
    fetchStats();
  }, []);

  const fetchNhanSuInfo = async () => {
    try {
      const maTK = localStorage.getItem("maTK");
      if (!maTK) return;

      const res = await axios.get(`/nhansu/maTK/${maTK}`);
      const data = res.data.data || res.data;
      setNhanSuInfo(data);
    } catch (err) {
      console.error("Lỗi tải thông tin nhân sự:", err);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [yeuCauRes, phieuRes] = await Promise.all([
        axios.get("/yeucauxetnghiem").catch(() => ({ data: { data: [] } })),
        axios.get("/phieuxetnghiem").catch(() => ({ data: { data: [] } }))
      ]);

      const yeuCauChoXuLy = (yeuCauRes.data.data || []).filter(
        yc => yc.trangThai === 'CHO_THUC_HIEN' || yc.trangThai === 'CHO_XU_LY'
      ).length;

      const phieuChoXuLy = (phieuRes.data.data || []).filter(
        p => !p.ketQua || p.ketQua === '' || p.trangThai === 'CHO_XU_LY'
      ).length;

      const phieuHoanThanh = (phieuRes.data.data || []).filter(
        p => p.ketQua && p.ketQua !== '' && p.trangThai === 'HOAN_THANH'
      ).length;

      setStats({
        yeuCauChoXuLy,
        phieuChoXuLy,
        phieuHoanThanh,
        tongYeuCau: (yeuCauRes.data.data || []).length
      });
    } catch (err) {
      console.error("Lỗi tải thống kê:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <TestTube size={48} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {nhanSuInfo?.hoTen || "Nhân viên xét nghiệm"}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-indigo-100">
                {nhanSuInfo?.chuyenMon && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
                    <FlaskConical size={18} />
                    <span className="font-medium">{nhanSuInfo.chuyenMon}</span>
                  </div>
                )}
                {nhanSuInfo?.KhoaPhong?.tenKhoa && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
                    <span>{nhanSuInfo.KhoaPhong.tenKhoa}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-indigo-100 text-sm mb-1">Chào mừng trở lại!</p>
            <p className="text-xl font-semibold">
              {new Date().toLocaleDateString('vi-VN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FlaskConical}
          title="Yêu cầu chờ xử lý"
          value={stats.yeuCauChoXuLy}
          color="indigo"
          link="/xetnghiem/xetnghiem/yeucau"
        />
        <StatCard
          icon={FileText}
          title="Phiếu chờ xử lý"
          value={stats.phieuChoXuLy}
          color="blue"
          link="/xetnghiem/xetnghiem/phieu"
        />
        <StatCard
          icon={CheckCircle2}
          title="Phiếu hoàn thành"
          value={stats.phieuHoanThanh}
          color="green"
        />
        <StatCard
          icon={TrendingUp}
          title="Tổng yêu cầu"
          value={stats.tongYeuCau}
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Thao tác nhanh */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
            <Activity className="text-indigo-600" size={24} />
            Thao tác nhanh
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/xetnghiem/xetnghiem/yeucau"
              className="flex flex-col items-center justify-center p-6 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors border border-indigo-200 group"
            >
              <FlaskConical size={32} className="text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-gray-700">Yêu cầu xét nghiệm</span>
            </Link>
            <Link
              to="/xetnghiem/xetnghiem/phieu"
              className="flex flex-col items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200 group"
            >
              <FileText size={32} className="text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-gray-700">Phiếu xét nghiệm</span>
            </Link>
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-200">
              <ClipboardCheck size={32} className="text-gray-400 mb-2" />
              <span className="text-sm font-semibold text-gray-500">Thêm chức năng</span>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-200">
              <Clock size={32} className="text-gray-400 mb-2" />
              <span className="text-sm font-semibold text-gray-500">Thêm chức năng</span>
            </div>
          </div>
        </div>

        {/* Thông báo */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
            <AlertCircle className="text-orange-600" size={24} />
            Thông báo quan trọng
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <CheckCircle2 size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-800 mb-1">Xử lý yêu cầu kịp thời</p>
                <p className="text-sm text-gray-600">Vui lòng xử lý các yêu cầu xét nghiệm trong vòng 24 giờ để đảm bảo chất lượng dịch vụ.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <CheckCircle2 size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-800 mb-1">Kiểm tra kết quả chính xác</p>
                <p className="text-sm text-gray-600">Đảm bảo kết quả xét nghiệm được nhập chính xác và đầy đủ trước khi hoàn thành phiếu.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XetNghiemHome;

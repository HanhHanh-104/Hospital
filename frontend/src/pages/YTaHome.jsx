import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axiosClient";
import {
  Users,
  UserPlus,
  Activity,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Heart,
  Stethoscope,
  TrendingUp,
  FileText
} from "lucide-react";
import toast from "react-hot-toast";

const StatCard = ({ icon: Icon, title, value, subtitle, color = "green", link }) => {
  const colorClasses = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
    indigo: "bg-indigo-500"
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

const YTaHome = () => {
  const [stats, setStats] = useState({
    benhNhanChoXuLy: 0,
    benhNhanHomNay: 0,
    lichLamViec: 0,
    tinhTrangCanXuLy: 0
  });
  const [loading, setLoading] = useState(true);
  const [nhanSuInfo, setNhanSuInfo] = useState(null);
  const [recentPatients, setRecentPatients] = useState([]);

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
      // Lấy thống kê từ các API
      const [benhNhanRes, lichKhamRes] = await Promise.all([
        axios.get("/benhnhan").catch(() => ({ data: { data: [] } })),
        axios.get("/lichkham").catch(() => ({ data: { data: [] } }))
      ]);

      const today = new Date().toISOString().split('T')[0];
      const benhNhanHomNay = (lichKhamRes.data.data || []).filter(
        lk => lk.ngayKham && lk.ngayKham.split('T')[0] === today
      ).length;

      setStats({
        benhNhanChoXuLy: (benhNhanRes.data.data || []).filter(
          bn => !bn.trangThai || bn.trangThai === 'CHO_XU_LY'
        ).length,
        benhNhanHomNay: benhNhanHomNay,
        lichLamViec: (lichKhamRes.data.data || []).length,
        tinhTrangCanXuLy: 0 // Có thể tính từ các bệnh nhân cần ghi nhận tình trạng
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
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600 mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <Heart size={48} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {nhanSuInfo?.hoTen || "Điều dưỡng / Y tá"}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-green-100">
                {nhanSuInfo?.chuyenMon && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
                    <Stethoscope size={18} />
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
            <p className="text-green-100 text-sm mb-1">Chào mừng trở lại!</p>
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
          icon={Users}
          title="Bệnh nhân chờ xử lý"
          value={stats.benhNhanChoXuLy}
          color="green"
        />
        <StatCard
          icon={Activity}
          title="Bệnh nhân hôm nay"
          value={stats.benhNhanHomNay}
          color="blue"
        />
        <StatCard
          icon={Calendar}
          title="Lịch làm việc"
          value={stats.lichLamViec}
          color="purple"
          link="/yta/lichlamviec"
        />
        <StatCard
          icon={AlertCircle}
          title="Tình trạng cần xử lý"
          value={stats.tinhTrangCanXuLy}
          color="orange"
          link="/yta/benhnhan/ghinhantinhtrang"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Thao tác nhanh */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
            <Activity className="text-green-600" size={24} />
            Thao tác nhanh
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/yta/benhnhan/dangky"
              className="flex flex-col items-center justify-center p-6 bg-green-50 hover:bg-green-100 rounded-xl transition-colors border border-green-200 group"
            >
              <UserPlus size={32} className="text-green-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-gray-700">Đăng ký bệnh nhân</span>
            </Link>
            <Link
              to="/yta/benhnhan/ghinhantinhtrang"
              className="flex flex-col items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200 group"
            >
              <FileText size={32} className="text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-gray-700">Ghi nhận tình trạng</span>
            </Link>
            <Link
              to="/yta/lichlamviec"
              className="flex flex-col items-center justify-center p-6 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors border border-purple-200 group"
            >
              <Calendar size={32} className="text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-gray-700">Lịch bác sĩ</span>
            </Link>
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
                <p className="font-semibold text-gray-800 mb-1">Ghi nhận tình trạng bệnh nhân</p>
                <p className="text-sm text-gray-600">Vui lòng ghi nhận tình trạng bệnh nhân kịp thời để bác sĩ có thể điều trị hiệu quả.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <CheckCircle2 size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-800 mb-1">Đăng ký bệnh nhân mới</p>
                <p className="text-sm text-gray-600">Đảm bảo thông tin bệnh nhân được nhập đầy đủ và chính xác.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YTaHome;

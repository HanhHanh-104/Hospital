import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axiosClient";
import {
  Calendar,
  CalendarClock,
  FileText,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ClipboardList,
  UserCheck,
  Activity
} from "lucide-react";
import toast from "react-hot-toast";

const StatCard = ({ icon: Icon, title, value, subtitle, color = "yellow", link }) => {
  const colorClasses = {
    yellow: "bg-yellow-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    green: "bg-green-500",
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

const TiepNhanHome = () => {
  const [stats, setStats] = useState({
    lichKhamHomNay: 0,
    lichHenChoXuLy: 0,
    hoSoChoXuLy: 0,
    tongLichKham: 0
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
      const [lichKhamRes, lichHenRes, hoSoRes] = await Promise.all([
        axios.get("/lichkham").catch(() => ({ data: { data: [] } })),
        axios.get("/lichkham").catch(() => ({ data: { data: [] } })),
        axios.get("/hsba").catch(() => ({ data: { data: [] } }))
      ]);

      const today = new Date().toISOString().split('T')[0];
      const lichKhamHomNay = (lichKhamRes.data.data || []).filter(
        lk => lk.ngayKham && lk.ngayKham.split('T')[0] === today
      ).length;

      setStats({
        lichKhamHomNay,
        lichHenChoXuLy: (lichHenRes.data.data || []).filter(
          lh => lh.trangThai === 'CHO_THANH_TOAN' || lh.trangThai === 'CHO_XU_LY'
        ).length,
        hoSoChoXuLy: (hoSoRes.data.data || []).filter(
          hs => !hs.trangThai || hs.trangThai === 'CHO_XU_LY'
        ).length,
        tongLichKham: (lichKhamRes.data.data || []).length
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
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-yellow-600 mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <ClipboardList size={48} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {nhanSuInfo?.hoTen || "Nhân viên tiếp nhận"}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-yellow-100">
                {nhanSuInfo?.KhoaPhong?.tenKhoa && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
                    <span>{nhanSuInfo.KhoaPhong.tenKhoa}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-yellow-100 text-sm mb-1">Chào mừng trở lại!</p>
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
          icon={Calendar}
          title="Lịch khám hôm nay"
          value={stats.lichKhamHomNay}
          color="yellow"
          link="/tiepnhan/lichkham"
        />
        <StatCard
          icon={CalendarClock}
          title="Lịch hẹn chờ xử lý"
          value={stats.lichHenChoXuLy}
          color="blue"
          link="/tiepnhan/lichHen"
        />
        <StatCard
          icon={FileText}
          title="Hồ sơ chờ xử lý"
          value={stats.hoSoChoXuLy}
          color="purple"
          link="/tiepnhan/hsba"
        />
        <StatCard
          icon={TrendingUp}
          title="Tổng lịch khám"
          value={stats.tongLichKham}
          color="green"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Thao tác nhanh */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
            <Activity className="text-yellow-600" size={24} />
            Thao tác nhanh
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/tiepnhan/lichkham"
              className="flex flex-col items-center justify-center p-6 bg-yellow-50 hover:bg-yellow-100 rounded-xl transition-colors border border-yellow-200 group"
            >
              <Calendar size={32} className="text-yellow-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-gray-700">Đăng ký khám</span>
            </Link>
            <Link
              to="/tiepnhan/lichHen"
              className="flex flex-col items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200 group"
            >
              <CalendarClock size={32} className="text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-gray-700">Quản lý lịch hẹn</span>
            </Link>
            <Link
              to="/tiepnhan/hsba"
              className="flex flex-col items-center justify-center p-6 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors border border-purple-200 group"
            >
              <FileText size={32} className="text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-gray-700">Hồ sơ tiếp nhận</span>
            </Link>
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-200">
              <UserCheck size={32} className="text-gray-400 mb-2" />
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
                <p className="font-semibold text-gray-800 mb-1">Xử lý lịch hẹn kịp thời</p>
                <p className="text-sm text-gray-600">Vui lòng xử lý các lịch hẹn trong ngày để đảm bảo dịch vụ tốt nhất cho bệnh nhân.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <CheckCircle2 size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-800 mb-1">Kiểm tra hồ sơ bệnh án</p>
                <p className="text-sm text-gray-600">Đảm bảo hồ sơ bệnh án được cập nhật đầy đủ và chính xác.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TiepNhanHome;

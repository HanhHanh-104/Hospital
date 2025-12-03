import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axiosClient";
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  FileText, 
  DollarSign, 
  Activity, 
  TrendingUp,
  Clock,
  Building2,
  FlaskConical,
  Pill,
  BarChart3,
  ArrowRight,
  UserPlus,
  Shield
} from 'lucide-react';
import dayjs from 'dayjs';

const StatCard = ({ icon: Icon, title, value, change, color, to }) => (
  <Link 
    to={to || '#'}
    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 group"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={color.replace('text-', 'text-')} size={24} />
      </div>
      {change && (
        <span className={`text-sm font-semibold ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change > 0 ? '+' : ''}{change}%
        </span>
      )}
    </div>
    <h3 className="text-2xl font-bold text-gray-800 mb-1">{value}</h3>
    <p className="text-sm text-gray-500">{title}</p>
    <div className="mt-4 flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
      Xem chi tiết <ArrowRight size={16} className="ml-1" />
    </div>
  </Link>
);

const QuickActionCard = ({ icon: Icon, title, desc, to, color }) => (
  <Link
    to={to}
    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-100 hover:border-blue-200 group"
  >
    <div className={`w-12 h-12 rounded-lg ${color} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      <Icon className={color.replace('text-', 'text-')} size={24} />
    </div>
    <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-sm text-gray-500">{desc}</p>
  </Link>
);

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBacSi: 0,
    totalBenhNhan: 0,
    totalLichKham: 0,
    totalHoaDon: 0,
    totalThuoc: 0,
    totalKhoa: 0,
    totalXetNghiem: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [users, bacsi, benhnhan, lichkham, hoadon, thuoc, khoa, xetnghiem] = await Promise.all([
        axios.get('/tai-khoan').catch(() => ({ data: { data: [] } })),
        axios.get('/bacsi').catch(() => ({ data: { data: [] } })),
        axios.get('/benhnhan').catch(() => ({ data: { data: [] } })),
        axios.get('/lichkham').catch(() => ({ data: { data: [] } })),
        axios.get('/hoadon').catch(() => ({ data: { data: [] } })),
        axios.get('/thuoc').catch(() => ({ data: { data: [] } })),
        axios.get('/khoa').catch(() => ({ data: { data: [] } })),
        axios.get('/xetnghiem').catch(() => ({ data: { data: [] } })),
      ]);

      setStats({
        totalUsers: Array.isArray(users.data?.data) ? users.data.data.length : users.data?.data?.length || 0,
        totalBacSi: Array.isArray(bacsi.data?.data) ? bacsi.data.data.length : 0,
        totalBenhNhan: Array.isArray(benhnhan.data?.data) ? benhnhan.data.data.length : 0,
        totalLichKham: Array.isArray(lichkham.data?.data) ? lichkham.data.data.length : 0,
        totalHoaDon: Array.isArray(hoadon.data?.data) ? hoadon.data.data.length : 0,
        totalThuoc: Array.isArray(thuoc.data?.data) ? thuoc.data.data.length : 0,
        totalKhoa: Array.isArray(khoa.data?.data) ? khoa.data.data.length : 0,
        totalXetNghiem: Array.isArray(xetnghiem.data?.data) ? xetnghiem.data.data.length : 0,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-xl shadow-lg">
            <span className="text-4xl">⚕️</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                🔒 Quản trị hệ thống
              </span>
              <span>Quản lý toàn bộ hoạt động bệnh viện</span>
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          title="Tổng tài khoản"
          value={stats.totalUsers}
          change={5}
          color="text-blue-600"
          to="/admin/taikhoan"
        />
        <StatCard
          icon={Stethoscope}
          title="Bác sĩ"
          value={stats.totalBacSi}
          change={2}
          color="text-green-600"
          to="/admin/bacsi"
        />
        <StatCard
          icon={Users}
          title="Bệnh nhân"
          value={stats.totalBenhNhan}
          change={12}
          color="text-purple-600"
          to="/admin/benhnhan"
        />
        <StatCard
          icon={Calendar}
          title="Lịch khám"
          value={stats.totalLichKham}
          change={8}
          color="text-orange-600"
          to="/admin/lichkham"
        />
        <StatCard
          icon={DollarSign}
          title="Hóa đơn"
          value={stats.totalHoaDon}
          change={15}
          color="text-emerald-600"
          to="/admin/thongke"
        />
        <StatCard
          icon={Pill}
          title="Thuốc"
          value={stats.totalThuoc}
          change={3}
          color="text-red-600"
          to="/admin/thuoc"
        />
        <StatCard
          icon={Building2}
          title="Khoa"
          value={stats.totalKhoa}
          color="text-indigo-600"
          to="/admin/khoa"
        />
        <StatCard
          icon={FlaskConical}
          title="Xét nghiệm"
          value={stats.totalXetNghiem}
          change={7}
          color="text-cyan-600"
          to="/admin/xetnghiem"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Activity size={24} className="text-blue-600" />
          Thao tác nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            icon={UserPlus}
            title="Tạo tài khoản"
            desc="Thêm tài khoản mới cho người dùng"
            to="/admin/taikhoan/tao-moi"
            color="text-blue-600"
          />
          <QuickActionCard
            icon={Shield}
            title="Phân quyền"
            desc="Quản lý quyền truy cập"
            to="/admin/taikhoan/phan-quyen"
            color="text-purple-600"
          />
          <QuickActionCard
            icon={BarChart3}
            title="Thống kê"
            desc="Xem báo cáo và phân tích"
            to="/admin/thongke"
            color="text-green-600"
          />
          <QuickActionCard
            icon={FileText}
            title="Hồ sơ bệnh án"
            desc="Quản lý hồ sơ bệnh nhân"
            to="/admin/hosobenhan"
            color="text-orange-600"
          />
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp size={24} className="text-blue-600" />
          Thông tin hệ thống
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Clock size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Thời gian hiện tại</p>
              <p className="text-lg font-bold text-gray-800">{dayjs().format('DD/MM/YYYY HH:mm')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="bg-green-100 p-3 rounded-lg">
              <Activity size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Trạng thái</p>
              <p className="text-lg font-bold text-gray-800">Hoạt động bình thường</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Shield size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Bảo mật</p>
              <p className="text-lg font-bold text-gray-800">Blockchain Enabled</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;

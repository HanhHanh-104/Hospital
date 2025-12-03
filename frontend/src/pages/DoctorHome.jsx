import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axiosClient";
import {
  Calendar,
  Users,
  FileText,
  Activity,
  Clock,
  Stethoscope,
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  User,
  Building2,
  GraduationCap,
  Briefcase
} from "lucide-react";
import toast from "react-hot-toast";

// Component hiển thị cấp bậc với màu sắc
const CapBacBadge = ({ capBac }) => {
  const getBadgeStyle = (capBac) => {
    const styles = {
      "Bác sĩ thực tập": "bg-gray-100 text-gray-700 border-gray-300",
      "Bác sĩ sơ cấp": "bg-blue-100 text-blue-700 border-blue-300",
      "Bác sĩ điều trị": "bg-green-100 text-green-700 border-green-300",
      "Bác sĩ chuyên khoa I": "bg-purple-100 text-purple-700 border-purple-300",
      "Bác sĩ chuyên khoa II": "bg-indigo-100 text-indigo-700 border-indigo-300",
      "Thạc sĩ – Bác sĩ": "bg-orange-100 text-orange-700 border-orange-300",
      "Tiến sĩ – Bác sĩ": "bg-red-100 text-red-700 border-red-300",
      "Phó giáo sư – Bác sĩ": "bg-yellow-100 text-yellow-700 border-yellow-300",
      "Giáo sư – Bác sĩ": "bg-gradient-to-r from-amber-400 to-yellow-500 text-white border-amber-500"
    };
    return styles[capBac] || styles["Bác sĩ điều trị"];
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle(capBac)}`}>
      {capBac || "Bác sĩ điều trị"}
    </span>
  );
};

const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue", link }) => {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
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

const DoctorHome = () => {
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [stats, setStats] = useState({
    lichKhamHomNay: 0,
    tongBenhNhan: 0,
    phieuKham: 0,
    donThuoc: 0,
    lichHenChoXuLy: 0,
    yeuCauXN: 0
  });
  const [loading, setLoading] = useState(true);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    fetchDoctorData();
    fetchStats();
    fetchUpcomingAppointments();
  }, []);

  const fetchDoctorData = async () => {
    try {
      const maTK = localStorage.getItem("maTK");
      if (!maTK) return;

      const res = await axios.get(`/bacsi/maTK/${maTK}`);
      const data = res.data.data || res.data;
      setDoctorInfo(data);
      localStorage.setItem("maBS", data.maBS);
    } catch (err) {
      console.error("Lỗi tải thông tin bác sĩ:", err);
      toast.error("Không thể tải thông tin bác sĩ");
    }
  };

  const fetchStats = async () => {
    try {
      const maBS = localStorage.getItem("maBS") || localStorage.getItem("maTK");
      if (!maBS) return;

      // Lấy các thống kê
      const [phieuKhamRes, donThuocRes, lichHenRes, yeuCauXNRes] = await Promise.all([
        axios.get(`/phieukham?maBS=${maBS}`).catch(() => ({ data: { data: [] } })),
        axios.get(`/donthuoc?maBS=${maBS}`).catch(() => ({ data: { data: [] } })),
        axios.get(`/lichkham?maBS=${maBS}`).catch(() => ({ data: { data: [] } })),
        axios.get(`/yeucauxetnghiem?maBS=${maBS}`).catch(() => ({ data: { data: [] } }))
      ]);

      const today = new Date().toISOString().split('T')[0];
      const lichKhamHomNay = (lichHenRes.data.data || []).filter(
        lk => lk.ngayKham && lk.ngayKham.split('T')[0] === today
      ).length;

      setStats({
        lichKhamHomNay,
        tongBenhNhan: new Set(
          (phieuKhamRes.data.data || []).map(pk => pk.maBN)
        ).size,
        phieuKham: (phieuKhamRes.data.data || []).length,
        donThuoc: (donThuocRes.data.data || []).length,
        lichHenChoXuLy: (lichHenRes.data.data || []).filter(
          lk => lk.trangThai === 'Chờ khám' || lk.trangThai === 'Đã đặt'
        ).length,
        yeuCauXN: (yeuCauXNRes.data.data || []).filter(
          xn => xn.trangThai === 'Chờ xử lý' || xn.trangThai === 'Đã yêu cầu'
        ).length
      });
    } catch (err) {
      console.error("Lỗi tải thống kê:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingAppointments = async () => {
    try {
      const maBS = localStorage.getItem("maBS") || localStorage.getItem("maTK");
      if (!maBS) return;

      const res = await axios.get(`/lichkham?maBS=${maBS}`);
      const allAppointments = res.data.data || [];
      
      // Lấy 5 lịch hẹn sắp tới
      const upcoming = allAppointments
        .filter(apt => {
          const aptDate = new Date(apt.ngayKham);
          return aptDate >= new Date() && (apt.trangThai === 'Chờ khám' || apt.trangThai === 'Đã đặt');
        })
        .sort((a, b) => new Date(a.ngayKham) - new Date(b.ngayKham))
        .slice(0, 5);

      setUpcomingAppointments(upcoming);
    } catch (err) {
      console.error("Lỗi tải lịch hẹn:", err);
    }
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
    <div className="space-y-6">
      {/* Header với thông tin bác sĩ */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <User size={48} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">
                  {doctorInfo?.hoTen || "Bác sĩ"}
                </h1>
                {doctorInfo?.capBac && (
                  <CapBacBadge capBac={doctorInfo.capBac} />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-blue-100">
                {doctorInfo?.chuyenMon && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
                    <Stethoscope size={18} />
                    <span className="font-medium">{doctorInfo.chuyenMon}</span>
                  </div>
                )}
                {doctorInfo?.chucVu && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
                    <Briefcase size={18} />
                    <span>{doctorInfo.chucVu}</span>
                  </div>
                )}
                {doctorInfo?.KhoaPhong?.tenKhoa && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
                    <Building2 size={18} />
                    <span>{doctorInfo.KhoaPhong.tenKhoa}</span>
                  </div>
                )}
                {doctorInfo?.trinhDo && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
                    <GraduationCap size={18} />
                    <span>{doctorInfo.trinhDo}</span>
                  </div>
                )}
              </div>
              {doctorInfo?.capBac && doctorInfo?.chuyenMon && (
                <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <p className="text-xs text-blue-200 mb-1">Chuyên môn phù hợp với cấp bậc:</p>
                  <p className="text-sm text-white font-medium">
                    {doctorInfo.capBac} → {doctorInfo.chuyenMon}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm mb-1">Chào mừng trở lại!</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={Calendar}
          title="Lịch khám hôm nay"
          value={stats.lichKhamHomNay}
          color="blue"
          link="/doctor/lichhen"
        />
        <StatCard
          icon={Users}
          title="Tổng bệnh nhân"
          value={stats.tongBenhNhan}
          color="green"
        />
        <StatCard
          icon={FileText}
          title="Phiếu khám"
          value={stats.phieuKham}
          color="purple"
          link="/doctor/kham"
        />
        <StatCard
          icon={Activity}
          title="Đơn thuốc"
          value={stats.donThuoc}
          color="orange"
          link="/doctor/kham/donthuoc"
        />
        <StatCard
          icon={Clock}
          title="Lịch hẹn chờ xử lý"
          value={stats.lichHenChoXuLy}
          color="indigo"
          link="/doctor/lichhen"
        />
        <StatCard
          icon={Stethoscope}
          title="Yêu cầu xét nghiệm"
          value={stats.yeuCauXN}
          color="red"
          link="/doctor/xetnghiem"
        />
      </div>

      {/* Lịch hẹn sắp tới và Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lịch hẹn sắp tới */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="text-blue-600" size={24} />
              Lịch hẹn sắp tới
            </h2>
            <Link
              to="/doctor/lichhen"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Xem tất cả →
            </Link>
          </div>
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar size={48} className="mx-auto mb-3 text-gray-300" />
              <p>Không có lịch hẹn nào sắp tới</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((apt, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Clock size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {new Date(apt.ngayKham).toLocaleDateString('vi-VN', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {apt.gioKham || "Chưa có giờ"}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    apt.trangThai === 'Đã đặt' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {apt.trangThai}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
            <Activity className="text-green-600" size={24} />
            Thao tác nhanh
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/doctor/kham"
              className="flex flex-col items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200 group"
            >
              <FileText size={32} className="text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-gray-700">Phiếu khám</span>
            </Link>
            <Link
              to="/doctor/kham/donthuoc"
              className="flex flex-col items-center justify-center p-6 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors border border-purple-200 group"
            >
              <Activity size={32} className="text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-gray-700">Kê đơn thuốc</span>
            </Link>
            <Link
              to="/doctor/lich"
              className="flex flex-col items-center justify-center p-6 bg-green-50 hover:bg-green-100 rounded-xl transition-colors border border-green-200 group"
            >
              <Calendar size={32} className="text-green-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-gray-700">Lịch làm việc</span>
            </Link>
            <Link
              to="/doctor/xetnghiem"
              className="flex flex-col items-center justify-center p-6 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors border border-orange-200 group"
            >
              <Stethoscope size={32} className="text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-gray-700">Xét nghiệm</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Thông báo và cập nhật */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl shadow-md p-6 border border-amber-200">
        <div className="flex items-start gap-4">
          <AlertCircle className="text-amber-600 flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Thông báo quan trọng</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Vui lòng cập nhật thông tin cá nhân và lịch làm việc thường xuyên</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Kiểm tra và xử lý các yêu cầu xét nghiệm trong vòng 24 giờ</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Đảm bảo các phiếu khám và đơn thuốc được hoàn thành đúng thời hạn</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorHome;

import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import ChatbotWidget from "../components/Chatbot/ChatbotWidget.jsx";
import ChatWrapper from "../components/chat/ChatWrapper.jsx";
import {
  LayoutDashboard,
  Calendar,
  CalendarClock,
  FileText,
  Pill,
  FlaskConical,
  LogOut,
  Menu,
  X,
  User,
  Settings,
  Bell,
  Stethoscope,
  Award,
  Building2,
  UserCircle
} from "lucide-react";
import axios from "../api/axiosClient";
import toast from "react-hot-toast";

// Component hiển thị cấp bậc
const CapBacBadge = ({ capBac }) => {
  const getBadgeStyle = (capBac) => {
    const styles = {
      "Bác sĩ thực tập": "bg-gray-100 text-gray-700",
      "Bác sĩ sơ cấp": "bg-blue-100 text-blue-700",
      "Bác sĩ điều trị": "bg-green-100 text-green-700",
      "Bác sĩ chuyên khoa I": "bg-purple-100 text-purple-700",
      "Bác sĩ chuyên khoa II": "bg-indigo-100 text-indigo-700",
      "Thạc sĩ – Bác sĩ": "bg-orange-100 text-orange-700",
      "Tiến sĩ – Bác sĩ": "bg-red-100 text-red-700",
      "Phó giáo sư – Bác sĩ": "bg-yellow-100 text-yellow-700",
      "Giáo sư – Bác sĩ": "bg-gradient-to-r from-amber-400 to-yellow-500 text-white"
    };
    return styles[capBac] || styles["Bác sĩ điều trị"];
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getBadgeStyle(capBac)}`}>
      {capBac || "Bác sĩ điều trị"}
    </span>
  );
};

const DoctorLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState(null);

  useEffect(() => {
    fetchDoctorInfo();
  }, []);

  const fetchDoctorInfo = async () => {
    try {
      const maTK = localStorage.getItem("maTK");
      if (!maTK) return;

      const res = await axios.get(`/bacsi/maTK/${maTK}`);
      const data = res.data.data || res.data;
      setDoctorInfo(data);
      if (data.maBS) {
        localStorage.setItem("maBS", data.maBS);
      }
    } catch (err) {
      console.error("Lỗi tải thông tin bác sĩ:", err);
    }
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Trang chủ",
      path: "/doctor",
      color: "text-blue-600"
    },
    {
      icon: Calendar,
      label: "Lịch làm việc",
      path: "/doctor/lich",
      color: "text-green-600"
    },
    {
      icon: CalendarClock,
      label: "Lịch hẹn bệnh nhân",
      path: "/doctor/lichhen",
      color: "text-purple-600"
    },
    {
      icon: FileText,
      label: "Phiếu khám bệnh",
      path: "/doctor/kham",
      color: "text-indigo-600"
    },
    {
      icon: Pill,
      label: "Kê đơn thuốc",
      path: "/doctor/kham/donthuoc",
      color: "text-orange-600"
    },
    {
      icon: FlaskConical,
      label: "Yêu cầu xét nghiệm",
      path: "/doctor/xetnghiem",
      color: "text-red-600"
    },
    {
      icon: UserCircle,
      label: "Thông tin cá nhân",
      path: "/doctor/taikhoan",
      color: "text-teal-600"
    }
  ];

  const isActive = (path) => {
    if (path === "/doctor") {
      return location.pathname === "/doctor";
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <>
      <div className="min-h-screen flex bg-gray-50">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex w-72 bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900 text-white flex-col shadow-2xl">
          {/* Header Sidebar */}
          <div className="p-6 border-b border-blue-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Stethoscope size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">SmartHospital</h2>
                <p className="text-xs text-blue-200">Bác sĩ</p>
              </div>
            </div>
            {doctorInfo && (
              <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <User size={18} className="text-blue-200" />
                  <span className="font-semibold text-sm">{doctorInfo.hoTen}</span>
                </div>
                {doctorInfo.capBac && (
                  <div className="mt-2">
                    <CapBacBadge capBac={doctorInfo.capBac} />
                  </div>
                )}
                {doctorInfo.KhoaPhong?.tenKhoa && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-blue-200">
                    <Building2 size={14} />
                    <span>{doctorInfo.KhoaPhong.tenKhoa}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? "bg-white text-blue-900 shadow-lg transform scale-105"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon
                    size={20}
                    className={active ? item.color : "text-blue-200"}
                  />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer Sidebar */}
          <div className="p-4 border-t border-blue-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors shadow-md"
            >
              <LogOut size={20} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Stethoscope size={24} className="text-blue-600" />
              <div>
                <h2 className="font-bold text-gray-800">SmartHospital</h2>
                <p className="text-xs text-gray-500">Bác sĩ</p>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
            <div
              className="fixed left-0 top-0 bottom-0 w-72 bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900 text-white shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-blue-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                      <Stethoscope size={28} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">SmartHospital</h2>
                      <p className="text-xs text-blue-200">Bác sĩ</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-white hover:bg-white/20 p-2 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>
                {doctorInfo && (
                  <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <User size={18} className="text-blue-200" />
                      <span className="font-semibold text-sm">{doctorInfo.hoTen}</span>
                    </div>
                    {doctorInfo.capBac && (
                      <div className="mt-2">
                        <CapBacBadge capBac={doctorInfo.capBac} />
                      </div>
                    )}
                    {doctorInfo.KhoaPhong?.tenKhoa && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-blue-200">
                        <Building2 size={14} />
                        <span>{doctorInfo.KhoaPhong.tenKhoa}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <nav className="p-4 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        active
                          ? "bg-white text-blue-900 shadow-lg"
                          : "text-blue-100 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-blue-700">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  <LogOut size={20} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 pt-16 lg:pt-0">
          <div className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
      <ChatWrapper />
      <ChatbotWidget />
    </>
  );
};

export default DoctorLayout;

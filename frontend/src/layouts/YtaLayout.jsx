import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import ChatWrapper from "../components/chat/ChatWrapper.jsx";
import ChatbotWidget from "../components/Chatbot/ChatbotWidget.jsx";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FileText,
  Calendar,
  LogOut,
  Menu,
  X,
  Heart,
  Activity,
  UserCircle
} from "lucide-react";
import axios from "../api/axiosClient";

const SidebarItem = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/yta' && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-1 font-medium group relative
        ${isActive
          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30'
          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        }
      `}
    >
      <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
      <span className="flex-1">{label}</span>
    </Link>
  );
};

const MenuSection = ({ title, children }) => (
  <div className="mb-6">
    <div className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
      {title}
    </div>
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

const YtaLayout = () => {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [nhanSuInfo, setNhanSuInfo] = useState(null);

  useEffect(() => {
    fetchNhanSuInfo();
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

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Menu Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-72 bg-gradient-to-b from-green-900 to-emerald-900 text-white
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex flex-col shadow-2xl
        `}
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-green-800 bg-green-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-2 ring-green-500/30">
              <Heart size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight">SmartHospital</h1>
              <span className="text-xs text-green-300 font-medium tracking-wide">ĐIỀU DƯỠNG / Y TÁ</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-green-300 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 scrollbar-thin scrollbar-thumb-green-700 scrollbar-track-green-900">
          <MenuSection title="Tổng quan">
            <SidebarItem to="/yta" icon={LayoutDashboard} label="Trang chủ" />
          </MenuSection>

          <MenuSection title="Bệnh nhân">
            <SidebarItem to="/yta/benhnhan/dangky" icon={UserPlus} label="Đăng ký bệnh nhân" />
            <SidebarItem to="/yta/benhnhan/ghinhantinhtrang" icon={FileText} label="Ghi nhận tình trạng" />
          </MenuSection>

          <MenuSection title="Lịch làm việc">
            <SidebarItem to="/yta/lichlamviec" icon={Calendar} label="Lịch bác sĩ cùng ca" />
          </MenuSection>
        </div>

        {/* Footer - User Info & Logout */}
        <div className="p-4 border-t border-green-800 bg-green-900">
          <div className="bg-green-800/50 rounded-xl p-4 mb-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center border-2 border-green-600">
                <UserCircle size={20} className="text-white" />
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-bold truncate text-white">{nhanSuInfo?.hoTen || 'Điều dưỡng'}</p>
                <p className="text-xs text-green-300 truncate">
                  {nhanSuInfo?.chuyenMon || 'Nhân viên y tế'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white py-2.5 px-4 rounded-lg transition-all duration-200 font-semibold text-sm border border-red-500/20 hover:border-red-500"
          >
            <LogOut size={18} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative bg-gray-50">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center px-4 md:hidden z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
          <span className="ml-3 font-bold text-gray-800 text-lg">Điều dưỡng / Y tá</span>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto scroll-smooth bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>

      {/* Chat Widgets */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
        <ChatWrapper />
        <ChatbotWidget />
      </div>
    </div>
  );
};

export default YtaLayout;

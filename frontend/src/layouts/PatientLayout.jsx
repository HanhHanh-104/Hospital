import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom"; 
import { useAuth } from "../auth/AuthContext";
import ChatbotWidget from "../components/Chatbot/ChatbotWidget";
import ChatWrapper from "../components/chat/ChatWrapper";
import { 
  Calendar, 
  FileText, 
  CreditCard, 
  User, 
  LogOut, 
  Activity, 
  LayoutDashboard,
  Menu,
  Shield,
  MessageSquare,
  Newspaper
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  // Kiểm tra xem URL hiện tại có bắt đầu bằng path của item không để set active
  const isActive = location.pathname === to || (to !== '/patient' && location.pathname.startsWith(to));

  return (
    <Link 
      to={to} 
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-1 font-medium group
        ${isActive 
          ? 'bg-primary-600 text-white shadow-md shadow-primary-900/20' 
          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        }
      `}
    >
      <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
      <span>{label}</span>
    </Link>
  );
};

const PatientLayout = () => {
  const {logout } = useAuth();
   // Lấy user từ localStorage
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  // Lấy maBN từ localStorage (đã được lưu khi đăng nhập)
  const maBN = localStorage.getItem("maBN");

  return (
    <>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        
        {/* Sidebar - Fixed Left */}
        <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl z-20 flex-shrink-0 transition-all">
          
          {/* Header Sidebar */}
          <div className="h-20 flex items-center px-6 border-b border-slate-800 bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-2 ring-primary-500/30">
                +
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight tracking-tight">SmartHospital</h1>
                <span className="text-xs text-slate-400 font-medium tracking-wide">CỔNG BỆNH NHÂN</span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
            
            {/* Nhóm: Tổng quan */}
            <div>
              <div className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                Tổng quan
              </div>
              <SidebarItem to="/patient" icon={LayoutDashboard} label="Trang chủ" />
            </div>

            {/* Nhóm: Khám chữa bệnh */}
            <div>
              <div className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                Dịch vụ y tế
              </div>
              <SidebarItem to="/patient/lich" icon={Calendar} label="Đặt lịch khám" />
              <SidebarItem to="/patient/xetnghiem" icon={Activity} label="Xét nghiệm" />
              <SidebarItem to="/patient/hoso" icon={FileText} label="Hồ sơ bệnh án" />
            </div>

            {/* Nhóm: Tài chính & Cá nhân */}
            <div>
              <div className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                Cá nhân
              </div>
              <SidebarItem to="/patient/hoadon" icon={CreditCard} label="Thanh toán & Hóa đơn" />
              <SidebarItem to="/patient/taikhoan" icon={User} label="Thông tin cá nhân" />
              <SidebarItem to="/patient/taikhoan/bao-mat" icon={Shield} label="Bảo mật tài khoản" />
            </div>

            {/* Nhóm: Hỗ trợ & Thông tin */}
            <div>
              <div className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                Hỗ trợ & Thông tin
              </div>
              <SidebarItem to="/patient/lienhe" icon={MessageSquare} label="Liên hệ & Ý kiến" />
              <SidebarItem to="/patient/tintuc" icon={Newspaper} label="Tin tức" />
            </div>

          </div>

          {/* Footer Sidebar (User & Logout) */}
          <div className="p-4 border-t border-slate-800 bg-slate-900">
            <div className="bg-slate-800/50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600">
                    <User size={20} className="text-slate-300"/>
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate text-white">{user?.HoTen || 'Bệnh nhân'}</p>
                    <p className="text-xs text-slate-400 truncate">Mã BN: {maBN || user?.maBN || 'N/A'}</p>
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
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative bg-gray-50">
            {/* Header Mobile (Optional) */}
            <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center px-4 md:hidden z-10">
                <button className="p-2 text-gray-600 rounded-lg hover:bg-gray-100">
                     <Menu size={24} />
                </button>
                <span className="ml-3 font-bold text-gray-800 text-lg">SmartHospital</span>
            </header>

            {/* Nội dung chính thay đổi dynamic tại đây */}
            <main className="flex-1 overflow-y-auto scroll-smooth">
                {/* Đây là nơi các trang con (như PatientHome) sẽ được hiển thị */}
                <Outlet />
            </main>
        </div>
      </div>

      {/* Widgets */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
        <ChatWrapper />
        <ChatbotWidget />
      </div>
    </>
  );
};

export default PatientLayout;
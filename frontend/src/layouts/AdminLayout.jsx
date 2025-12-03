import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import ChatWrapper from "../components/chat/ChatWrapper.jsx";
import ChatbotWidget from "../components/Chatbot/ChatbotWidget.jsx";
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Shield, 
  UserCog, 
  Stethoscope, 
  Calendar, 
  FlaskConical, 
  FileText, 
  Pill, 
  Building2, 
  ClipboardList, 
  BarChart3, 
  LogOut, 
  Menu, 
  X,
  Clock,
  Activity,
  MessageSquare,
  Newspaper
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label, badge }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to));

  return (
    <Link 
      to={to} 
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-1 font-medium group relative
        ${isActive 
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' 
          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        }
      `}
    >
      <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{badge}</span>
      )}
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

function AdminLayout() {
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white 
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex flex-col shadow-2xl
        `}
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-700 bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-2 ring-blue-500/30">
              ⚕️
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight">SmartHospital</h1>
              <span className="text-xs text-slate-400 font-medium tracking-wide">ADMIN PANEL</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
          
          <MenuSection title="Tổng quan">
            <SidebarItem to="/admin" icon={LayoutDashboard} label="Dashboard" />
          </MenuSection>

          <MenuSection title="Tài khoản & Phân quyền">
            <SidebarItem to="/admin/taikhoan" icon={Users} label="Danh sách tài khoản" />
            <SidebarItem to="/admin/taikhoan/tao-moi" icon={UserPlus} label="Tạo tài khoản" />
            <SidebarItem to="/admin/taikhoan/phan-quyen" icon={Shield} label="Phân quyền" />
          </MenuSection>

          <MenuSection title="Nhân sự">
            <SidebarItem to="/admin/bacsi" icon={Stethoscope} label="Bác sĩ" />
            <SidebarItem to="/admin/nhansu" icon={UserCog} label="Nhân viên y tế" />
            <SidebarItem to="/admin/nhansu/troly" icon={Activity} label="Trợ lý bác sĩ" />
            <SidebarItem to="/admin/nhansu/catruc" icon={Clock} label="Ca trực" />
          </MenuSection>

          <MenuSection title="Chuyên môn">
            <SidebarItem to="/admin/khoa" icon={Building2} label="Quản lý khoa" />
            <SidebarItem to="/admin/lichkham" icon={Calendar} label="Lịch khám" />
            <SidebarItem to="/admin/xetnghiem" icon={FlaskConical} label="Xét nghiệm" />
            <SidebarItem to="/admin/loaixetnghiem" icon={ClipboardList} label="Loại xét nghiệm" />
          </MenuSection>

          <MenuSection title="Bệnh nhân">
            <SidebarItem to="/admin/benhnhan" icon={Users} label="Quản lý bệnh nhân" />
            <SidebarItem to="/admin/hosobenhan" icon={FileText} label="Hồ sơ bệnh án" />
          </MenuSection>

          <MenuSection title="Thuốc & Đơn vị">
            <SidebarItem to="/admin/thuoc" icon={Pill} label="Quản lý thuốc" />
            <SidebarItem to="/admin/nhomthuoc" icon={Pill} label="Nhóm thuốc" />
            <SidebarItem to="/admin/donvitinh" icon={Pill} label="Đơn vị tính" />
          </MenuSection>

          <MenuSection title="Thống kê">
            <SidebarItem to="/admin/thongke" icon={BarChart3} label="Thống kê hóa đơn" />
            <SidebarItem to="/admin/thongke/lichlamviec" icon={BarChart3} label="Lịch làm việc" />
            <SidebarItem to="/admin/thongke/lickham" icon={BarChart3} label="Lịch khám" />
          </MenuSection>

          <MenuSection title="Hỗ trợ & Thông tin">
            <SidebarItem to="/admin/phanhoi" icon={MessageSquare} label="Phản hồi & Ý kiến" />
            <SidebarItem to="/admin/tintuc" icon={Newspaper} label="Quản lý tin tức" />
          </MenuSection>

        </div>

        {/* Footer - User Info & Logout */}
        <div className="p-4 border-t border-slate-700 bg-slate-900">
          <div className="bg-slate-800/50 rounded-xl p-4 mb-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-2 border-slate-600">
                <Users size={20} className="text-white"/>
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-bold truncate text-white">{user?.HoTen || 'Admin'}</p>
                <p className="text-xs text-slate-400 truncate">Quản trị viên</p>
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
          <span className="ml-3 font-bold text-gray-800 text-lg">Admin Panel</span>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto scroll-smooth bg-gray-50">
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
}

export default AdminLayout;

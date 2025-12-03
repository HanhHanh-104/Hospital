import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const NhanSuLayout = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-purple-800 text-white p-4 space-y-2 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-4">🧑‍⚕️ Nhân viên y tế</h2>

          <a href="/nhansu/xetnghiem/phieu" className="block hover:bg-purple-700 p-2 rounded">
            📄 Phiếu xét nghiệm
          </a>
          <a href="/nhansu/benhnhan" className="block hover:bg-purple-700 p-2 rounded">
            👥 Bệnh nhân phụ trách
          </a>
          <a href="/nhansu/lichkham" className="block hover:bg-purple-700 p-2 rounded">
            📅 Lịch khám phòng
          </a>
          {/* Thêm mục khác nếu cần */}
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 w-full text-left bg-red-600 hover:bg-red-700 p-2 rounded"
        >
          🔓 Đăng xuất
        </button>
      </aside>

      <main className="flex-1 bg-gray-100 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default NhanSuLayout;

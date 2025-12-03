import React, { useState } from "react";
import axios from "../../../api/axiosClient";
import toast from "react-hot-toast";
import { ShieldCheck, Lock, KeyRound, Bell, Smartphone } from "lucide-react";

const BaoMatTaiKhoanPage = () => {
  const maTK = localStorage.getItem("maTK");
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passForm, setPassForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePassChange = (e) => {
    setPassForm({ ...passForm, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (passForm.newPassword.length < 6) {
      toast.error("Mật khẩu mới cần ít nhất 6 ký tự.");
      return;
    }
    try {
      setLoadingPassword(true);
      await axios.post("/auth/doi-mat-khau", {
        maTK,
        matKhauCu: passForm.oldPassword,
        matKhauMoi: passForm.newPassword,
      });
      toast.success("Đổi mật khẩu thành công!");
      setPassForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error("Không thể đổi mật khẩu: " + (err.response?.data?.message || err.message));
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-3xl p-8 shadow-xl flex flex-col gap-3">
          <div className="flex items-center gap-3 text-white/80 text-sm uppercase tracking-widest font-semibold">
            <ShieldCheck size={20} />
            Bảo mật tài khoản
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">An toàn thông tin của bạn</h1>
          <p className="text-white/85 max-w-2xl">
            Đặt mật khẩu mạnh và thường xuyên kiểm tra các phiên đăng nhập để bảo vệ hồ sơ y tế cá nhân.
          </p>
        </div>

        {/* Password card */}
        <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6 space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <Lock size={22} className="text-rose-500" />
              Đổi mật khẩu
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Chỉ mất vài bước để bảo vệ tài khoản. Hạn chế dùng cùng một mật khẩu cho nhiều nơi.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleChangePassword}>
            <label className="text-sm font-medium text-slate-700 space-y-1">
              Mật khẩu hiện tại
              <input
                type="password"
                name="oldPassword"
                value={passForm.oldPassword}
                onChange={handlePassChange}
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-rose-100 focus:outline-none"
                placeholder="••••••"
                required
              />
            </label>
            <label className="text-sm font-medium text-slate-700 space-y-1">
              Mật khẩu mới
              <input
                type="password"
                name="newPassword"
                value={passForm.newPassword}
                onChange={handlePassChange}
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-rose-100 focus:outline-none"
                placeholder="Ít nhất 6 ký tự, nên có chữ & số"
                required
              />
            </label>
            <label className="text-sm font-medium text-slate-700 space-y-1">
              Xác nhận mật khẩu mới
              <input
                type="password"
                name="confirmPassword"
                value={passForm.confirmPassword}
                onChange={handlePassChange}
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-rose-100 focus:outline-none"
                placeholder="Nhập lại mật khẩu mới"
                required
              />
            </label>
            <button
              type="submit"
              disabled={loadingPassword}
              className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white transition ${
                loadingPassword ? "bg-slate-300 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-700"
              }`}
            >
              {loadingPassword ? "Đang xử lý..." : "Cập nhật mật khẩu"}
            </button>
          </form>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Gợi ý tăng cường bảo mật</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
            <div className="bg-slate-50 rounded-2xl p-4 flex gap-3">
              <KeyRound className="text-slate-400" />
              <div>
                <p className="font-semibold text-slate-900">Mật khẩu mạnh</p>
                <p>Sử dụng tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường và ký tự đặc biệt.</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 flex gap-3">
              <Bell className="text-slate-400" />
              <div>
                <p className="font-semibold text-slate-900">Thông báo đăng nhập</p>
                <p>Luôn kiểm tra email khi có thông báo đăng nhập bất thường.</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 flex gap-3">
              <Smartphone className="text-slate-400" />
              <div>
                <p className="font-semibold text-slate-900">Không chia sẻ OTP</p>
                <p>Nhân viên của bệnh viện không bao giờ yêu cầu bạn cung cấp mã OTP.</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 flex gap-3">
              <ShieldCheck className="text-slate-400" />
              <div>
                <p className="font-semibold text-slate-900">Đăng xuất khỏi thiết bị lạ</p>
                <p>Sau khi dùng máy lạ, hãy đăng xuất và đổi mật khẩu nếu cần.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-500">
            Mã tài khoản: <span className="font-semibold text-slate-700">{maTK}</span> • Trạng thái:{" "}
            <span className="text-emerald-600 font-semibold">Đang hoạt động</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaoMatTaiKhoanPage;


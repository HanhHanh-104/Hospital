import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axiosClient";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  
  // Step 1: Nhập Email | Step 2: Nhập OTP & Pass mới
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- Xử lý gửi yêu cầu OTP ---
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Vui lòng nhập email");

    setLoading(true);
    try {
      const res = await axios.post("/auth/forgot-password", { email });
      toast.success(res.data.message || "Đã gửi mã OTP!");
      setStep(2); // Chuyển sang bước 2
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể gửi OTP. Thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // --- Xử lý đặt lại mật khẩu ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      return toast.error("Mật khẩu xác nhận không khớp");
    }
    if (newPassword.length < 6) {
      return toast.error("Mật khẩu phải từ 6 ký tự trở lên");
    }

    setLoading(true);
    try {
      const res = await axios.post("/auth/reset-password", {
        email,
        otpCode,
        newPassword
      });
      
      toast.success(res.data.message || "Thành công!");
      // Chuyển hướng về trang đăng nhập sau 1.5s
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi đặt lại mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D6EAF8] font-sans px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        
        {/* Tiêu đề */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-blue-800 mb-2">
            {step === 1 ? "🔑 Quên mật khẩu" : "🔐 Đặt lại mật khẩu"}
          </h1>
          <p className="text-gray-500 text-sm">
            {step === 1 
              ? "Nhập email để nhận mã xác thực" 
              : `Nhập mã OTP đã gửi tới ${email}`}
          </p>
        </div>

        {/* --- BƯỚC 1: NHẬP EMAIL --- */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email đăng ký</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white font-bold transition ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Đang gửi..." : "Gửi mã xác thực"}
            </button>
          </form>
        )}

        {/* --- BƯỚC 2: NHẬP OTP & PASS MỚI --- */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Mã OTP (6 số)</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-center tracking-widest font-bold"
                placeholder="XXXXXX"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1">Mật khẩu mới</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Xác nhận mật khẩu</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white font-bold transition ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>

            <div className="text-center mt-2">
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-blue-600 hover:underline"
              >
                Gửi lại mã?
              </button>
            </div>
          </form>
        )}

        {/* Nút Quay lại */}
        <div className="text-center mt-6 border-t pt-4">
          <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium text-sm">
            ← Quay lại Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
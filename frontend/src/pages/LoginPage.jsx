import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axiosClient";
import toast from "react-hot-toast";
import ChatbotWidget from "../components/Chatbot/ChatbotWidget.jsx";



function LoginPage() {
  const navigate = useNavigate();
  const [tenDangNhap, setTenDangNhap] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/auth/login", { tenDangNhap, matKhau });

      if (res.data && res.data.token && res.data.user) {
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("maTK", user.maTK);
        localStorage.setItem("role", user.maNhom);
        localStorage.setItem("loaiNS", user.loaiNS || "");

        if (user.maNhom === "BENHNHAN") localStorage.setItem("maBN", user.maBN);
        if (user.maNhom === "BACSI") localStorage.setItem("maBS", user.maBS);

        toast.success("✅ Đăng nhập thành công!");

        switch (user.maNhom) {
          case "ADMIN":
            navigate("/admin");
            break;
          case "BACSI":
            navigate("/doctor");
            break;
          case "BENHNHAN":
            navigate("/patient");
            break;
          case "NHANSU":
            if (user.loaiNS === "YT") navigate("/yta");
            else if (user.loaiNS === "XN") navigate("/xetnghiem");
            else if (user.loaiNS === "TN") navigate("/tiepnhan");
            else navigate("/nhansu");
            break;
          default:
            navigate("/404");
        }
      } else {
        toast.error("❌ Sai tài khoản hoặc mật khẩu!");
      }
    } catch {
      toast.error("❌ Sai tài khoản hoặc mật khẩu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#D6EAF8",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2.5rem 2rem",
          borderRadius: "1.5rem",
          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
          border: "1px solid #E5E8E8",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "800",
            color: "#21618C",
            marginBottom: "25px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          🔑 <span>Đăng nhập tài khoản</span>
        </h1>

        <form onSubmit={handleLogin} style={{ textAlign: "left" }}>
          {/* Tên đăng nhập */}
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                color: "#34495E",
                marginBottom: "6px",
              }}
            >
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={tenDangNhap}
              onChange={(e) => setTenDangNhap(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid #D0D3D4",
                outline: "none",
                transition: "border 0.2s ease",
              }}
              onFocus={(e) => (e.target.style.border = "1px solid #5DADE2")}
              onBlur={(e) => (e.target.style.border = "1px solid #D0D3D4")}
            />
          </div>

          {/* Mật khẩu */}
          <div style={{ position: "relative", marginBottom: "10px" }}> 
            <label
              style={{
                display: "block",
                fontWeight: "600",
                color: "#34495E",
                marginBottom: "6px",
              }}
            >
              Mật khẩu
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={matKhau}
              onChange={(e) => setMatKhau(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 40px 10px 12px",
                borderRadius: "10px",
                border: "1px solid #D0D3D4",
                outline: "none",
                transition: "border 0.2s ease",
              }}
              onFocus={(e) => (e.target.style.border = "1px solid #5DADE2")}
              onBlur={(e) => (e.target.style.border = "1px solid #D0D3D4")}
            />

            {/* Nút ẩn/hiện mật khẩu */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "36px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#7B7D7D",
                fontSize: "18px",
              }}
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>
          
          {/* Liên kết Quên mật khẩu */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
            <Link 
              to="/forgot-password" 
              style={{ 
                fontSize: "13px", 
                color: "#21618C", 
                fontWeight: "600", 
                textDecoration: "none",
                // Hover effect 
              }}
              onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
              onMouseOut={(e) => e.target.style.textDecoration = 'none'}
            >
              Quên mật khẩu?
            </Link>
          </div>

          {/* Nút đăng nhập */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: loading ? "#AED6F1" : "#3498DB",
              color: "white",
              fontWeight: "600",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s ease",
            }}
            onMouseOver={(e) =>
              !loading && (e.target.style.backgroundColor = "#2E86C1")
            }
            onMouseOut={(e) =>
              !loading && (e.target.style.backgroundColor = "#3498DB")
            }
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "18px",
            color: "#566573",
            fontSize: "14px",
          }}
        >
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            style={{
              color: "#2E86C1",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
      <div className="flex flex-col justify-end p-4 space-y-4 bg-transparent">
        <ChatbotWidget />
      </div>
    </div>
  );
}

export default LoginPage;
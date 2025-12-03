import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

// --- SỬA LỖI GIAO DIỆN ---
// Thêm dòng này để nhập tệp CSS chính của bạn.
// Tệp này chứa các chỉ thị @tailwind của Tailwind CSS,
// cần thiết để áp dụng các-lớp (như flex, bg-green-900, v.v.)
import "./styles/index.css";
// -------------------------

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
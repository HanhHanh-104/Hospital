const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const errorHandler = require("./utils/errorHandler");

// Tải biến môi trường từ file .env
dotenv.config();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:4000", "http://localhost:5174","http://localhost:5175" ],
  credentials: true
}));


// SỬA LỖI 413: Tăng giới hạn kích thước payload (Base64 files)
// Cấu hình cho phép nhận dữ liệu JSON và form-urlencoded với giới hạn 50MB
app.use(express.json({ limit: '100mb' })); // Tăng giới hạn JSON
app.use(express.urlencoded({ extended: true, limit: '100mb' })); // Tăng giới hạn URL-encoded
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Import tất cả route từ các module (gom lại)
const tatCaTuyen = require("./routes");
app.use("/api", tatCaTuyen); // Tất cả các API sẽ đi qua /api

// Middleware xử lý lỗi chung toàn hệ thống
app.use(errorHandler);

// Xuất ứng dụng để file server.js dùng
module.exports = app;
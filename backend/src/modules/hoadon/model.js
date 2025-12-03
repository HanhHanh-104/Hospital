// MODEL: Định nghĩa bảng hoá đơn, chi tiết, thanh toán, giỏ hàng theo Hospital5.sql
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");

// ---------------- HÓA ĐƠN ----------------
const HoaDon = sequelize.define("HoaDon", {
  maHD: { type: DataTypes.STRING, primaryKey: true },
  maBN: { type: DataTypes.STRING, allowNull: false },
  ngayLap: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  tongTien: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  trangThai: { type: DataTypes.STRING, defaultValue: "CHUA_THANH_TOAN" },
  maNS: { type: DataTypes.STRING, allowNull: true }, // ✅ CHO PHÉP null vì bệnh nhân không có nhân sự
}, {
  tableName: "HoaDon",
  timestamps: false,
});

// ---------------- CHI TIẾT HOÁ ĐƠN ----------------
const ChiTietHoaDon = sequelize.define("ChiTietHoaDon", {
  maCTHD: { type: DataTypes.STRING, primaryKey: true },
  maHD: { type: DataTypes.STRING, allowNull: false },
  loaiDichVu: { type: DataTypes.STRING, allowNull: false },
  maDichVu: { type: DataTypes.STRING, allowNull: false },
  donGia: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  soLuong: { type: DataTypes.INTEGER, defaultValue: 1 },
  thanhTien: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
}, {
  tableName: "ChiTietHoaDon",
  timestamps: false,
});

// ---------------- THANH TOÁN ----------------
const ThanhToan = sequelize.define("ThanhToan", {
  maTT: { type: DataTypes.STRING, primaryKey: true },
  maHD: { type: DataTypes.STRING, allowNull: false },
  soTien: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  phuongThuc: { type: DataTypes.STRING, allowNull: false },
  trangThai: { type: DataTypes.STRING, defaultValue: "CHO_THANH_TOAN" },
  ngayThanhToan: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: "ThanhToan",
  timestamps: false,
});

// ---------------- GIỎ HÀNG ----------------
const GioHang = sequelize.define("GioHang", {
  maGH: { type: DataTypes.STRING, primaryKey: true },
  maBN: { type: DataTypes.STRING, allowNull: false },
  ngayTao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  trangThai: { type: DataTypes.STRING, defaultValue: "CHO_THANH_TOAN" },
}, {
  tableName: "GioHang",
  timestamps: false,
});

// ---------------- CHI TIẾT GIỎ HÀNG ----------------
const ChiTietGioHang = sequelize.define("ChiTietGioHang", {
  maCTGH: { type: DataTypes.STRING, primaryKey: true },
  maGH: { type: DataTypes.STRING, allowNull: false },
  loaiDichVu: { type: DataTypes.STRING, allowNull: false },
  maDichVu: { type: DataTypes.STRING, allowNull: false },
  donGia: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  soLuong: { type: DataTypes.INTEGER, defaultValue: 1 },
  thanhTien: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
}, {
  tableName: "ChiTietGioHang",
  timestamps: false,
});

// ✅ Xuất các model
module.exports = {
  HoaDon,
  ChiTietHoaDon,
  ThanhToan,
  GioHang,
  ChiTietGioHang
};

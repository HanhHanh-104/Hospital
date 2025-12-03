// Tệp: backend/src/modules/donthuoc/model.js
// NỘI DUNG ĐÃ ĐƯỢC SỬA LỖI HOÀN CHỈNH

const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");

// Bảng DonThuoc
const DonThuoc = sequelize.define("DonThuoc", {
  maDT: { type: DataTypes.STRING, primaryKey: true },
  
  // === SỬA LỖI TẠI ĐÂY ===
  // Sửa 'maHSBA' thành 'maPK' để khớp với CSDL
  maPK: { type: DataTypes.STRING, allowNull: false }, 
  // === KẾT THÚC SỬA LỖI ===

  maBS: { type: DataTypes.STRING, allowNull: false },
  
  // Cho phép null vì thuốc được thêm sau
  maThuoc: { type: DataTypes.STRING, allowNull: true }, 
  
  ngayKeDon: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: "DonThuoc",
  timestamps: false,
});



// Bảng ChiTietDonThuoc (Giữ nguyên)
const ChiTietDonThuoc = sequelize.define("ChiTietDonThuoc", {
  maCTDT: { type: DataTypes.STRING, primaryKey: true },
  maDT: { type: DataTypes.STRING, allowNull: false },
  maThuoc: { type: DataTypes.STRING, allowNull: false },
  soLuong: { type: DataTypes.INTEGER, allowNull: false },
  lieuDung: { type: DataTypes.STRING },
}, {
  tableName: "ChiTietDonThuoc",
  timestamps: false,
});

module.exports = { DonThuoc, ChiTietDonThuoc };
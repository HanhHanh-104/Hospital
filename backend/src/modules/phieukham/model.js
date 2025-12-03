// MODEL: Định nghĩa bảng PhieuKham theo Hospital5.sql
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");

const PhieuKham = sequelize.define("PhieuKham", {
  maPK: { type: DataTypes.STRING, primaryKey: true },
  maHSBA: { type: DataTypes.STRING, allowNull: false },
  maBN: { type: DataTypes.STRING, allowNull: false },
  maBS: { type: DataTypes.STRING, allowNull: false },
  ngayKham: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  trieuChung: { type: DataTypes.TEXT },
  chuanDoan: { type: DataTypes.TEXT },
  loiDan: { type: DataTypes.TEXT },
  trangThai: { type: DataTypes.STRING, defaultValue: "DA_KHAM" },
}, {
  tableName: "PhieuKham",
  timestamps: false,
});

module.exports = { PhieuKham };

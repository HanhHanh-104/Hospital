// MODEL: Quản lý bảng CaKham (ca trực)
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");

const CaKham = sequelize.define("CaKham", {
  maCa: { type: DataTypes.STRING, primaryKey: true },
  tenCa: { type: DataTypes.STRING, allowNull: false },
  thoiGianBatDau: { type: DataTypes.TIME, allowNull: false },
  thoiGianKetThuc: { type: DataTypes.TIME, allowNull: false },
}, {
  tableName: "CaKham",
  timestamps: false,
});

module.exports = { CaKham };

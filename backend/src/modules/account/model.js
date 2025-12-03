const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const TaiKhoan = sequelize.define("TaiKhoan", {
  maTK: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  tenDangNhap: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  matKhau: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  maNhom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  trangThai: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: "TaiKhoan",
  timestamps: false,
});

module.exports = TaiKhoan;

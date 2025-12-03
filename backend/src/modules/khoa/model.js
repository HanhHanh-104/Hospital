const db = require("../../models");
const { DataTypes } = require("sequelize");

const KhoaPhong = db.sequelize.define("KhoaPhong", {
  maKhoa: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  tenKhoa: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  moTa: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: "KhoaPhong",
  timestamps: false,
});

module.exports = KhoaPhong;

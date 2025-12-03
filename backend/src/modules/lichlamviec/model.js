// MODEL: Định nghĩa bảng LichLamViec từ CSDL Hospital5.sql
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");

// Lịch làm việc
const LichLamViec = sequelize.define("LichLamViec", {
  maLichLV: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  maBS: {
    type: DataTypes.STRING,
    allowNull: true, //  bác sĩ tạo lịch
  },
  maNS: {
    type: DataTypes.STRING,
    allowNull: true, // Nhân viên được phân công
  },
  maCa: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ngayLamViec: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  tableName: "LichLamViec",
  timestamps: false,
});


module.exports = { LichLamViec };

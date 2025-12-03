const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const KhoaPhong = sequelize.define('KhoaPhong', {
  maKhoa: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  tenKhoa: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  moTa: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'KhoaPhong',
  timestamps: false
});

module.exports = KhoaPhong;

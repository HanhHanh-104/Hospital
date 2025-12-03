const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const LoaiXetNghiem = sequelize.define('LoaiXetNghiem', {
  maLoaiXN: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  tenLoai: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  moTa: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'LoaiXetNghiem',
  timestamps: false
});

module.exports = LoaiXetNghiem;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const CaKham = sequelize.define('CaKham', {
  maCa: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  tenCa: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  thoiGianBatDau: {
    type: DataTypes.TIME,
    allowNull: false
  },
  thoiGianKetThuc: {
    type: DataTypes.TIME,
    allowNull: false
  }
}, {
  tableName: 'CaKham',
  timestamps: false
});

module.exports = CaKham;

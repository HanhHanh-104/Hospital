const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const NhomThuoc = sequelize.define('NhomThuoc', {
  maNhom: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  tenNhom: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  moTa: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'NhomThuoc',
  timestamps: false
});

module.exports = NhomThuoc;

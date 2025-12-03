// Tệp: backend/src/models/HoSoAnChuoiKham.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const HoSoAnChuoiKham = sequelize.define('HoSoAnChuoiKham', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  maHSBA: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  block_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  data_json: {
    type: DataTypes.TEXT('medium'), 
    allowNull: false
  },
  maNguoiTao: { // Là maTK của người ký
    type: DataTypes.STRING(100),
    allowNull: false
  },
  signature: { // Chữ ký
    type: DataTypes.TEXT, // Dùng TEXT thay vì STRING
    allowNull: false
  },
  previous_hash: {
    type: DataTypes.STRING(256),
    allowNull: false
  },
  current_hash: {
    type: DataTypes.STRING(256),
    allowNull: false
  }
}, {
  tableName: 'HoSoAnChuoiKham',
  timestamps: false // Tắt timestamps tự động vì ta đã có cột timestamp
});

HoSoAnChuoiKham.associate = (models) => {
  HoSoAnChuoiKham.belongsTo(models.HoSoBenhAn, { foreignKey: 'maHSBA' });
};

module.exports = HoSoAnChuoiKham;
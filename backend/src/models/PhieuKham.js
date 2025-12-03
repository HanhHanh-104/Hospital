const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const PhieuKham = sequelize.define('PhieuKham', {
  maPK: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  maHSBA: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  maBN: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  maBS: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  ngayKham: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  trieuChung: {
    type: DataTypes.TEXT
  },
  chuanDoan: {
    type: DataTypes.TEXT
  },
  loiDan: {
    type: DataTypes.TEXT
  },
  trangThai: {
    type: DataTypes.STRING(50),
    defaultValue: 'DA_KHAM'
  },
  file: {
    type: DataTypes.STRING(255)
  }
}, {
  tableName: 'PhieuKham',
  timestamps: false
});

PhieuKham.associate = (models) => {
  PhieuKham.belongsTo(models.HoSoBenhAn, { foreignKey: 'maHSBA' });
  PhieuKham.belongsTo(models.BenhNhan, { foreignKey: 'maBN' });
  PhieuKham.belongsTo(models.BacSi, { foreignKey: 'maBS' });
};

module.exports = PhieuKham;

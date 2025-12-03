const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const UyQuyen = sequelize.define('UyQuyen', {
  maUyQuyen: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  maNguoiUyQuyen: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  maNguoiDuocUyQuyen: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  loaiUyQuyen: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  thoiGianBatDau: {
    type: DataTypes.DATE,
    allowNull: false
  },
  thoiGianKetThuc: {
    type: DataTypes.DATE,
    allowNull: false
  },
  moTa: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'UyQuyen',
  timestamps: false
});

UyQuyen.associate = (models) => {
  UyQuyen.belongsTo(models.TaiKhoan, { foreignKey: 'maNguoiUyQuyen' });
  UyQuyen.belongsTo(models.TaiKhoan, { foreignKey: 'maNguoiDuocUyQuyen' });
};

module.exports = UyQuyen;

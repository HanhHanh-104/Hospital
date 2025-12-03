const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ChiTietHoaDon = sequelize.define('ChiTietHoaDon', {
  maCTHD: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  maHD: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  loaiDichVu: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  maDichVu: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  donGia: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  soLuong: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  thanhTien: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  }
}, {
  tableName: 'ChiTietHoaDon',
  timestamps: false
});

ChiTietHoaDon.associate = (models) => {
  ChiTietHoaDon.belongsTo(models.HoaDon, { foreignKey: 'maHD' });
};

module.exports = ChiTietHoaDon;

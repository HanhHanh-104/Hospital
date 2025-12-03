const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ChiTietGioHang = sequelize.define('ChiTietGioHang', {
  maCTGH: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  maGH: {
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
  tableName: 'ChiTietGioHang',
  timestamps: false
});

ChiTietGioHang.associate = (models) => {
  ChiTietGioHang.belongsTo(models.GioHang, { foreignKey: 'maGH' });
};

module.exports = ChiTietGioHang;


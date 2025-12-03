const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const NhanSuYTe = sequelize.define('NhanSuYTe', {
  maNS: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  maTK: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  maKhoa: DataTypes.STRING(100),
  hoTen: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  loaiNS: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  chuyenMon: DataTypes.STRING(100),
  capBac: DataTypes.STRING(50)
}, {
  tableName: 'NhanSuYTe',
  timestamps: false
});

NhanSuYTe.associate = (models) => {
  NhanSuYTe.belongsTo(models.TaiKhoan, { foreignKey: 'maTK' });
  NhanSuYTe.belongsTo(models.KhoaPhong, { foreignKey: 'maKhoa' });

  // Thêm các liên kết xóa cascade
  NhanSuYTe.hasMany(models.LichLamViec, { foreignKey: 'maNS', onDelete: 'CASCADE', hooks: true });
  NhanSuYTe.hasMany(models.TinTuc, { foreignKey: 'maNS', onDelete: 'CASCADE', hooks: true });
  NhanSuYTe.hasMany(models.HoaDon, { foreignKey: 'maNS', onDelete: 'CASCADE', hooks: true });
  NhanSuYTe.hasMany(models.PhieuXetNghiem, { foreignKey: 'maNS', onDelete: 'CASCADE', hooks: true });
  NhanSuYTe.hasMany(models.TroLyBacSi, { foreignKey: 'maNS', onDelete: 'CASCADE', hooks: true });
};

module.exports = NhanSuYTe;

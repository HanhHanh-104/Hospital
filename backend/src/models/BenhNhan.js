const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const BenhNhan = sequelize.define('BenhNhan', {
  maBN: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  maTK: {
    type: DataTypes.STRING(100),
    unique: true
  },
  hoTen: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  ngaySinh: DataTypes.DATE,
  gioiTinh: DataTypes.STRING(10),
  diaChi: DataTypes.STRING(255),
  soDienThoai: DataTypes.STRING(15),
  bhyt: DataTypes.STRING(20)
}, {
  tableName: 'BenhNhan',
  timestamps: false
});

BenhNhan.associate = (models) => {
  BenhNhan.belongsTo(models.TaiKhoan, { foreignKey: 'maTK' });

  // Thêm các liên kết xóa cascade
  BenhNhan.hasMany(models.LichKham, { foreignKey: 'maBN', onDelete: 'CASCADE', hooks: true });
  BenhNhan.hasMany(models.YeuCauXetNghiem, { foreignKey: 'maBN', onDelete: 'CASCADE', hooks: true });
  BenhNhan.hasMany(models.HoSoBenhAn, { foreignKey: 'maBN', onDelete: 'CASCADE', hooks: true });
  BenhNhan.hasMany(models.HoaDon, { foreignKey: 'maBN', onDelete: 'CASCADE', hooks: true });
  BenhNhan.hasMany(models.GioHang, { foreignKey: 'maBN', onDelete: 'CASCADE', hooks: true });
  BenhNhan.hasMany(models.PhanHoi, { foreignKey: 'maBN', onDelete: 'CASCADE', hooks: true });
};

module.exports = BenhNhan;

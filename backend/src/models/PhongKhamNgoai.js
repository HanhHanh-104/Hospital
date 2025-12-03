const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');



const PhongKhamNgoai = sequelize.define('PhongKhamNgoai', {
  maPKN: {
    type: DataTypes.STRING(100),
    primaryKey: true,                  // Khóa chính
    allowNull: false,
  },
  tenPKN: {
    type: DataTypes.STRING(255),
    allowNull: false,                  // Bắt buộc nhập tên phòng khám
  },
  diaChi: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  soDienThoai: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  trangThai: {
    type: DataTypes.TINYINT,
    defaultValue: 1,                   // 1: hoạt động, 0: ngưng
  },
  ghiChu: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'PhongKhamNgoai',         // Tên bảng trong DB
  timestamps: false,                   // Không tự tạo cột createdAt, updatedAt
});

module.exports = PhongKhamNgoai;

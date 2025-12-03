const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Otp = sequelize.define('Otp', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  otpCode: {
    type: DataTypes.STRING(6),
    allowNull: false,
  },
  purpose: {
    // Mục đích: 'REGISTER_PATIENT' hoặc 'RESET_PASSWORD'
    type: DataTypes.STRING(50), 
    allowNull: false,
  },
  expiredAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'Otps',
  timestamps: true, // Tự động thêm createdAt, updatedAt
  indexes: [
    {
      fields: ['email', 'purpose'],
    }
  ]
});

// Quan trọng: Đảm bảo model này được nạp
// Nếu file models/index.js không tự động nạp, bạn cần import thủ công
// Nhưng vì bạn đang dùng file index.js có fs.readdirSync, nó sẽ tự động nạp.

module.exports = Otp;
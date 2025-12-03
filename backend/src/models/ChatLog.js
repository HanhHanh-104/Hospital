const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

// Model này sẽ được tự động load bởi file /src/models/index.js
const ChatLog = sequelize.define('ChatLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Đổi tên userId thành maTK để khớp với hệ thống
  maTK: {
    type: DataTypes.STRING(100),
    allowNull: false,
    references: {
      model: 'TaiKhoan', // Tên bảng 'TaiKhoan'
      key: 'maTK'
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  reply: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  intent: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'ChatLogs', // Tên bảng trong CSDL
  timestamps: false // Tắt timestamp tự động (vì đã có cột timestamp)
});

ChatLog.associate = (models) => {
  // 'models.TaiKhoan' sẽ được truyền vào từ file index.js
  ChatLog.belongsTo(models.TaiKhoan, { foreignKey: 'maTK' });
};

module.exports = ChatLog;

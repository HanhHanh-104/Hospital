const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ChatMessages = sequelize.define('ChatMessages', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  room: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  senderId: {
    type: DataTypes.STRING(100),
    allowNull: false,
    references: {
      model: 'TaiKhoan', // Tên bảng 'TaiKhoan'
      key: 'maTK'
    }
  },
  receiverId: {
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
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  daXem: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'ChatMessages',
  timestamps: false
});

ChatMessages.associate = (models) => {
  ChatMessages.belongsTo(models.TaiKhoan, { as: 'Sender', foreignKey: 'senderId' });
  ChatMessages.belongsTo(models.TaiKhoan, { as: 'Receiver', foreignKey: 'receiverId' });
};

module.exports = ChatMessages;
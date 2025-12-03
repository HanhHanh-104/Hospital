const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ChatRooms = sequelize.define('ChatRooms', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Tên phòng duy nhất, sắp xếp theo ID để đảm bảo 1-1
  // VD: 'TK001_TK002'
  roomName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  user1Id: {
    type: DataTypes.STRING(100),
    allowNull: false,
    references: {
      model: 'TaiKhoan', // Tên bảng 'TaiKhoan'
      key: 'maTK'
    }
  },
  user2Id: {
    type: DataTypes.STRING(100),
    allowNull: false,
    references: {
      model: 'TaiKhoan', // Tên bảng 'TaiKhoan'
      key: 'maTK'
    }
  },
  trangThai: {
    type: DataTypes.STRING(20),
    defaultValue: 'PENDING', // PENDING, ACTIVE, EXPIRED
    allowNull: false,
    comment: 'Trạng thái chat: PENDING (chờ chấp nhận), ACTIVE (đang chat), EXPIRED (hết hạn 15 phút)'
  },
  thoiGianBatDauChat: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Thời gian bắt đầu chat (khi được chấp nhận), dùng để tính 15 phút'
  }
}, {
  tableName: 'ChatRooms',
  timestamps: true // Bật timestamps để biết lần cuối tương tác (updatedAt)
});

ChatRooms.associate = (models) => {
  ChatRooms.belongsTo(models.TaiKhoan, { as: 'User1', foreignKey: 'user1Id' });
  ChatRooms.belongsTo(models.TaiKhoan, { as: 'User2', foreignKey: 'user2Id' });
};

module.exports = ChatRooms;
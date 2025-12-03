const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ThanhToan = sequelize.define('ThanhToan', {
  maTT: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  maHD: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  soTien: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  phuongThuc: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  trangThai: {
    type: DataTypes.STRING(20),
    defaultValue: 'CHO_THANH_TOAN'
  },
  ngayThanhToan: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'ThanhToan',
  timestamps: false
});

ThanhToan.associate = (models) => {
  ThanhToan.belongsTo(models.HoaDon, { foreignKey: 'maHD' });
};

module.exports = ThanhToan;

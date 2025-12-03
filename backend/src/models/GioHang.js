const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const GioHang = sequelize.define('GioHang', {
  maGH: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  maBN: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  ngayTao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  trangThai: {
    type: DataTypes.STRING(20),
    defaultValue: 'CHO_THANH_TOAN'
  }
}, {
  tableName: 'GioHang',
  timestamps: false
});

GioHang.associate = (models) => {
  GioHang.belongsTo(models.BenhNhan, { foreignKey: 'maBN' });
};

module.exports = GioHang;

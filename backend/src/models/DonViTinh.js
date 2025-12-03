const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const DonViTinh = sequelize.define('DonViTinh', {
  maDVT: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  tenDVT: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  moTa: {
    type: DataTypes.STRING(100)
  }
}, {
  tableName: 'DonViTinh',
  timestamps: false
});

module.exports = DonViTinh;

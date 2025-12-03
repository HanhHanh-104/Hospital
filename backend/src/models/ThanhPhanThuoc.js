const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ThanhPhanThuoc = sequelize.define('ThanhPhanThuoc', {
  maThanhPhan: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  maThuoc: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  tenHoatChat: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  hamLuong: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  donViTinh: {
    type: DataTypes.STRING(20)
  }
}, {
  tableName: 'ThanhPhanThuoc',
  timestamps: false
});

ThanhPhanThuoc.associate = (models) => {
  ThanhPhanThuoc.belongsTo(models.Thuoc, { foreignKey: 'maThuoc' });
};

module.exports = ThanhPhanThuoc;

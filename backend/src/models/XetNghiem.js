const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const XetNghiem = sequelize.define('XetNghiem', {
  maXN: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  maLoaiXN: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  tenXN: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  chiPhi: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  thoiGianTraKetQua: {
    type: DataTypes.STRING(100)
  }
}, {
  tableName: 'XetNghiem',
  timestamps: false
});

XetNghiem.associate = (models) => {
  XetNghiem.belongsTo(models.LoaiXetNghiem, { foreignKey: 'maLoaiXN' });
};

module.exports = XetNghiem;

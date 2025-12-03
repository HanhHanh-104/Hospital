const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ChiTietYeuCauXN = sequelize.define('ChiTietYeuCauXN', {
  maCT: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  maYeuCau: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  maXN: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'ChiTietYeuCauXN',
  timestamps: false
});

ChiTietYeuCauXN.associate = (models) => {
  ChiTietYeuCauXN.belongsTo(models.YeuCauXetNghiem, { foreignKey: 'maYeuCau' });
  ChiTietYeuCauXN.belongsTo(models.XetNghiem, { foreignKey: 'maXN' });
};

module.exports = ChiTietYeuCauXN;

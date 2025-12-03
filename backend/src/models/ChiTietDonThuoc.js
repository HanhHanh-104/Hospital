const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ChiTietDonThuoc = sequelize.define('ChiTietDonThuoc', {
  maCTDT: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  maDT: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  maThuoc: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  soLuong: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  lieuDung: {
    type: DataTypes.STRING(255)
  }
}, {
  tableName: 'ChiTietDonThuoc',
  timestamps: false
});

ChiTietDonThuoc.associate = (models) => {
  ChiTietDonThuoc.belongsTo(models.DonThuoc, { foreignKey: 'maDT' });
  ChiTietDonThuoc.belongsTo(models.Thuoc, { foreignKey: 'maThuoc' });
};

module.exports = ChiTietDonThuoc;

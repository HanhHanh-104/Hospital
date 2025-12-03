const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const HoaDon = sequelize.define('HoaDon', {
  maHD: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  maBN: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  ngayLap: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  tongTien: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  trangThai: {
    type: DataTypes.STRING(20),
    defaultValue: 'CHUA_THANH_TOAN'
  },
  maNS: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'HoaDon',
  timestamps: false
});

HoaDon.associate = (models) => {
  HoaDon.belongsTo(models.BenhNhan, { foreignKey: 'maBN' });
  HoaDon.belongsTo(models.NhanSuYTe, { foreignKey: 'maNS' });
};

module.exports = HoaDon;

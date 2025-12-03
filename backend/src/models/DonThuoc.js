const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const DonThuoc = sequelize.define('DonThuoc', {
  maDT: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  // SỬA: Thay maHSBA bằng maPK
  maPK: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  maBS: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  maThuoc: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  ngayKeDon: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  file: {
    type: DataTypes.STRING(255)
  }
}, {
  tableName: 'DonThuoc',
  timestamps: false
});

DonThuoc.associate = (models) => {
  // SỬA: Liên kết với PhieuKham
  DonThuoc.belongsTo(models.PhieuKham, { foreignKey: 'maPK' });
  DonThuoc.belongsTo(models.BacSi, { foreignKey: 'maBS' });
  DonThuoc.belongsTo(models.Thuoc, { foreignKey: 'maThuoc' });
};

module.exports = DonThuoc;
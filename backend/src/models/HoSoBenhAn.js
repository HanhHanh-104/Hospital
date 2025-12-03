const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const HoSoBenhAn = sequelize.define('HoSoBenhAn', {
  maHSBA: {
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
  dotKhamBenh: {
    type: DataTypes.DATE
  },
  lichSuBenh: {
    type: DataTypes.TEXT
  },
  ghiChu: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'HoSoBenhAn',
  timestamps: false
});

HoSoBenhAn.associate = (models) => {
  HoSoBenhAn.belongsTo(models.BenhNhan, { foreignKey: 'maBN' });
};

module.exports = HoSoBenhAn;

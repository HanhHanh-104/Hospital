const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const TroLyBacSi = sequelize.define('TroLyBacSi', {
  maTroLy: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  maNS: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  maBacSi: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phamViUyQuyen: {
    type: DataTypes.STRING(255)
  }
}, {
  tableName: 'TroLyBacSi',
  timestamps: false
});

TroLyBacSi.associate = (models) => {
  TroLyBacSi.belongsTo(models.NhanSuYTe, { foreignKey: 'maNS' });
  TroLyBacSi.belongsTo(models.BacSi, { foreignKey: 'maBacSi' });
};

module.exports = TroLyBacSi;

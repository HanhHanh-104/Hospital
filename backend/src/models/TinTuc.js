const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const TinTuc = sequelize.define('TinTuc', {
  maTin: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  tieuDe: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  tomTat: {
    type: DataTypes.TEXT
  },
  noiDung: {
    type: DataTypes.TEXT
  },
  hinhAnh: {
    type: DataTypes.STRING(255)
  },
  loai: {
    type: DataTypes.STRING(50),
    defaultValue: 'TIN_TUC'
  },
  ngayDang: {
    type: DataTypes.DATE,
    allowNull: false
  },
  maNS: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  trangThai: {
    type: DataTypes.STRING(20),
    defaultValue: 'HIEN_THI'
  },
  luotXem: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'TinTuc',
  timestamps: false
});

TinTuc.associate = (models) => {
  TinTuc.belongsTo(models.NhanSuYTe, { foreignKey: 'maNS' });
};

module.exports = TinTuc;

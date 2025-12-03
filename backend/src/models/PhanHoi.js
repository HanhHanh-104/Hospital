const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const PhanHoi = sequelize.define('PhanHoi', {
  maPH: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  maBN: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  tieuDe: {
    type: DataTypes.STRING(255)
  },
  noiDung: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  loai: {
    type: DataTypes.STRING(50),
    defaultValue: 'PHAN_HOI'
  },
  ngayGui: {
    type: DataTypes.DATE,
    allowNull: false
  },
  trangThai: {
    type: DataTypes.STRING(20),
    defaultValue: 'CHO_XU_LY'
  },
  phanHoi: {
    type: DataTypes.TEXT
  },
  maNS: {
    type: DataTypes.STRING(100)
  },
  ngayPhanHoi: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'PhanHoi',
  timestamps: false
});

PhanHoi.associate = (models) => {
  PhanHoi.belongsTo(models.BenhNhan, { foreignKey: 'maBN' });
  PhanHoi.belongsTo(models.NhanSuYTe, { foreignKey: 'maNS', as: 'NhanSuYTe' });
};

module.exports = PhanHoi;

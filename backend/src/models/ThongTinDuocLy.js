const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ThongTinDuocLy = sequelize.define('ThongTinDuocLy', {
  maTTDL: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  maThuoc: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  tacDungChinh: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  chiDinh: {
    type: DataTypes.TEXT
  },
  chongChiDinh: {
    type: DataTypes.TEXT
  },
  tacDungPhu: {
    type: DataTypes.TEXT
  },
  tuongTacThuoc: {
    type: DataTypes.TEXT
  },
  canhBao: {
    type: DataTypes.TEXT
  },
  doiTuongSuDung: {
    type: DataTypes.TEXT
  },
  cachDung: {
    type: DataTypes.TEXT
  },
  baoQuan: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'ThongTinDuocLy',
  timestamps: false
});

ThongTinDuocLy.associate = (models) => {
  ThongTinDuocLy.belongsTo(models.Thuoc, { foreignKey: 'maThuoc' });
};

module.exports = ThongTinDuocLy;

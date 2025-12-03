const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Thuoc = sequelize.define('Thuoc', {
  maThuoc: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  tenThuoc: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  tenHoatChat: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  hamLuong: {
    type: DataTypes.STRING(50)
  },
  maDVT: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  maNhom: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  soDangKy: {
    type: DataTypes.STRING(50)
  },
  nuocSanXuat: {
    type: DataTypes.STRING(100)
  },
  hangSanXuat: {
    type: DataTypes.STRING(100)
  },
  giaNhap: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  giaBanLe: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  giaBanBuon: {
    type: DataTypes.DECIMAL(12, 2)
  },
  tonKhoToiThieu: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tonKhoHienTai: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  hanSuDung: {
    type: DataTypes.INTEGER
  },
  trangThai: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  }
}, {
  tableName: 'Thuoc',
  timestamps: false
});

Thuoc.associate = (models) => {
  Thuoc.belongsTo(models.DonViTinh, { foreignKey: 'maDVT' });
  Thuoc.belongsTo(models.NhomThuoc, { foreignKey: 'maNhom' });
};

module.exports = Thuoc;

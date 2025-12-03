const db = require("../../models");
const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require('uuid');


const BenhNhan = sequelize.define('BenhNhan', {
  maBN: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => 'BN' + uuidv4().slice(0, 6).toUpperCase()
  },
  hoTen: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gioiTinh: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ngaySinh: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  diaChi: {
    type: DataTypes.STRING,
    allowNull: false
  },
  soDienThoai: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  bhyt: {
    type: DataTypes.STRING,
    unique: true
  },
  maTK: {
  type: DataTypes.STRING,
  allowNull: false
},

}, {
  tableName: 'BenhNhan',
  timestamps: false
});

BenhNhan.associate = (models) => {
  BenhNhan.belongsTo(models.TaiKhoan, { foreignKey: "maTK" });
};

module.exports = BenhNhan;

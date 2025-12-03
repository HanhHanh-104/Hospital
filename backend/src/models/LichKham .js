const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const LichKham = sequelize.define("LichKham", {
  maLich: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  maBN: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  maBS: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ngayKham: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  gioKham: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phong: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ghiChu: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  trangThai: {
    type: DataTypes.STRING(20),
    defaultValue: "CHO_THANH_TOAN", // CHO_THANH_TOAN, DA_THANH_TOAN, DA_HUY
    allowNull: false,
  },
  thoiGianTao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  maHD: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {
  tableName: "LichKham",
  timestamps: false,
});

LichKham.associate = (models) => {
  LichKham.belongsTo(models.BenhNhan, {
    foreignKey: "maBN",
    onDelete: "CASCADE",
    hooks: true
  });

  LichKham.belongsTo(models.BacSi, {
    foreignKey: "maBS",
    onDelete: "CASCADE", // Quan trọng
    hooks: true
  });
};

module.exports = LichKham;

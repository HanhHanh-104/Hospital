// MODEL: Định nghĩa bảng TroLyBacSi từ Hospital5.sql
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const TroLyBacSi = sequelize.define("TroLyBacSi", {
  maTroLy: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  maNS: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  maBacSi: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phamViUyQuyen: {
    type: DataTypes.STRING,
  },
}, {
  tableName: "TroLyBacSi",
  timestamps: false,
});

module.exports = TroLyBacSi;

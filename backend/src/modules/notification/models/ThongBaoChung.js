const { DataTypes } = require("sequelize");
const db = require("../../../models");

const ThongBaoChung = db.sequelize.define("ThongBaoChung", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tieuDe: { type: DataTypes.STRING },
  noiDung: { type: DataTypes.TEXT },
  ngayTao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: "ThongBaoChung",
  timestamps: false,
});

module.exports = ThongBaoChung;

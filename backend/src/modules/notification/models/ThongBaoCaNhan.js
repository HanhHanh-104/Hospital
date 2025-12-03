const { DataTypes } = require("sequelize");
const db = require("../../../models");

const ThongBaoCaNhan = db.sequelize.define("ThongBaoCaNhan", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  maTK: { type: DataTypes.STRING }, // Phù hợp với kiểu TaiKhoan.maTK
  tieuDe: { type: DataTypes.STRING },
  noiDung: { type: DataTypes.TEXT },
  daXem: { type: DataTypes.BOOLEAN, defaultValue: false },
  ngayTao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: "ThongBaoCaNhan",
  timestamps: false,
});

ThongBaoCaNhan.associate = (models) => {
  ThongBaoCaNhan.belongsTo(models.TaiKhoan, { foreignKey: "maTK" });
};

module.exports = ThongBaoCaNhan;

const db = require("../../models");
const { DataTypes } = require("sequelize");

const NhanSuYTe = db.sequelize.define("NhanSuYTe", {
  maNS: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  maTK: {
    type: DataTypes.STRING,
  },
  maKhoa: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  hoTen: {
    type: DataTypes.STRING,
  },
  loaiNS: {
    type: DataTypes.STRING(20),
  },
  chuyenMon: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  capBac: {
    type: DataTypes.STRING(50),
    allowNull: true,
  }
}, {
  tableName: "NhanSuYTe",
  timestamps: false,
});

NhanSuYTe.associate = (models) => {
  NhanSuYTe.belongsTo(models.TaiKhoan, { foreignKey: "maTK" });
  NhanSuYTe.belongsTo(models.KhoaPhong, { foreignKey: "maKhoa" });
};

module.exports = NhanSuYTe;

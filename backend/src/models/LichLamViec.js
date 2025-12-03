const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const LichLamViec = sequelize.define("LichLamViec", {
  maLichLV: {
    type: DataTypes.STRING(100),
    primaryKey: true,
  },
  maNS: {
    type: DataTypes.STRING(100),
    allowNull: true, // ✅ cho phép null nếu không phải nhân sự y tế
  },
  maBS: {
    type: DataTypes.STRING(100),
    allowNull: true, // ✅ FIX CHỖ NÀY: để null nếu không phải bác sĩ
  },
  maCa: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  ngayLamViec: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: "LichLamViec",
  timestamps: false,
});

LichLamViec.associate = (models) => {
  LichLamViec.belongsTo(models.BacSi, { foreignKey: "maBS" });
  LichLamViec.belongsTo(models.NhanSuYTe, { foreignKey: "maNS" });
  LichLamViec.belongsTo(models.CaKham, { foreignKey: "maCa" });
};

module.exports = LichLamViec;

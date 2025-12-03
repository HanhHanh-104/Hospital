const db = require("../../models");
const { DataTypes } = require("sequelize");

const BacSi = db.sequelize.define("BacSi", {
  maBS: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  maTK: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  maKhoa: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hoTen: DataTypes.STRING,
  chucVu: DataTypes.STRING,
  trinhDo: DataTypes.STRING,
  chuyenMon: DataTypes.STRING,
}, {
  tableName: "BacSi",
  timestamps: false
});

BacSi.associate = (models) => {
  BacSi.belongsTo(models.KhoaPhong, { foreignKey: "maKhoa" });
  BacSi.belongsTo(models.TaiKhoan, { foreignKey: "maTK" });
};

module.exports = BacSi;

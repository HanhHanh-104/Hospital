const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const YeuCauXetNghiem = sequelize.define("YeuCauXetNghiem", {
    maYeuCau: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    maBN: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maBS: {
      type: DataTypes.STRING,
    },
    loaiYeuCau: {
      type: DataTypes.STRING,
      defaultValue: "THONG_THUONG"
    },
    ngayYeuCau: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    trangThai: {
      type: DataTypes.STRING,
      defaultValue: "CHO_THUC_HIEN"
    }
  }, {
    tableName: "YeuCauXetNghiem",
    timestamps: false,
  });

  YeuCauXetNghiem.associate = (models) => {
    YeuCauXetNghiem.belongsTo(models.BenhNhan, { foreignKey: "maBN" });
    YeuCauXetNghiem.belongsTo(models.BacSi, { foreignKey: "maBS" });
  };

  return YeuCauXetNghiem;
};

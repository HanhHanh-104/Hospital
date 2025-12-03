const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const XetNghiem = sequelize.define("XetNghiem", {
    maXN: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    maLoaiXN: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tenXN: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chiPhi: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    thoiGianTraKetQua: {
      type: DataTypes.STRING,
    }
  }, {
    tableName: "XetNghiem",
    timestamps: false,
  });

  XetNghiem.associate = (models) => {
    XetNghiem.belongsTo(models.LoaiXetNghiem, {
      foreignKey: "maLoaiXN",
    });
  };

  return XetNghiem;
};

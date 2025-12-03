const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const LoaiXetNghiem = sequelize.define("LoaiXetNghiem", {
    maLoaiXN: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    tenLoai: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    moTa: {
      type: DataTypes.TEXT,
    }
  }, {
    tableName: "LoaiXetNghiem",
    timestamps: false,
  });

  LoaiXetNghiem.associate = (models) => {
    LoaiXetNghiem.hasMany(models.XetNghiem, {
      foreignKey: "maLoaiXN"
    });
  };

  return LoaiXetNghiem;
};

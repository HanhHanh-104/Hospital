const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const HoSoBenhAn = sequelize.define("HoSoBenhAn", {
    maHSBA: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    maBN: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ngayLap: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    dotKhamBenh: {
      type: DataTypes.DATE
    },
    lichSuBenh: {
      type: DataTypes.TEXT
    },
    ghiChu: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: "HoSoBenhAn",
    timestamps: false
  });

  HoSoBenhAn.associate = (models) => {
    HoSoBenhAn.belongsTo(models.BenhNhan, { foreignKey: "maBN" });
  };

  return HoSoBenhAn;
};

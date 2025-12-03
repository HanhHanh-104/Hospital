const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PhieuXetNghiem = sequelize.define("PhieuXetNghiem", {
    maPhieuXN: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    maYeuCau: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maXN: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maNS: {
      type: DataTypes.STRING,
    },
    maHSBA: {
      type: DataTypes.STRING,
    },
    ngayThucHien: {
      type: DataTypes.DATE,
    },
    ketQua: {
      type: DataTypes.TEXT,
    },
    ghiChu: {
      type: DataTypes.TEXT,
    }
  }, {
    tableName: "PhieuXetNghiem",
    timestamps: false,
  });

  //  Cập nhật đúng alias cho Sequelize
  PhieuXetNghiem.associate = (models) => {
    PhieuXetNghiem.belongsTo(models.YeuCauXetNghiem, {
      foreignKey: "maYeuCau",
      as: "YeuCau",
    });
    PhieuXetNghiem.belongsTo(models.XetNghiem, {
      foreignKey: "maXN",
      as: "XetNghiem",
    });
    PhieuXetNghiem.belongsTo(models.NhanSuYTe, {
      foreignKey: "maNS",
      as: "NhanSuYTe",
    });
    PhieuXetNghiem.belongsTo(models.HoSoBenhAn, {
      foreignKey: "maHSBA",
      as: "HoSoBenhAn",
    });
  };

  return PhieuXetNghiem;
};

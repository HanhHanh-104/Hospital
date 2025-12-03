const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const PhieuXetNghiem = sequelize.define("PhieuXetNghiem", {
  maPhieuXN: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  maYeuCau: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  maXN: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  maNS: {
    type: DataTypes.STRING(100)
  },
  maHSBA: {
    type: DataTypes.STRING(100)
  },
  ngayThucHien: {
    type: DataTypes.DATE
  },
  ketQua: {
    type: DataTypes.TEXT
  },
  ghiChu: {
    type: DataTypes.TEXT
  },
  file: {
    type: DataTypes.STRING(255)
  }
}, {
  tableName: "PhieuXetNghiem",
  timestamps: false
});

PhieuXetNghiem.associate = (models) => {
  PhieuXetNghiem.belongsTo(models.YeuCauXetNghiem, {
    foreignKey: "maYeuCau",
    as: "YeuCau" // ✅ thêm alias đúng với frontend
  });
  PhieuXetNghiem.belongsTo(models.XetNghiem, {
    foreignKey: "maXN",
    as: "XetNghiem"
  });
  PhieuXetNghiem.belongsTo(models.NhanSuYTe, {
    foreignKey: "maNS",
    as: "NhanSuYTe"
  });
  PhieuXetNghiem.belongsTo(models.HoSoBenhAn, {
    foreignKey: "maHSBA",
    as: "HoSoBenhAn"
  });
};


module.exports = PhieuXetNghiem;

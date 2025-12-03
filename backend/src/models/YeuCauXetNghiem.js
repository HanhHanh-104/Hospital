const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const YeuCauXetNghiem = sequelize.define('YeuCauXetNghiem', {
  maYeuCau: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  maBN: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  maBS: {
    type: DataTypes.STRING(100)
  },
  loaiYeuCau: {
    type: DataTypes.STRING(20),
    defaultValue: 'THONG_THUONG'
  },
  ngayYeuCau: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  trangThai: {
    type: DataTypes.STRING(20),
    defaultValue: 'CHO_THUC_HIEN'
  }
}, {
  tableName: 'YeuCauXetNghiem',
  timestamps: false
});

YeuCauXetNghiem.associate = (models) => {
  YeuCauXetNghiem.belongsTo(models.BenhNhan, { foreignKey: 'maBN' });
  YeuCauXetNghiem.belongsTo(models.BacSi, { foreignKey: 'maBS' });
};

module.exports = YeuCauXetNghiem;

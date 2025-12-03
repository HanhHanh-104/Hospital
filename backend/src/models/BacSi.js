const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const BacSi = sequelize.define('BacSi', {
  maBS: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  maTK: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  maKhoa: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  hoTen: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  chuyenMon: {
    type: DataTypes.STRING(100)
  },
  chucVu: {
    type: DataTypes.STRING(100)
  },
  trinhDo: {
    type: DataTypes.STRING(50)
  },
  capBac: {
    type: DataTypes.STRING(50),
    defaultValue: 'Bác sĩ điều trị'
  }
}, {
  tableName: 'BacSi',
  timestamps: false
});

BacSi.associate = (models) => {
  BacSi.belongsTo(models.TaiKhoan, { foreignKey: 'maTK' });
  BacSi.belongsTo(models.KhoaPhong, { foreignKey: 'maKhoa' });

  // ✅ Ràng buộc xoá cascade các bảng phụ thuộc
  BacSi.hasMany(models.LichKham, {
    foreignKey: 'maBS',
    onDelete: 'CASCADE',
    hooks: true
  });

  BacSi.hasMany(models.YeuCauXetNghiem, {
    foreignKey: 'maBS',
    onDelete: 'CASCADE',
    hooks: true
  });

  BacSi.hasMany(models.PhieuKham, {
    foreignKey: 'maBS',
    onDelete: 'CASCADE',
    hooks: true
  });

  BacSi.hasMany(models.DonThuoc, {
    foreignKey: 'maBS',
    onDelete: 'CASCADE',
    hooks: true
  });

  BacSi.hasMany(models.LichLamViec, {
    foreignKey: 'maBS',
    onDelete: 'CASCADE',
    hooks: true
  });
};

module.exports = BacSi;

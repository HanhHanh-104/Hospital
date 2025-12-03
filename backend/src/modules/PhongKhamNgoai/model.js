// 📁 src/models/PhongKhamNgoai.js
const { DataTypes } = require("sequelize");

/**
 * Mô hình Phòng Khám Ngoài
 * Dùng để lưu thông tin các cơ sở y tế đối tác ngoài hệ thống
 */
module.exports = (sequelize) => {
  const PhongKhamNgoai = sequelize.define(
    "PhongKhamNgoai",
    {
      maPKN: {
        type: DataTypes.STRING(100),
        primaryKey: true,
        allowNull: false,
      },
      tenPKN: {
        type: DataTypes.STRING(255),
        allowNull: false, // Bắt buộc nhập tên phòng khám
      },
      diaChi: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      soDienThoai: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      trangThai: {
        type: DataTypes.TINYINT,
        defaultValue: 1, // 1: hoạt động, 0: ngưng
      },
      ghiChu: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "PhongKhamNgoai",
      timestamps: false, // Không tự tạo createdAt, updatedAt
    }
  );

  /**
   * Định nghĩa quan hệ (associate)
   * Sau này sẽ dùng khi thêm model BacSiNgoai (1 phòng khám có nhiều bác sĩ ngoài)
   */
  PhongKhamNgoai.associate = (models) => {
    PhongKhamNgoai.hasMany(models.BacSiNgoai, {
      foreignKey: "maPKN",
      as: "BacSiNgoai",
      onDelete: "CASCADE",
      hooks: true,
    });
  };

  return PhongKhamNgoai;
};

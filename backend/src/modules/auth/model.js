const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const TaiKhoan = sequelize.define('TaiKhoan', {
    maTK: {
        type: DataTypes.STRING(100),
        primaryKey: true,
    },
    tenDangNhap: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    matKhau: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
    },
    trangThai: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    maNhom: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    tableName: 'TaiKhoan',
    timestamps: false,
});

module.exports = TaiKhoan;
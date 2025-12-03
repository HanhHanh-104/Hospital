// MODEL: Định nghĩa cấu trúc bảng Thuoc, DonViTinh, NhomThuoc từ CSDL Hospital5.sql
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");

const NhomThuoc = sequelize.define("NhomThuoc", {
  maNhom: { type: DataTypes.STRING, primaryKey: true },
  tenNhom: { type: DataTypes.STRING, allowNull: false },
  moTa: { type: DataTypes.TEXT },
}, {
  tableName: "NhomThuoc",
  timestamps: false,
});

const DonViTinh = sequelize.define("DonViTinh", {
  maDVT: { type: DataTypes.STRING, primaryKey: true },
  tenDVT: { type: DataTypes.STRING, allowNull: false },
  moTa: { type: DataTypes.STRING },
}, {
  tableName: "DonViTinh",
  timestamps: false,
});

const Thuoc = sequelize.define("Thuoc", {
  maThuoc: { type: DataTypes.STRING, primaryKey: true },
  tenThuoc: { type: DataTypes.STRING, allowNull: false },
  tenHoatChat: { type: DataTypes.STRING, allowNull: false },
  hamLuong: { type: DataTypes.STRING },
  maDVT: { type: DataTypes.STRING, allowNull: false },
  maNhom: { type: DataTypes.STRING, allowNull: false },
  soDangKy: { type: DataTypes.STRING },
  nuocSanXuat: { type: DataTypes.STRING },
  hangSanXuat: { type: DataTypes.STRING },
  giaNhap: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  giaBanLe: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  giaBanBuon: { type: DataTypes.DECIMAL(12, 2) },
  tonKhoToiThieu: { type: DataTypes.INTEGER, defaultValue: 0 },
  tonKhoHienTai: { type: DataTypes.INTEGER, defaultValue: 0 },
  hanSuDung: { type: DataTypes.INTEGER },
  trangThai: { type: DataTypes.TINYINT, defaultValue: 1 },
}, {
  tableName: "Thuoc",
  timestamps: false,
});

Thuoc.belongsTo(NhomThuoc, { foreignKey: "maNhom" });
Thuoc.belongsTo(DonViTinh, { foreignKey: "maDVT" });

module.exports = { Thuoc, NhomThuoc, DonViTinh };

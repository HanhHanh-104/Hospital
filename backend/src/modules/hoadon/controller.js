// CONTROLLER: Quản lý hóa đơn, giỏ hàng, thanh toán
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

const { HoaDon, ChiTietHoaDon, ThanhToan, GioHang, ChiTietGioHang } = require("./model");

// ---------------- HOÁ ĐƠN ----------------
exports.getAllHoaDon = async (req, res) => {
  try {
    const ds = await HoaDon.findAll({ order: [["ngayLap", "DESC"]] });
    res.json({ message: "Lấy danh sách hóa đơn", data: ds });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi lấy danh sách hóa đơn", error: err.message });
  }
};

exports.createHoaDon = async (req, res) => {
  try {
    const { maBN, maNS, tongTien, trangThai } = req.body;
    const maHD = uuidv4().slice(0, 8).toUpperCase();
    const hoaDon = await HoaDon.create({ maHD, maBN, maNS, tongTien, trangThai });
    res.status(201).json({ message: "Tạo hóa đơn thành công", data: hoaDon });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi tạo hóa đơn", error: err.message });
  }
};

// ---------------- CHI TIẾT HOÁ ĐƠN ----------------
exports.addChiTietHD = async (req, res) => {
  try {
    const { maHD, loaiDichVu, maDichVu, donGia, soLuong, thanhTien } = req.body;
    const maCTHD = uuidv4().slice(0, 8).toUpperCase();
    const ct = await ChiTietHoaDon.create({ maCTHD, maHD, loaiDichVu, maDichVu, donGia, soLuong, thanhTien });
    res.status(201).json({ message: "Thêm chi tiết hóa đơn thành công", data: ct });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi thêm chi tiết", error: err.message });
  }
};

// ---------------- THANH TOÁN ----------------
exports.createThanhToan = async (req, res) => {
  try {
    const { maHD, soTien, phuongThuc } = req.body;
    const maTT = uuidv4().slice(0, 8).toUpperCase();
    const tt = await ThanhToan.create({ maTT, maHD, soTien, phuongThuc });
    res.status(201).json({ message: "Ghi nhận thanh toán thành công", data: tt });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi tạo thanh toán", error: err.message });
  }
};

exports.getThanhToanByHoaDon = async (req, res) => {
  try {
    const { maHD } = req.params;
    const data = await ThanhToan.findAll({ where: { maHD } });
    res.json({ message: "Chi tiết thanh toán hóa đơn", data });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi truy xuất thanh toán", error: err.message });
  }
};

// ---------------- GIỎ HÀNG ----------------
exports.addToGioHang = async (req, res) => {
  try {
    const { maBN, loaiDichVu, maDichVu, donGia, soLuong, thanhTien } = req.body;
    let gioHang = await GioHang.findOne({ where: { maBN } });
    if (!gioHang) {
      const maGH = uuidv4().slice(0, 8).toUpperCase();
      gioHang = await GioHang.create({ maGH, maBN });
    }
    const maCTGH = uuidv4().slice(0, 8).toUpperCase();
    const item = await ChiTietGioHang.create({ maCTGH, maGH: gioHang.maGH, loaiDichVu, maDichVu, donGia, soLuong, thanhTien });
    res.status(201).json({ message: "Thêm vào giỏ hàng thành công", data: item });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi thêm giỏ hàng", error: err.message });
  }
};

exports.getGioHang = async (req, res) => {
  try {
    const { maBN } = req.params;
    const gh = await GioHang.findOne({ where: { maBN } });
    if (!gh) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    const chiTiet = await ChiTietGioHang.findAll({ where: { maGH: gh.maGH } });
    res.json({ message: "Lấy giỏ hàng thành công", data: { gioHang: gh, chiTiet } });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi lấy giỏ hàng", error: err.message });
  }
};

exports.deleteChiTietGioHang = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ChiTietGioHang.destroy({ where: { maCTGH: id } });
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy chi tiết để xoá" });
    res.json({ message: "Xoá dòng giỏ hàng thành công" });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi xoá dòng giỏ hàng", error: err.message });
  }
};

exports.confirmGioHang = async (req, res) => {
  try {
    const { maBN } = req.body;
    const gioHang = await GioHang.findOne({ where: { maBN } });
    if (!gioHang) return res.status(404).json({ message: "Không có giỏ hàng" });

    const chiTiet = await ChiTietGioHang.findAll({ where: { maGH: gioHang.maGH } });
    if (chiTiet.length === 0) return res.status(400).json({ message: "Giỏ hàng trống" });

    const maHD = uuidv4().slice(0, 8).toUpperCase();
    const tongTien = chiTiet.reduce((sum, item) => sum + parseFloat(item.thanhTien || 0), 0);

    const hoaDon = await HoaDon.create({
      maHD,
      maBN,
      maNS: "SYSTEM", // ✅ Gán mặc định nhân sự hệ thống
      tongTien,
      trangThai: "CHUA_THANH_TOAN"
    });


    await Promise.all(chiTiet.map(item => ChiTietHoaDon.create({
      maCTHD: uuidv4().slice(0, 8).toUpperCase(),
      maHD,
      loaiDichVu: item.loaiDichVu,
      maDichVu: item.maDichVu,
      donGia: item.donGia,
      soLuong: item.soLuong,
      thanhTien: item.thanhTien
    })));

    await ChiTietGioHang.destroy({ where: { maGH: gioHang.maGH } });
    await GioHang.destroy({ where: { maGH: gioHang.maGH } });

    res.status(201).json({ message: "✅ Đã xác nhận và tạo hoá đơn", data: hoaDon });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi xác nhận giỏ hàng", error: err.message });
  }
};

// ---------------- BỆNH NHÂN ----------------
exports.getHoaDonByBenhNhan = async (req, res) => {
  try {
    const { maBN } = req.params;
    const data = await HoaDon.findAll({ where: { maBN }, order: [["ngayLap", "DESC"]] });
    res.json({ message: "Danh sách hóa đơn bệnh nhân", data });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi truy xuất hóa đơn", error: err.message });
  }
};

exports.updateTrangThai = async (req, res) => {
  try {
    const { maHD } = req.params;
    const { trangThai } = req.body;
    const result = await HoaDon.update({ trangThai }, { where: { maHD } });
    if (result[0] === 0) return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
    res.json({ message: "Cập nhật trạng thái thành công" });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi cập nhật trạng thái", error: err.message });
  }
};

// ✅ Thống kê hóa đơn theo khoảng thời gian
exports.thongKe = async (req, res) => {
  try {
    const { from, to } = req.query;

    const startDate = new Date(from + "T00:00:00");
    const endDate = new Date(to + "T23:59:59");

    const ds = await HoaDon.findAll({
      where: {
        ngayLap: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    const tongSo = ds.length;
    const daThanhToan = ds.filter((hd) => hd.trangThai === "DA_THANH_TOAN").length;
    const chuaThanhToan = tongSo - daThanhToan;
    const tongTien = ds.reduce((sum, hd) => sum + parseFloat(hd.tongTien || 0), 0);

    res.json({
      success: true,
      data: { tongSo, daThanhToan, chuaThanhToan, tongTien },
    });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ success: false, message: "Lỗi thống kê", error: err.message });
  }
};

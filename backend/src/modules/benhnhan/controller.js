const { v4: uuidv4 } = require('uuid');
const { BenhNhan, TaiKhoan } = require('../../models'); // ĐÚNG
const { Op } = require('sequelize');


//  Thêm bệnh nhân
exports.create = async (req, res) => {
  const data = req.body;
  console.log("📦 Dữ liệu tạo bệnh nhân:", data);

  try {
    const existsPhone = await BenhNhan.findOne({ where: { soDienThoai: data.soDienThoai } });
    if (existsPhone)
      return res.status(400).json({ success: false, message: "Số điện thoại đã được sử dụng" });

    const existsBenhNhan = await BenhNhan.findOne({ where: { maTK: data.maTK } });
    if (existsBenhNhan)
      return res.status(400).json({ success: false, message: "Tài khoản đã có hồ sơ" });

    const maBN = 'BN' + uuidv4().slice(0, 6).toUpperCase();

    data.ngaySinh = new Date(data.ngaySinh);
    if (isNaN(data.ngaySinh.getTime()))
      return res.status(400).json({ success: false, message: "Ngày sinh không hợp lệ" });

    const newBN = await BenhNhan.create({
      maBN,
      hoTen: data.hoTen,
      ngaySinh: data.ngaySinh,
      gioiTinh: data.gioiTinh,
      soDienThoai: data.soDienThoai,
      email: data.email,
      diaChi: data.diaChi,
      bhyt: data.bhyt || null,
      maTK: data.maTK
    });

    console.log("✅ Tạo bệnh nhân OK:", newBN?.maBN);

    res.status(201).json({ success: true, message: "Thêm bệnh nhân thành công", data: newBN });
  } catch (err) {
    console.error("❌ Lỗi tạo bệnh nhân:", err);
    res.status(500).json({ success: false, message: "Lỗi tạo bệnh nhân" });
  }
};



exports.getOne = async (req, res) => {
  const { id } = req.params;

  try {
    const benhNhan = await BenhNhan.findOne({ where: { maTK: id } });

    if (!benhNhan) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bệnh nhân",
        data: null,
      });
    }

    return res.json({
      success: true,
      message: "Lấy thông tin bệnh nhân thành công",
      data: benhNhan,
    });
  } catch (err) {
    console.error("❌ Lỗi khi lấy bệnh nhân:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thông tin bệnh nhân",
      error: err.message,
    });
  }
};


exports.getAll = async (req, res) => {
  try {
    const ds = await BenhNhan.findAll({
      include: [{ model: TaiKhoan, attributes: ["tenDangNhap", "email", "trangThai"] }]
    });
    res.json({ message: "Lấy danh sách bệnh nhân", data: ds });
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách", error: err.message });
  }
};

exports.update = async (req, res) => {
  const ma = req.params.id;
  const data = req.body;

  const exists = await BenhNhan.findByPk(ma);
  if (!exists) return res.status(404).json({ success: false, message: "Bệnh nhân không tồn tại" });

// trong controller.js > exports.update
  if (data.ngaySinh) {
    data.ngaySinh = new Date(data.ngaySinh);
    if (isNaN(data.ngaySinh.getTime())) {
      return res.status(400).json({ success: false, message: "Ngày sinh không hợp lệ" });
    }
  }


  // Kiểm tra số điện thoại mới có trùng với người khác không
  if (data.soDienThoai !== exists.soDienThoai) {
    const conflict = await BenhNhan.findOne({ where: { soDienThoai: data.soDienThoai } });
    if (conflict) return res.status(400).json({ success: false, message: "Số điện thoại đã được dùng" });
  }

  await BenhNhan.update(data, { where: { maBN: ma } });
  res.json({ success: true, message: "Cập nhật thành công" });
};

exports.remove = async (req, res) => {
  try {
    const deleted = await BenhNhan.destroy({ where: { maBN: req.params.id } });
    if (deleted === 0)
      return res.status(404).json({ message: "Không tìm thấy bệnh nhân để xoá" });
    res.json({ message: "Xoá thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá bệnh nhân", error: err.message });
  }
};

exports.findByMaTK = async (req, res) => {
  try {
    const info = await BenhNhan.findOne({
      where: { maTK: req.params.maTK },
      include: [{ model: TaiKhoan, attributes: ["tenDangNhap", "email", "trangThai"] }]
    });
    if (!info) return res.status(404).json({ message: "Không tìm thấy" });
    res.json({ success: true, data: info });
  } catch (err) {
    res.status(500).json({ message: "Lỗi tìm bệnh nhân", error: err.message });
  }
};

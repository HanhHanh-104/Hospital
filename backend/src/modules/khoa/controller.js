const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const KhoaPhong = require("./model");

exports.getAll = async (req, res) => {
  try {
    const data = await KhoaPhong.findAll();
    res.json({ message: "Lấy danh sách khoa", data });
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách khoa", error: err.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { tenKhoa, moTa } = req.body;
  const maKhoa = uuidv4().slice(0, 8).toUpperCase(); // VD: "3FD28A9C"

  try {
    const khoa = await KhoaPhong.create({ maKhoa, tenKhoa, moTa });
    res.status(201).json({ message: "Tạo khoa thành công", data: khoa });
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo khoa", error: err.message });
  }
};

exports.update = async (req, res) => {
  const { tenKhoa, moTa } = req.body;
  try {
    const [updated] = await KhoaPhong.update({ tenKhoa, moTa }, { where: { maKhoa: req.params.id } });
    if (updated === 0) return res.status(404).json({ message: "Không tìm thấy khoa" });
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật khoa", error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await KhoaPhong.destroy({ where: { maKhoa: req.params.id } });
    if (deleted === 0) return res.status(404).json({ message: "Không tìm thấy khoa để xoá" });
    res.json({ message: "Xoá thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá khoa", error: err.message });
  }
};

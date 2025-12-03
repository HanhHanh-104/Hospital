const db = require("../../models");
const { v4: uuidv4 } = require("uuid");
const LoaiXetNghiem = db.LoaiXetNghiem;

exports.getAll = async (req, res) => {
  try {
    const result = await LoaiXetNghiem.findAll({ order: [["tenLoai", "ASC"]] });
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ success: false, message: "Lỗi lấy dữ liệu", error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { tenLoai, moTa } = req.body;
    const maLoaiXN = uuidv4().slice(0, 8).toUpperCase();
    const created = await LoaiXetNghiem.create({ maLoaiXN, tenLoai, moTa });
    res.status(201).json({ success: true, message: "Đã tạo loại xét nghiệm", data: created });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ success: false, message: "Lỗi tạo mới", error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { tenLoai, moTa } = req.body;
    const [updated] = await LoaiXetNghiem.update({ tenLoai, moTa }, {
      where: { maLoaiXN: req.params.id }
    });
    if (!updated) return res.status(404).json({ success: false, message: "Không tìm thấy loại xét nghiệm" });
    res.json({ success: true, message: "Đã cập nhật loại xét nghiệm" });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ success: false, message: "Lỗi cập nhật", error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await LoaiXetNghiem.destroy({ where: { maLoaiXN: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: "Không tìm thấy để xoá" });
    res.json({ success: true, message: "Đã xoá loại xét nghiệm" });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ success: false, message: "Lỗi xoá", error: err.message });
  }
};

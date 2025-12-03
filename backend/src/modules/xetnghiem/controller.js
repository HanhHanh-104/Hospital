const db = require("../../models");
const { v4: uuidv4 } = require("uuid");
const XetNghiem = db.XetNghiem;
const LoaiXetNghiem = db.LoaiXetNghiem;

exports.getAll = async (req, res) => {
  try {
    const list = await XetNghiem.findAll({
      include: [{ model: LoaiXetNghiem }],
      order: [["tenXN", "ASC"]],
    });
    res.json({ success: true, data: list });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ success: false, message: "Lỗi truy xuất dữ liệu", error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { maLoaiXN, tenXN, chiPhi, thoiGianTraKetQua } = req.body;
    const maXN = uuidv4().slice(0, 8).toUpperCase();
    const created = await XetNghiem.create({ maXN, maLoaiXN, tenXN, chiPhi, thoiGianTraKetQua });
    res.status(201).json({ success: true, message: "Đã tạo xét nghiệm", data: created });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ success: false, message: "Lỗi tạo mới", error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { tenXN, chiPhi, thoiGianTraKetQua } = req.body;
    const [updated] = await XetNghiem.update(
      { tenXN, chiPhi, thoiGianTraKetQua },
      { where: { maXN: req.params.id } }
    );
    if (!updated) return res.status(404).json({ success: false, message: "Không tìm thấy xét nghiệm" });
    res.json({ success: true, message: "Đã cập nhật xét nghiệm" });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ success: false, message: "Lỗi cập nhật", error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await XetNghiem.destroy({ where: { maXN: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: "Không tìm thấy để xoá" });
    res.json({ success: true, message: "Đã xoá xét nghiệm" });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ success: false, message: "Lỗi xoá", error: err.message });
  }
};

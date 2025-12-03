// 📁 backend/src/modules/PhongKhamNgoai/controller.js
const PhongKhamNgoai = require("./model");

// ✅ Lấy danh sách tất cả phòng khám ngoài
exports.getAll = async (req, res) => {
  try {
    const list = await PhongKhamNgoai.findAll();
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    console.error("❌ Lỗi getAll:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Lấy chi tiết 1 phòng khám
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await PhongKhamNgoai.findByPk(id);
    if (!data) return res.status(404).json({ success: false, message: "Không tìm thấy phòng khám." });
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Tạo mới
exports.create = async (req, res) => {
  try {
    const newClinic = await PhongKhamNgoai.create(req.body);
    res.status(201).json({ success: true, data: newClinic });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Cập nhật thông tin
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const found = await PhongKhamNgoai.findByPk(id);
    if (!found) return res.status(404).json({ success: false, message: "Không tìm thấy phòng khám." });
    await found.update(req.body);
    res.status(200).json({ success: true, data: found });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Xóa
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PhongKhamNgoai.destroy({ where: { maPKN: id } });
    if (!deleted) return res.status(404).json({ success: false, message: "Không tìm thấy phòng khám." });
    res.status(200).json({ success: true, message: "Đã xóa thành công." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CONTROLLER: Quản lý ca trực bệnh viện
const { v4: uuidv4 } = require("uuid");
const { CaKham } = require("./model");

// Lấy tất cả ca trực
exports.getAll = async (req, res) => {
  try {
    const list = await CaKham.findAll({ order: [["thoiGianBatDau", "ASC"]] });
    res.json({ message: "Lấy danh sách ca trực", data: list });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi lấy danh sách ca", error: err.message });
  }
};

// Tạo ca trực mới
exports.create = async (req, res) => {
  try {
    const { tenCa, thoiGianBatDau, thoiGianKetThuc } = req.body;
    const maCa = uuidv4().slice(0, 8).toUpperCase();

    const data = await CaKham.create({ maCa, tenCa, thoiGianBatDau, thoiGianKetThuc });
    res.status(201).json({ message: "Tạo ca trực thành công", data });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi tạo ca", error: err.message });
  }
};

// Cập nhật ca trực
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenCa, thoiGianBatDau, thoiGianKetThuc } = req.body;

    const [updated] = await CaKham.update(
      { tenCa, thoiGianBatDau, thoiGianKetThuc },
      { where: { maCa: id } }
    );

    if (!updated) return res.status(404).json({ message: "Không tìm thấy ca để cập nhật" });

    res.json({ message: "Cập nhật ca trực thành công" });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi cập nhật ca", error: err.message });
  }
};

// Xoá ca trực
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CaKham.destroy({ where: { maCa: id } });

    if (!deleted) return res.status(404).json({ message: "Không tìm thấy ca để xoá" });

    res.json({ message: "Xoá ca trực thành công" });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi xoá ca", error: err.message });
  }
};

// CONTROLLER: Quản lý trợ lý bác sĩ – ADMIN tạo, BACSI xem trợ lý của mình
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const TroLyBacSi = require("../../models/TroLyBacSi");

// ===================== LẤY DANH SÁCH =====================
exports.getAll = async (req, res) => {
  try {
    const { maNhom, maTK } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const condition = maNhom === "BACSI" ? { maBacSi: maTK } : {};

    const danhSach = await TroLyBacSi.findAndCountAll({
      where: condition,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });

    res.status(200).json({
      message: "Lấy danh sách trợ lý thành công",
      data: {
        items: danhSach.rows,
        total: danhSach.count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(danhSach.count / limit),
      },
    });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi truy xuất danh sách trợ lý", error: err.message });
  }
};

// ===================== TẠO TRỢ LÝ (ADMIN) =====================
exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const maTroLy = uuidv4().slice(0, 8).toUpperCase();
    const { maNS, maBacSi, phamViUyQuyen } = req.body;

    const newAssistant = await TroLyBacSi.create({
      maTroLy,
      maNS,
      maBacSi,
      phamViUyQuyen,
    });

    res.status(201).json({ message: "Thêm trợ lý thành công", data: newAssistant });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi khi thêm trợ lý", error: err.message });
  }
};

// ===================== CẬP NHẬT TRỢ LÝ (ADMIN) =====================
exports.update = async (req, res) => {
  try {
    const { maNS, maBacSi, phamViUyQuyen } = req.body;
    const { maTroLy } = req.params;

    const [updated] = await TroLyBacSi.update(
      { maNS, maBacSi, phamViUyQuyen },
      { where: { maTroLy } }
    );

    if (updated === 0)
      return res.status(404).json({ message: "Không tìm thấy trợ lý để cập nhật" });

    res.json({ message: "Cập nhật trợ lý thành công" });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi cập nhật trợ lý", error: err.message });
  }
};

// ===================== XOÁ TRỢ LÝ (ADMIN) =====================
exports.remove = async (req, res) => {
  try {
    const { maTroLy } = req.params;

    const deleted = await TroLyBacSi.destroy({ where: { maTroLy } });

    if (deleted === 0)
      return res.status(404).json({ message: "Không tìm thấy trợ lý để xoá" });

    res.json({ message: "Xoá trợ lý thành công" });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi xoá trợ lý", error: err.message });
  }
};

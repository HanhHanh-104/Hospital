// controllers/thongBaoController.js

const ThongBaoCaNhan = require("../models/ThongBaoCaNhan");
const ThongBaoChung = require("../models/ThongBaoChung");


// Lấy toàn bộ thông báo (cá nhân + chung)
exports.getAll = async (req, res) => {
  const maTK = req.params.maTK;
  try {
    const thongBaoCaNhan = await ThongBaoCaNhan.findAll({
      where: { maTK },
      order: [["ngayTao", "DESC"]]
    });

    const thongBaoChung = await ThongBaoChung.findAll({
      order: [["ngayTao", "DESC"]]
    });

    res.json({
      message: "Danh sách thông báo",
      data: {
        caNhan: thongBaoCaNhan,
        chung: thongBaoChung
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách thông báo", error: err.message });
  }
};

// Tạo thông báo cá nhân
exports.createCaNhan = async (req, res) => {
  try {
    const { maTK, tieuDe, noiDung } = req.body;
    const tb = await ThongBaoCaNhan.create({ maTK, tieuDe, noiDung });
    res.status(201).json({ message: "Tạo thông báo cá nhân thành công", data: tb });
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo thông báo", error: err.message });
  }
};

// Tạo thông báo chung
exports.createChung = async (req, res) => {
  try {
    const { tieuDe, noiDung } = req.body;
    const tb = await ThongBaoChung.create({ tieuDe, noiDung });
    res.status(201).json({ message: "Tạo thông báo chung thành công", data: tb });
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo thông báo chung", error: err.message });
  }
};

// Đánh dấu đã xem (cá nhân)
exports.markAsRead = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await ThongBaoCaNhan.update(
      { daXem: true },
      { where: { id } }
    );
    if (updated[0] === 0)
      return res.status(404).json({ message: "Không tìm thấy thông báo" });
    res.json({ message: "Đã đánh dấu đã xem" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật", error: err.message });
  }
};

// Xoá thông báo cá nhân
exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await ThongBaoCaNhan.destroy({ where: { id } });
    if (deleted === 0)
      return res.status(404).json({ message: "Không tìm thấy thông báo để xoá" });
    res.json({ message: "Xoá thông báo thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá", error: err.message });
  }
};

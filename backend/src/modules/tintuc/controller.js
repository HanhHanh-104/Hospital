const { v4: uuidv4 } = require("uuid");
const db = require("../../models");
const TinTuc = db.TinTuc;
const NhanSuYTe = db.NhanSuYTe;

// Lấy tất cả tin tức (public)
exports.getAll = async (req, res) => {
  try {
    const { loai, trangThai } = req.query;
    const where = {};
    if (loai) where.loai = loai;
    if (trangThai) {
      where.trangThai = trangThai;
    } else {
      // Mặc định chỉ lấy tin đang hiển thị
      where.trangThai = "HIEN_THI";
    }

    const data = await TinTuc.findAll({
      where,
      include: [{ model: NhanSuYTe, attributes: ["hoTen"] }],
      order: [["ngayDang", "DESC"]]
    });
    res.json({ success: true, data });
  } catch (err) {
    console.error("❌ Lỗi:", err);
    res.status(500).json({ success: false, message: "Lỗi lấy danh sách tin tức", error: err.message });
  }
};

// Lấy 1 tin tức theo ID
exports.getOne = async (req, res) => {
  try {
    const { maTin } = req.params;
    const data = await TinTuc.findOne({
      where: { maTin },
      include: [{ model: NhanSuYTe, attributes: ["hoTen"] }]
    });

    if (!data) {
      return res.status(404).json({ success: false, message: "Không tìm thấy tin tức" });
    }

    // Tăng lượt xem
    await TinTuc.update(
      { luotXem: (data.luotXem || 0) + 1 },
      { where: { maTin } }
    );

    res.json({ success: true, data });
  } catch (err) {
    console.error("❌ Lỗi:", err);
    res.status(500).json({ success: false, message: "Lỗi lấy tin tức", error: err.message });
  }
};

// Tạo tin tức mới (Admin/Nhân viên)
exports.create = async (req, res) => {
  try {
    const { tieuDe, tomTat, noiDung, loai, hinhAnh } = req.body;
    const maNS = req.user?.maNS || req.body.maNS;

    if (!maNS) {
      return res.status(400).json({ success: false, message: "Thiếu mã nhân sự" });
    }

    const maTin = uuidv4().slice(0, 8).toUpperCase();
    const data = await TinTuc.create({
      maTin,
      tieuDe,
      tomTat,
      noiDung,
      loai: loai || "TIN_TUC",
      hinhAnh,
      maNS,
      ngayDang: new Date(),
      trangThai: "HIEN_THI",
      luotXem: 0
    });

    res.status(201).json({ success: true, message: "Tạo tin tức thành công", data });
  } catch (err) {
    console.error("❌ Lỗi:", err);
    res.status(500).json({ success: false, message: "Lỗi tạo tin tức", error: err.message });
  }
};

// Cập nhật tin tức
exports.update = async (req, res) => {
  try {
    const { maTin } = req.params;
    const { tieuDe, tomTat, noiDung, loai, hinhAnh, trangThai } = req.body;

    const [updated] = await TinTuc.update(
      {
        tieuDe,
        tomTat,
        noiDung,
        loai,
        hinhAnh,
        trangThai
      },
      { where: { maTin } }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Không tìm thấy tin tức" });
    }

    res.json({ success: true, message: "Cập nhật tin tức thành công" });
  } catch (err) {
    console.error("❌ Lỗi:", err);
    res.status(500).json({ success: false, message: "Lỗi cập nhật tin tức", error: err.message });
  }
};

// Xóa tin tức
exports.delete = async (req, res) => {
  try {
    const { maTin } = req.params;
    const deleted = await TinTuc.destroy({ where: { maTin } });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Không tìm thấy tin tức" });
    }

    res.json({ success: true, message: "Xóa tin tức thành công" });
  } catch (err) {
    console.error("❌ Lỗi:", err);
    res.status(500).json({ success: false, message: "Lỗi xóa tin tức", error: err.message });
  }
};


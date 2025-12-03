const { v4: uuidv4 } = require("uuid");
const db = require("../../models");
const PhanHoi = db.PhanHoi;
const BenhNhan = db.BenhNhan;
const NhanSuYTe = db.NhanSuYTe;

// Bệnh nhân: Tạo phản hồi mới
exports.create = async (req, res) => {
  try {
    const { tieuDe, noiDung, loai } = req.body;
    const maBN = req.user?.maBN || req.body.maBN;
    
    if (!maBN) {
      return res.status(400).json({ success: false, message: "Thiếu mã bệnh nhân" });
    }

    const maPH = uuidv4().slice(0, 8).toUpperCase();
    const data = await PhanHoi.create({
      maPH,
      maBN,
      tieuDe: tieuDe || "Phản hồi",
      noiDung,
      loai: loai || "PHAN_HOI",
      ngayGui: new Date(),
      trangThai: "CHO_XU_LY"
    });

    res.status(201).json({ success: true, message: "Gửi phản hồi thành công", data });
  } catch (err) {
    console.error("❌ Lỗi:", err);
    res.status(500).json({ success: false, message: "Lỗi gửi phản hồi", error: err.message });
  }
};

// Bệnh nhân: Xem phản hồi của mình
exports.getByBenhNhan = async (req, res) => {
  try {
    const maBN = req.user?.maBN || req.params.maBN;
    const data = await PhanHoi.findAll({
      where: { maBN },
      include: [{ model: BenhNhan, attributes: ["hoTen"] }],
      order: [["ngayGui", "DESC"]]
    });
    res.json({ success: true, data });
  } catch (err) {
    console.error("❌ Lỗi:", err);
    res.status(500).json({ success: false, message: "Lỗi lấy phản hồi", error: err.message });
  }
};

// Nhân viên/Admin: Lấy tất cả phản hồi
exports.getAll = async (req, res) => {
  try {
    const { trangThai, loai } = req.query;
    const where = {};
    if (trangThai) where.trangThai = trangThai;
    if (loai) where.loai = loai;

    const data = await PhanHoi.findAll({
      where,
      include: [
        { model: BenhNhan, attributes: ["hoTen", "soDienThoai", "email"] },
        { model: NhanSuYTe, attributes: ["hoTen"], as: "NhanSuYTe", required: false }
      ],
      order: [["ngayGui", "DESC"]]
    });
    res.json({ success: true, data });
  } catch (err) {
    console.error("❌ Lỗi:", err);
    res.status(500).json({ success: false, message: "Lỗi lấy danh sách phản hồi", error: err.message });
  }
};

// Nhân viên/Admin: Xử lý phản hồi
exports.update = async (req, res) => {
  try {
    const { maPH } = req.params;
    const { phanHoi, trangThai } = req.body;
    const maNS = req.user?.maNS;

    const [updated] = await PhanHoi.update(
      {
        phanHoi,
        trangThai: trangThai || "DA_XU_LY",
        maNS,
        ngayPhanHoi: new Date()
      },
      { where: { maPH } }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Không tìm thấy phản hồi" });
    }

    res.json({ success: true, message: "Cập nhật phản hồi thành công" });
  } catch (err) {
    console.error("❌ Lỗi:", err);
    res.status(500).json({ success: false, message: "Lỗi cập nhật phản hồi", error: err.message });
  }
};

// Admin: Xóa phản hồi
exports.delete = async (req, res) => {
  try {
    const { maPH } = req.params;
    const deleted = await PhanHoi.destroy({ where: { maPH } });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Không tìm thấy phản hồi" });
    }

    res.json({ success: true, message: "Xóa phản hồi thành công" });
  } catch (err) {
    console.error("❌ Lỗi:", err);
    res.status(500).json({ success: false, message: "Lỗi xóa phản hồi", error: err.message });
  }
};

// Thống kê phản hồi
exports.getStats = async (req, res) => {
  try {
    const total = await PhanHoi.count();
    const choXuLy = await PhanHoi.count({ where: { trangThai: "CHO_XU_LY" } });
    const daXuLy = await PhanHoi.count({ where: { trangThai: "DA_XU_LY" } });
    const dangXuLy = await PhanHoi.count({ where: { trangThai: "DANG_XU_LY" } });

    res.json({
      success: true,
      data: {
        total,
        choXuLy,
        daXuLy,
        dangXuLy
      }
    });
  } catch (err) {
    console.error("❌ Lỗi:", err);
    res.status(500).json({ success: false, message: "Lỗi thống kê", error: err.message });
  }
};


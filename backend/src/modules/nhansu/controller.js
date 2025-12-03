const { NhanSuYTe, TaiKhoan, KhoaPhong } = require("../../models");

exports.getAll = async (req, res) => {
  try {
    const ds = await NhanSuYTe.findAll({
      include: [
        { model: TaiKhoan, attributes: ["tenDangNhap", "email", "trangThai"] },
        { model: KhoaPhong, attributes: ["tenKhoa"] }
      ]
    });
    res.json({ message: "Lấy danh sách nhân viên", data: ds });
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách nhân viên", error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { hoTen, loaiNS, capBac, chuyenMon, maKhoa } = req.body;
    const [updated] = await NhanSuYTe.update(
      { hoTen, loaiNS, capBac, chuyenMon, maKhoa },
      { where: { maNS: req.params.id } }
    );
    if (updated === 0)
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật", error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await NhanSuYTe.destroy({ where: { maNS: req.params.id } });
    if (deleted === 0)
      return res.status(404).json({ message: "Không tìm thấy nhân viên để xoá" });
    res.json({ message: "Xoá thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá nhân viên", error: err.message });
  }
};

const { v4: uuidv4 } = require("uuid");
const { BacSi, TaiKhoan, KhoaPhong } = require("../../models");

exports.getAll = async (req, res) => {
  try {
    const ds = await BacSi.findAll({
      include: [
        { model: TaiKhoan, attributes: ["tenDangNhap", "email", "trangThai"] },
        { model: KhoaPhong, attributes: ["tenKhoa"] }
      ]
    });
    res.json({ message: "Lấy danh sách bác sĩ", data: ds });
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy bác sĩ", error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { hoTen, chuyenMon, chucVu, trinhDo, maKhoa, capBac } = req.body;
    const [updated] = await BacSi.update(
      { hoTen, chuyenMon, chucVu, trinhDo, maKhoa, capBac },
      { where: { maBS: req.params.id } }
    );
    if (updated === 0)
      return res.status(404).json({ message: "Không tìm thấy bác sĩ" });
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật", error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await BacSi.destroy({ where: { maBS: req.params.id } });
    if (deleted === 0)
      return res.status(404).json({ message: "Không tìm thấy bác sĩ để xoá" });
    res.json({ message: "Xoá thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá", error: err.message });
  }
};


exports.getByMaTK = async (req, res) => {
  try {
    // Thêm include để lấy thông tin TaiKhoan và KhoaPhong
    const bacsi = await BacSi.findOne({ 
      where: { maTK: req.params.maTK },
      include: [
        { model: TaiKhoan, attributes: ["tenDangNhap", "email"] },
        { model: KhoaPhong, attributes: ["tenKhoa", "maKhoa"] } // Lấy cả maKhoa và tenKhoa
      ]
    });
    
    if (!bacsi)
      return res.status(404).json({ message: "Không tìm thấy bác sĩ với mã tài khoản này" });
      
    // Trả về dữ liệu đã join
    res.json({ success: true, data: bacsi }); 
    
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi truy xuất bác sĩ", error: err.message });
  }
};

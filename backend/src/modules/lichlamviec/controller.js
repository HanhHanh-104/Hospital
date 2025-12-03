const { v4: uuidv4 } = require("uuid");
const { LichLamViec } = require("./model");

// ✅ Lấy toàn bộ lịch làm việc (ADMIN)
exports.getAll = async (req, res) => {
  try {
    const data = await LichLamViec.findAll({ order: [["ngayLamViec", "DESC"]] });
    res.json({ message: "Lấy toàn bộ lịch làm việc", data });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi lấy lịch làm việc", error: err.message });
  }
};

// ✅ Lấy lịch làm việc theo mã nhân sự
exports.getByNhanSu = async (req, res) => {
  try {
    const { maNS } = req.params;
    const data = await LichLamViec.findAll({
      where: { maNS },
      order: [["ngayLamViec", "DESC"]],
    });
    res.json({ message: "Lấy lịch làm việc theo nhân sự", data });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi lấy lịch nhân sự", error: err.message });
  }
};

// ✅ Lấy lịch làm việc theo mã bác sĩ
exports.getByBacSi = async (req, res) => {
  try {
    const { maBS } = req.params;
    const data = await LichLamViec.findAll({
      where: { maBS },
      order: [["ngayLamViec", "DESC"]],
    });
    res.json({ message: "Lấy lịch làm việc theo bác sĩ", data });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi lấy lịch bác sĩ", error: err.message });
  }
};

// ✅ Tạo mới lịch làm việc (Fix lỗi FK maBS undefined)
exports.create = async (req, res) => {
  try {
    const { maNS, maCa, ngayLamViec, maBS } = req.body;
    const maLichLV = uuidv4().slice(0, 8).toUpperCase();

    console.log("📥 Dữ liệu nhận được:", req.body);

    const newData = await LichLamViec.create({
      maLichLV,
      maCa,
      ngayLamViec,
      maNS: maNS && maNS !== 'undefined' ? maNS : null,
      maBS: maBS && maBS !== 'undefined' ? maBS : null
    });

    res.status(201).json({ message: "Tạo lịch làm việc thành công", data: newData });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi tạo lịch làm việc", error: err.message });
  }
};

// ✅ Cập nhật lịch làm việc (Fix lỗi FK maBS undefined)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { maCa, ngayLamViec, maNS, maBS } = req.body;

    const [updated] = await LichLamViec.update(
      {
        maCa,
        ngayLamViec,
        maNS: maNS && maNS !== 'undefined' ? maNS : null,
        maBS: maBS && maBS !== 'undefined' ? maBS : null
      },
      { where: { maLichLV: id } }
    );

    if (!updated) return res.status(404).json({ message: "Không tìm thấy lịch để cập nhật" });

    res.json({ message: "Cập nhật lịch làm việc thành công" });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi cập nhật lịch làm việc", error: err.message });
  }
};

// ✅ Xoá lịch làm việc
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await LichLamViec.destroy({ where: { maLichLV: id } });

    if (!deleted) return res.status(404).json({ message: "Không tìm thấy lịch để xoá" });

    res.json({ message: "Xoá lịch làm việc thành công" });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi xoá lịch làm việc", error: err.message });
  }
};

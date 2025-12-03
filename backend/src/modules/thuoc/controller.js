const { v4: uuidv4 } = require("uuid");
const { Thuoc, NhomThuoc, DonViTinh } = require("./model");

// ========== THUỐC ==========
exports.getAllThuoc = async (req, res) => {
  try {
    const ds = await Thuoc.findAll({
      include: [NhomThuoc, DonViTinh],
      order: [["tenThuoc", "ASC"]],
    });
    res.json({ message: "Lấy danh sách thuốc thành công", data: ds });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách thuốc", error: err.message });
  }
};

exports.getOneThuoc = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Thuoc.findOne({ where: { maThuoc: id } });
    if (!data) return res.status(404).json({ message: "Không tìm thấy thuốc" });
    res.json({ data });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi khi lấy thuốc", error: err.message });
  }
};

exports.createThuoc = async (req, res) => {
  try {
    const {
      tenThuoc, tenHoatChat, hamLuong, maDVT, maNhom,
      soDangKy, nuocSanXuat, hangSanXuat,
      giaNhap, giaBanLe, giaBanBuon,
      tonKhoToiThieu, tonKhoHienTai, hanSuDung
    } = req.body;

    const maThuoc = uuidv4().slice(0, 8).toUpperCase();

    const newData = await Thuoc.create({
      maThuoc, tenThuoc, tenHoatChat, hamLuong,
      maDVT, maNhom, soDangKy, nuocSanXuat, hangSanXuat,
      giaNhap, giaBanLe, giaBanBuon,
      tonKhoToiThieu, tonKhoHienTai, hanSuDung,
      trangThai: 1
    });

    res.status(201).json({ message: "Thêm thuốc thành công", data: newData });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi khi thêm thuốc", error: err.message });
  }
};

exports.updateThuoc = async (req, res) => {
  try {
    const maThuoc = req.params.id;
    const {
      tenThuoc, tenHoatChat, hamLuong, maDVT, maNhom,
      soDangKy, nuocSanXuat, hangSanXuat,
      giaNhap, giaBanLe, giaBanBuon,
      tonKhoToiThieu, tonKhoHienTai, hanSuDung, trangThai
    } = req.body;

    const data = {
      tenThuoc, tenHoatChat, hamLuong, maDVT, maNhom,
      soDangKy, nuocSanXuat, hangSanXuat,
      giaNhap, giaBanLe, giaBanBuon,
      tonKhoToiThieu, tonKhoHienTai, hanSuDung
    };

    // ✅ Chỉ thêm trangThai nếu được gửi lên
    if (trangThai !== undefined) {
      data.trangThai = trangThai;
    }

    const [updated] = await Thuoc.update(data, { where: { maThuoc } });

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy thuốc để cập nhật" });
    }

    res.json({ message: "Cập nhật thuốc thành công" });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi cập nhật thuốc", error: err.message });
  }
};


exports.deleteThuoc = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Thuoc.destroy({ where: { maThuoc: id } });
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy thuốc để xoá" });
    res.json({ message: "Xoá thuốc thành công" });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi xoá thuốc", error: err.message });
  }
};

// ========== NHÓM THUỐC ==========
exports.getAllNhom = async (req, res) => {
  try {
    const ds = await NhomThuoc.findAll({ order: [["tenNhom", "ASC"]] });
    res.json({ message: "Lấy danh sách nhóm thuốc thành công", data: ds });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi khi lấy nhóm thuốc", error: err.message });
  }
};

exports.getOneNhom = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await NhomThuoc.findOne({ where: { maNhom: id } });
    if (!data) return res.status(404).json({ message: "Không tìm thấy nhóm thuốc" });
    res.json({ data });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi khi lấy nhóm thuốc", error: err.message });
  }
};

exports.createNhom = async (req, res) => {
  try {
    const { tenNhom, moTa } = req.body;
    const maNhom = uuidv4().slice(0, 8).toUpperCase();
    const created = await NhomThuoc.create({ maNhom, tenNhom, moTa });
    res.status(201).json({ message: "Tạo nhóm thuốc thành công", data: created });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi tạo nhóm thuốc", error: err.message });
  }
};

exports.updateNhom = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await NhomThuoc.update(req.body, { where: { maNhom: id } });
    if (!updated[0]) return res.status(404).json({ message: "Không tìm thấy nhóm thuốc" });
    res.json({ message: "Cập nhật nhóm thuốc thành công" });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi cập nhật nhóm thuốc", error: err.message });
  }
};

exports.deleteNhom = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await NhomThuoc.destroy({ where: { maNhom: id } });
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy nhóm thuốc để xoá" });
    res.json({ message: "Xoá nhóm thuốc thành công" });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi xoá nhóm thuốc", error: err.message });
  }
};

// ========== ĐƠN VỊ TÍNH ==========
exports.getAllDonVi = async (req, res) => {
  try {
    const ds = await DonViTinh.findAll({ order: [["tenDVT", "ASC"]] });
    res.json({ message: "Lấy danh sách đơn vị tính thành công", data: ds });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi khi lấy đơn vị", error: err.message });
  }
};

exports.getOneDonVi = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await DonViTinh.findOne({ where: { maDVT: id } });
    if (!data) return res.status(404).json({ message: "Không tìm thấy đơn vị tính" });
    res.json({ data });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi khi lấy đơn vị", error: err.message });
  }
};

exports.createDonVi = async (req, res) => {
  try {
    const { tenDVT, moTa } = req.body;
    const maDVT = uuidv4().slice(0, 8).toUpperCase();
    const created = await DonViTinh.create({ maDVT, tenDVT, moTa });
    res.status(201).json({ message: "Tạo đơn vị tính thành công", data: created });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi tạo đơn vị", error: err.message });
  }
};

exports.updateDonVi = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await DonViTinh.update(req.body, { where: { maDVT: id } });
    if (!updated[0]) return res.status(404).json({ message: "Không tìm thấy đơn vị tính" });
    res.json({ message: "Cập nhật đơn vị tính thành công" });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi cập nhật đơn vị", error: err.message });
  }
};

exports.deleteDonVi = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DonViTinh.destroy({ where: { maDVT: id } });
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy đơn vị để xoá" });
    res.json({ message: "Xoá đơn vị tính thành công" });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ message: "Lỗi xoá đơn vị", error: err.message });
  }
};

const db = require("../../models");
const { v4: uuidv4 } = require("uuid");
const blockchainService = require("../../services/blockchain.service");
const { Op } = require("sequelize"); 
const fs = require("fs");

// (Các hằng số Phieu, YeuCau, v.v. giữ nguyên)
const Phieu = db.PhieuXetNghiem;
const YeuCau = db.YeuCauXetNghiem;
const XetNghiem = db.XetNghiem;
const NhanSuYTe = db.NhanSuYTe;
const HoSoBenhAn = db.HoSoBenhAn;
const LichKham = db.LichKham;


// Sửa 1: Cập nhật hàm getAll để tìm block_type mới
exports.getAll = async (req, res) => {
  try {
    // Chúng ta sẽ đọc từ bảng PhieuXetNghiem CŨ (nếu vẫn dùng song song)
    // HOẶC đọc từ blockchain (nếu chỉ dùng blockchain)
    
    // Giả sử vẫn đọc từ bảng cũ để demo
    // ✅ FIX: Chỉ select các trường tồn tại trong DB, loại bỏ 'file' nếu chưa có cột
    const list = await db.PhieuXetNghiem.findAll({
      attributes: {
        exclude: ['file'] // Loại bỏ trường 'file' khỏi SELECT nếu chưa có trong DB
      },
      include: [
        { model: db.YeuCauXetNghiem, as: "YeuCau" },
        { model: db.XetNghiem, as: "XetNghiem" },
        { model: db.NhanSuYTe, as: "NhanSuYTe" },
        { model: db.HoSoBenhAn, as: "HoSoBenhAn" }
      ],
      order: [["ngayThucHien", "DESC"]],
    });

    res.json({ success: true, data: list });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi lấy dữ liệu",
      error: err.message
    });
  }
};


// === SỬA 2: Sửa hàm CREATE ===
// Hàm này giờ sẽ nhận TẤT CẢ thông tin (bao gồm cả kết quả)
exports.create = async (req, res) => {
  let uploadedFilePath = null;
  try {
    const { maYeuCau, maXN, maHSBA, ngayThucHien, ghiChu, ketQua } = req.body;
    
    // 1. XỬ LÝ FILE PATH (Nếu Multer đã upload thành công)
    if (req.file) {
      uploadedFilePath = req.file.path; // Đường dẫn vật lý
    }
    const filePathUrl = uploadedFilePath ? `/uploads/${req.file.filename}` : null; // Đường dẫn công khai

    const maTK_NguoiTao = req.user.maTK;
    if (!maTK_NguoiTao) {
      if (uploadedFilePath) fs.unlinkSync(uploadedFilePath);
      return res.status(401).json({ message: "Lỗi xác thực: không tìm thấy maTK người dùng." });
    }
    
    // ... (logic kiểm tra thiếu thông tin giữ nguyên)
    
    // 1. Tạo dữ liệu khối hoàn chỉnh
    const phieuHoanChinhData = {
        maPhieuXN: uuidv4().slice(0, 8).toUpperCase(),
        maYeuCau: maYeuCau,
        maXN: maXN,
        maNS: maTK_NguoiTao, 
        ngayThucHien: ngayThucHien,
        ghiChu: ghiChu,
        ketQua: ketQua, 
        file: filePathUrl, // <-- LƯU PATH URL
    };

    // 2. Ghi vào chuỗi khối
    await blockchainService.addBlock(maHSBA, 'XET_NGHIEM_HOAN_CHINH', phieuHoanChinhData, maTK_NguoiTao);
    
    // 3. (Quan trọng) Cập nhật trạng thái của YeuCauXetNghiem
    await YeuCau.update({ trangThai: 'DA_HOAN_THANH' }, { where: { maYeuCau: maYeuCau } });
    
    // 4. (Tùy chọn) Vẫn tạo ở bảng cũ (KHÔNG LƯU FILE nếu cột chưa tồn tại)
    // ✅ FIX: Loại bỏ trường 'file' khi insert vào bảng cũ nếu cột chưa có trong DB
    const { file, ...phieuDataWithoutFile } = phieuHoanChinhData;
    await Phieu.create({ ...phieuDataWithoutFile, maHSBA: maHSBA });

    res.status(201).json({ success: true, message: "Đã tạo phiếu xét nghiệm (block) hoàn chỉnh", data: phieuHoanChinhData });
  } catch (err) {
    console.error("❌ Lỗi tạo phiếu:", err);
    // Xóa file nếu có lỗi DB
    if (uploadedFilePath) fs.unlinkSync(uploadedFilePath);
    res.status(500).json({ success: false, message: "Lỗi tạo phiếu", error: err.message });
  }
};

// === SỬA 3: Vô hiệu hóa hàm UPDATE ===
// Vì logic mới đã gộp kết quả vào hàm create
exports.update = async (req, res) => {
  return res.status(403).json({ 
    message: "Hành vi bị cấm!",
    error: "Logic đã thay đổi, kết quả được gửi chung khi tạo phiếu."
  });
};

// === (Hàm remove, getByMaHSBA, createFromPatient, getByMonth, updateTrangThai giữ nguyên) ===

exports.remove = async (req, res) => {
  return res.status(403).json({ 
    message: "Hành vi bị cấm!",
    error: "Không thể XÓA (DELETE) một phiếu xét nghiệm đã có trên Blockchain."
  });
};

exports.getByMaHSBA = async (req, res) => {
  try {
    const maHSBA = req.params.maHSBA;

    // ✅ SỬA: Đọc từ Chuỗi khối
    const blocks = await db.HoSoAnChuoiKham.findAll({
      where: { 
        maHSBA,
        [Op.or]: [
            { block_type: 'PHIEU_XET_NGHIEM' },
            { block_type: 'KET_QUA_XET_NGHIEM' },
            { block_type: 'XET_NGHIEM_HOAN_CHINH' } // Thêm loại block mới
        ]
      },
      order: [["timestamp", "DESC"]],
      raw: true
    });
    
    const data = blocks.map(b => JSON.parse(b.data_json));
    res.json({ success: true, data: data });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "❌ Lỗi khi lấy danh sách phiếu theo mã hồ sơ",
      error: err.message
    });
  }
};

exports.createFromPatient = async (req, res) => {
  // (Giữ nguyên logic cũ)
  try {
    const {
      maXN, ngayThucHien, gioThucHien, ghiChu, maNS, maHSBA
    } = req.body;
    const hoSo = await db.HoSoBenhAn.findOne({ where: { maHSBA } });
    if (!hoSo) {
      return res.status(404).json({ message: "❌ Không tìm thấy hồ sơ bệnh án tương ứng" });
    }
    const maBN = hoSo.maBN;
    const today = new Date();
    const ngay = new Date(ngayThucHien);
    if (ngay < new Date(today.setHours(0, 0, 0, 0))) {
      return res.status(400).json({ message: "❌ Không được chọn ngày trong quá khứ" });
    }
    const max = new Date();
    max.setDate(max.getDate() + 30);
    if (ngay > max) {
      return res.status(400).json({ message: "❌ Chỉ được đặt lịch trong vòng 30 ngày tới" });
    }
    if (ngay.getDay() === 0) {
      return res.status(400).json({ message: "❌ Không thể đặt lịch vào Chủ nhật hoặc ngày nghỉ" });
    }
    const gio = parseInt(gioThucHien.split(":")[0]);
    if (gio < 7 || gio > 11) {
      return res.status(400).json({ message: "❌ Xét nghiệm chỉ thực hiện từ 7h đến 11h sáng" });
    }
    const daDat = await db.PhieuXetNghiem.count({
      where: { maHSBA, ngayThucHien }
    });
    if (daDat >= 1) {
      return res.status(400).json({ message: "❌ Bạn chỉ được đặt một lịch xét nghiệm mỗi ngày" });
    }
    const trungKham = await db.LichKham.findOne({
      where: { maBN, ngayKham: ngayThucHien, gioKham: gioThucHien }
    });
    if (trungKham) {
      return res.status(400).json({ message: "❌ Thời gian đã trùng với lịch khám" });
    }
    const maYeuCau = "YC" + uuidv4().slice(0, 6).toUpperCase();
    await db.YeuCauXetNghiem.create({
      maYeuCau, maBN, maXN, ngayYeuCau: new Date(), ghiChu: ghiChu || null
    });
    const maPhieuXN = uuidv4().slice(0, 8).toUpperCase();
    const phieuXNData = {
      maPhieuXN, maYeuCau, maXN, ngayThucHien, gioThucHien, ghiChu, maNS: maNS || null, maHSBA
    };
    
    // Ghi vào blockchain (vẫn dùng logic cũ, chỉ tạo phiếu chưa có kết quả)
    await blockchainService.addBlock(
        maHSBA,
        'PHIEU_XET_NGHIEM', // Loại khối (tạm thời vẫn dùng loại này)
        phieuXNData
    );
    await Phieu.create(phieuXNData);

    return res.status(201).json({
      success: true,
      message: "✅ Đặt lịch xét nghiệm thành công (block)",
      data: phieuXNData
    });

  } catch (err) {
    console.error("❌ Lỗi khi đặt lịch:", err);
    return res.status(500).json({
      success: false,
      message: "❌ Lỗi server",
      error: err.message
    });
  }
};

exports.getByMonth = async (req, res) => {
  const dot = req.params.dotKhamBenh;
  try {
    const result = await db.PhieuXetNghiem.findAll({
      attributes: {
        exclude: ['file'] // ✅ FIX: Loại bỏ trường 'file' nếu chưa có trong DB
      },
      where: {
        ngayThucHien: {
          [Op.startsWith]: dot 
        }
      }
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Lỗi truy xuất phiếu xét nghiệm", error: err.message });
  }
};

exports.updateTrangThai = async (req, res) => {
  const { maYeuCau, trangThai } = req.body;
  try {
    const yc = await db.YeuCauXetNghiem.findOne({ where: { maYeuCau } });
    if (!yc) return res.status(404).json({ success: false, message: "Không tìm thấy yêu cầu" });
    yc.trangThai = trangThai;
    await yc.save();
    return res.json({ success: true, message: "Đã cập nhật trạng thái phiếu" });
  } catch (err) {
    console.error("❌ Lỗi cập nhật trạng thái:", err);
    return res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};
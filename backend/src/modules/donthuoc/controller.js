// CONTROLLER: Ghi nhận đơn thuốc và chi tiết đơn thuốc
const { v4: uuidv4 } = require("uuid");
const blockchainService = require("../../services/blockchain.service"); // ✅ Import
const db = require("../../models");
const { Op } = require("sequelize"); // ✅ Thêm Op
const fs = require("fs");

// Lấy tất cả đơn thuốc (Sửa: Đọc từ blockchain)
exports.getAll = async (req, res) => {
  try {
    const blocks = await db.HoSoAnChuoiKham.findAll({
      where: { 
        [db.Sequelize.Op.or]: [
          { block_type: 'DON_THUOC' }, // (Block cũ nếu có)
          { block_type: 'DON_THUOC_HOAN_CHINH' } // ✅ Block gộp mới
        ]
      },
      order: [["timestamp", "DESC"]]
    });
    
    // Giải mã và parse dữ liệu
    const data = [];
    for (const block of blocks) {
      try {
        const decryptedJson = blockchainService.decryptData(block.data_json);
        const blockData = JSON.parse(decryptedJson);
        data.push(blockData);
      } catch (parseErr) {
        console.error(`❌ Lỗi giải mã/parse block ${block.id}:`, parseErr.message);
        // Bỏ qua block lỗi
      }
    }
    
    res.json({ success: true, message: "Lấy danh sách đơn thuốc (từ chuỗi khối)", data });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ success: false, message: "Lỗi lấy danh sách", error: err.message });
  }
};

// ✅ === SỬA HÀM NÀY ===
// Gộp logic tạo đơn và chi tiết vào làm một
exports.create = async (req, res) => {
  let uploadedFilePath = null;
  try {
    const { maPK, chiTietList } = req.body;
    
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

    // 2. Validate
    if (!maPK || !chiTietList || chiTietList.length === 0) { // Kiểm tra chiTietList là chuỗi non-empty
      if (uploadedFilePath) fs.unlinkSync(uploadedFilePath);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ. Cần maPK và danh sách thuốc (chiTietList)." });
    }

    // 3. Tìm maHSBA từ maPK 
    // ... (logic tìm maHSBA giữ nguyên)

    let maHSBA = null;
    const phieuKhamBlocks = await db.HoSoAnChuoiKham.findAll({ where: { block_type: 'PHIEU_KHAM' } });
    for (const block of phieuKhamBlocks) {
      try {
        const decryptedJson = blockchainService.decryptData(block.data_json);
        const blockData = JSON.parse(decryptedJson);
        if (blockData.maPK === maPK) {
          maHSBA = block.maHSBA;
          break;
        }
      } catch (parseErr) {
        console.error(`❌ Lỗi giải mã/parse block ${block.id}:`, parseErr.message);
      }
    }

    if (!maHSBA) {
      if (uploadedFilePath) fs.unlinkSync(uploadedFilePath);
      return res.status(404).json({ success: false, message: "Không tìm thấy Phiếu khám (Block) tương ứng" });
    }
    
    // 4. GOM TẤT CẢ DỮ LIỆU LẠI (CHỈ LƯU PATH URL)
    const donThuocHoanChinhData = {
      maDT: uuidv4().slice(0, 8).toUpperCase(),
      maPK: maPK,
      maBS: maTK_NguoiTao, 
      ngayKeDon: new Date(),
      // Multer gửi chiTietList dưới dạng chuỗi JSON, phải parse lại
      chiTietList: JSON.parse(chiTietList), 
      file: filePathUrl, // <-- LƯU PATH URL
    };
    
    // 5. Thêm vào chuỗi khối
    const newBlock = await blockchainService.addBlock(maHSBA, 'DON_THUOC_HOAN_CHINH', donThuocHoanChinhData, maTK_NguoiTao);

    res.status(201).json({ success: true, message: "Tạo đơn thuốc hoàn chỉnh (1 block) thành công", data: donThuocHoanChinhData });
  } catch (err) {
    console.error("❌ Lỗi tạo đơn thuốc:", err);
    if (uploadedFilePath) fs.unlinkSync(uploadedFilePath);
    res.status(500).json({ success: false, message: "Lỗi tạo đơn thuốc", error: err.message });
  }
};

// ✅ Thêm chi tiết đơn thuốc (Sửa: Ghi vào Blockchain)
// HÀM NÀY KHÔNG CÒN DÙNG NỮA
exports.addChiTiet = async (req, res) => {
  return res.status(400).json({ message: "Lỗi: Logic đã thay đổi. Sử dụng API POST /donthuoc để gửi đơn hoàn chỉnh." });
};

// ✅ Lấy chi tiết đơn thuốc (Sửa: Đọc từ Blockchain)
// HÀM NÀY KHÔNG CÒN Ý NGHĨA
exports.getChiTiet = async (req, res) => {
  return res.status(404).json({ message: "Logic đã thay đổi, chi tiết nằm trong khối DON_THUOC_HOAN_CHINH" });
};

exports.getByMonth = async (req, res) => {
  // (Hàm này hiện không dùng cho blockchain, giữ nguyên)
  const dot = req.params.dotKhamBenh;
  try {
    const result = await db.DonThuoc.findAll({
      where: {
        ngayKeDon: {
          [Op.startsWith]: dot
        }
      }
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Lỗi truy xuất đơn thuốc", error: err.message });
  }
};
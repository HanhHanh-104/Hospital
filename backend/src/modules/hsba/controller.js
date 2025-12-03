const db = require("../../models");
const { v4: uuidv4 } = require("uuid");
const HoSo = db.HoSoBenhAn;
const BenhNhan = db.BenhNhan;
const blockchainService = require("../../services/blockchain.service");
const { createHash, decryptBlocks } = blockchainService;
const crypto = require('crypto');


exports.getAll = async (req, res) => {
  try {
    const data = await HoSo.findAll({
      include: [BenhNhan],
      order: [["ngayLap", "DESC"]],
    });
    res.json({ success: true, data });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ success: false, message: "Lỗi truy xuất hồ sơ", error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { maBN, dotKhamBenh, lichSuBenh, ghiChu } = req.body;
    // Lấy maTK người tạo từ token (có thể là admin hoặc nhân viên)
    const maTK_NguoiTao = req.user?.maTK;
    if (!maTK_NguoiTao) {
      return res.status(401).json({ success: false, message: "Lỗi xác thực: không tìm thấy maTK người dùng." });
    }
    
    const maHSBA = uuidv4().slice(0, 8).toUpperCase();
    
    const created = await HoSo.create({
      maHSBA,
      maBN,
      dotKhamBenh,
      lichSuBenh,
      ghiChu
    });

    const genesisData = {
      maBN: maBN,
      ngayLap: created.ngayLap,
      lichSuBenh: lichSuBenh,
      ghiChu: ghiChu
    };
    // Sửa: Truyền đầy đủ tham số bao gồm maTK_NguoiTao
    await blockchainService.addBlock(maHSBA, 'TAO_MOI', genesisData, maTK_NguoiTao); 

    res.status(201).json({ success: true, message: "Tạo hồ sơ và khối khởi tạo thành công", data: created });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ success: false, message: "Lỗi tạo hồ sơ", error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.HoSoAnChuoiKham.destroy({ where: { maHSBA: req.params.id } });
    const deleted = await HoSo.destroy({ where: { maHSBA: req.params.id } });
    
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ" });
    }
    res.json({ success: true, message: "Đã xoá hồ sơ bệnh án (và chuỗi khối liên quan)" });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ success: false, message: "Lỗi xoá hồ sơ", error: err.message });
  }
};

exports.getByBenhNhan = async (req, res) => {
  try {
    const maBN = req.params.maBN || req.user?.maBN;
    if (!maBN) return res.status(400).json({ message: "Thiếu mã bệnh nhân" });

    const data = await HoSo.findAll({
      where: { maBN },
      include: [BenhNhan],
      order: [["ngayLap", "DESC"]],
    });

    res.json({ message: "Lấy hồ sơ bệnh án theo bệnh nhân", data });
  } catch (err) {
    console.error("❌ Lỗi Sequelize:", err);
    res.status(500).json({ success: false, message: "Lỗi truy xuất hồ sơ", error: err.message });
  }
};


exports.createByBenhNhan = async (req, res) => {
  try {
    const { maBN } = req.body;
    if (!maBN) return res.status(400).json({ success: false, message: "Thiếu mã bệnh nhân" });

    // Lấy maTK người tạo từ token (có thể là bệnh nhân tự tạo hoặc nhân viên)
    const maTK_NguoiTao = req.user?.maTK || maBN; // Nếu không có user, dùng maBN làm người tạo
    if (!maTK_NguoiTao) {
      return res.status(401).json({ success: false, message: "Lỗi xác thực: không tìm thấy maTK người dùng." });
    }

    const today = new Date().toISOString().slice(0, 10); 
    const dot = new Date().toISOString().slice(0, 7);

    const existed = await db.HoSoBenhAn.findOne({ where: { maBN } });
    if (existed) {
      return res.status(200).json({ success: true, message: "Đã có hồ sơ", data: existed });
    }

    const hoso = await db.HoSoBenhAn.create({
      maHSBA: maBN, 
      maBN,
      ngayLap: today,
      dotKhamBenh: dot,
      lichSuBenh: null,
      ghiChu: null
    });
    
    const genesisData = { maBN: maBN, ngayLap: today };
    // Sửa: Truyền đầy đủ tham số bao gồm maTK_NguoiTao
    await blockchainService.addBlock(hoso.maHSBA, 'TAO_MOI', genesisData, maTK_NguoiTao); 

    return res.status(201).json({ success: true, message: "✅ Tạo hồ sơ bệnh án thành công", data: hoso });
  } catch (err) {
    console.error("❌ Lỗi tạo HSBA:", err);
    return res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};


exports.getByMaBN = async (req, res) => {
  try {
    const { maHSBA } = req.params;
    if (!maHSBA) return res.status(400).json({ success: false, message: "Thiếu mã bệnh nhân" });

    const data = await db.HoSoBenhAn.findOne({
      where: { maHSBA: maHSBA }
    } );

    if (!data) {
      return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ bệnh án" });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("❌ Lỗi lấy hồ sơ:", err);
    return res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};


exports.getChiTietHSBA = async (req, res) => {
  try {
    const { maHSBA } = req.params;
    const maTK = req.user.maTK; 

    const hoSo = await db.HoSoBenhAn.findOne({
      where: { maHSBA },
      include: [{ model: db.BenhNhan, attributes: ['maTK'] }]
    });

    if (!hoSo) {
      return res.status(404).json({ message: "Không tìm thấy hồ sơ." });
    }
    if (hoSo.BenhNhan.maTK !== maTK) {
      return res.status(403).json({ message: "Không có quyền truy cập hồ sơ này." });
    }

    const chain = await db.HoSoAnChuoiKham.findAll({
      where: { maHSBA },
      order: [['timestamp', 'DESC']], 
      raw: true,
    });
    const decryptedChain = decryptBlocks(chain);
    res.json({
      success: true,
      data: {
        hoSo: hoSo, 
        chain: decryptedChain, 
      }
    });

  } catch (err) {
    console.error("❌ Lỗi getChiTietHSBA:", err);
    res.status(500).json({ success: false, message: "Lỗi máy chủ", error: err.message });
  }
};

exports.verifyChain = async (req, res) => {
  try {
    const { maHSBA } = req.params;
    const chain = await db.HoSoAnChuoiKham.findAll({
      where: { maHSBA },
      order: [['timestamp', 'ASC']], // QUAN TRỌNG: Lấy từ cũ đến mới
      raw: true,
    });

    if (chain.length === 0) {
      return res.json({ success: true, valid: true, message: "Hồ sơ rỗng, không có gì để xác thực." });
    }

    let previousHash = "0";
    let tamperedBlocks = [];
    const publicKeyCache = new Map(); // Cache để giảm query CSDL

    for (const block of chain) {
      // 1. KIỂM TRA TÍNH NỐI TIẾP CỦA CHUỖI
      if (block.previous_hash !== previousHash) {
        tamperedBlocks.push({ id: block.id, type: block.block_type, error: "Chuỗi băm bị gãy (Broken Hash Chain)" });
        break; // Gãy chuỗi, không cần kiểm tra tiếp
      }
      // 2. GIẢI MÃ (Nếu dữ liệu đã được mã hóa) VÀ KIỂM TRA HASH
      let data_json_string_original = block.data_json;
      // Nếu data_json bị mã hóa, ta cần giải mã nó trước khi tính Hash (để kiểm tra hash)
      if (block.data_json && block.data_json.startsWith('U2FsdGVk')) {
        const decrypted = require("../../services/blockchain.service").decryptData(block.data_json);
        data_json_string_original = decrypted;
      }
      // 3. KIỂM TRA TÍNH TOÀN VẸN CỦA DỮ LIỆU KHỐI
      // (Hash của khối này có đúng với nội dung của nó không?)
      // Xử lý block cũ không có signature/maNguoiTao
      const signatureForHash = block.signature || "";
      const maNguoiTaoForHash = block.maNguoiTao || "";
      
      const calculatedHash = createHash(
        new Date(block.timestamp).toISOString(),
        data_json_string_original,
        block.previous_hash,
        signatureForHash,
        maNguoiTaoForHash
      );
      
      if (calculatedHash !== block.current_hash) {
         tamperedBlocks.push({ id: block.id, type: block.block_type, error: "Dữ liệu hoặc chữ ký đã bị thay đổi (Hash mismatch)" });
         break; // Dữ liệu đã bị sửa, không cần kiểm tra tiếp
      }
      
      // 3. KIỂM TRA TÍNH CHỐNG CHỐI BỎ (Chữ ký)
      // Chỉ kiểm tra chữ ký nếu block có đầy đủ thông tin (block mới)
      if (block.signature && block.maNguoiTao) {
        let publicKey = publicKeyCache.get(block.maNguoiTao);
        if (!publicKey) {
          const user = await db.TaiKhoan.findByPk(block.maNguoiTao, { attributes: ['publicKey'] });
          if (user && user.publicKey) {
            publicKey = user.publicKey;
            publicKeyCache.set(block.maNguoiTao, publicKey);
          } else {
            tamperedBlocks.push({ id: block.id, type: block.block_type, error: `Không tìm thấy public key cho người tạo ${block.maNguoiTao}` });
            break; // Không có key, không thể xác thực
          }
        }

        const verify = crypto.createVerify('RSA-SHA256');
        verify.update(data_json_string_original); // Kiểm tra chữ ký trên dữ liệu gốc
        verify.end();
        
        if (!verify.verify(publicKey, block.signature, 'hex')) {
          tamperedBlocks.push({ id: block.id, type: block.block_type, error: `Chữ ký không hợp lệ (Signature mismatch). Dữ liệu hoặc người tạo đã bị giả mạo.` });
          break; // Chữ ký sai!
        }
      } else {
        // Block cũ không có chữ ký - chỉ cảnh báo nhưng không làm fail (để tương thích với dữ liệu cũ)
        console.warn(`⚠️ Block ${block.id} (${block.block_type}) không có chữ ký - có thể là block cũ trước khi thêm tính năng ký.`);
      }

      // Nếu tất cả đều ổn, cập nhật hash để check block tiếp theo
      previousHash = block.current_hash;
    }

    // Trả về kết quả
    if (tamperedBlocks.length > 0) {
      return res.status(400).json({ 
        success: false, 
        valid: false, 
        message: "PHÁT HIỆN GIẢ MẠO! Chuỗi hồ sơ không hợp lệ.", 
        errors: tamperedBlocks 
      });
    }

    return res.json({ 
      success: true, 
      valid: true, 
      message: "Toàn vẹn hồ sơ và chữ ký của người tạo đã được xác thực." 
    });

  } catch (e) {
    console.error("Lỗi khi xác thực chuỗi:", e);
    res.status(500).json({ success: false, message: "Lỗi máy chủ khi xác thực: " + e.message });
  }
};
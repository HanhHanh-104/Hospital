const { TaiKhoan, BenhNhan, BacSi, NhomQuyen, HoSoBenhAn } = require("../../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const crypto = require('crypto');
const nodemailer = require("nodemailer");
const otpService = require("../../OTP/otp.service");
const blockchainService = require("../../services/blockchain.service");



const maXacThucMap = {}; 

// === HÀM TẠO TÀI KHOẢN ===
/*
 [POST] /auth/register
*/
exports.register = async (req, res) => {


  const { tenDangNhap, matKhau, email, maNhom, otpCode } = req.body;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
  if (!passwordRegex.test(matKhau)) {
    console.log("⛔ Chặn đăng ký vì mật khẩu yếu:", matKhau);
    return res.status(400).json({ 
      success: false,
      message: "Mật khẩu KHÔNG ĐẠT YÊU CẦU: Phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số." 
    });
  }

  try {
    const isOtpValid = await otpService.verifyOtp(email, otpCode, 'REGISTER_PATIENT');
    if (!isOtpValid) {
      return res.status(400).json({ message: "Mã OTP không hợp lệ hoặc đã hết hạn" });
    }

    const existingUser = await TaiKhoan.findOne({ where: { tenDangNhap } });
    if (existingUser)
      return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });

    const hashedPassword = await bcrypt.hash(matKhau, 10);
    const maTK = uuidv4().slice(0, 8).toUpperCase();

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    const newUser = await TaiKhoan.create({
      maTK, tenDangNhap, matKhau: hashedPassword, email, maNhom, trangThai: true, publicKey, privateKey
    });

    if (maNhom === "BENHNHAN") {
      await BenhNhan.create({
        maBN: maTK, maTK, hoTen: tenDangNhap, email,
      });

      const hoso = await HoSoBenhAn.create({
        maHSBA: maTK, maBN: maTK, ngayLap: new Date(), dotKhamBenh: new Date(), lichSuBenh: null, ghiChu: null
      });
      
      const genesisData = { maBN: maTK, ngayLap: hoso.ngayLap, hoTen: tenDangNhap };
      // Giả định blockchainService.addBlock đã được import
      if (typeof blockchainService !== 'undefined' && blockchainService.addBlock) {
          await blockchainService.addBlock(hoso.maHSBA, 'TAO_MOI', genesisData, maTK);
      }
    }

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công! Vui lòng đăng nhập.",
      user: { maTK: newUser.maTK, tenDangNhap: newUser.tenDangNhap, email: newUser.email, maNhom: newUser.maNhom },
    });
  } catch (error) {
    console.error("❌ Lỗi khi đăng ký:", error);
    res.status(500).json({ message: "Lỗi khi đăng ký", error: error.message });
  }
};

// === HÀM LẤY OTP ĐĂNG KÝ ===
/*
 Gửi OTP đăng ký
*/
exports.requestRegisterOtp = async (req, res) => {
  
  const { email, tenDangNhap } = req.body;

  try {
    const emailExists = await TaiKhoan.findOne({ where: { email } });
    if (emailExists) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }
    const userExists = await TaiKhoan.findOne({ where: { tenDangNhap } });
    if (userExists) {
      return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
    }

    // Giả định otpService.createAndSendOtp đã được import
    if (typeof otpService !== 'undefined' && otpService.createAndSendOtp) {
        await otpService.createAndSendOtp(email, 'REGISTER_PATIENT');
    }
    
    res.status(200).json({ success: true, message: "Mã OTP đã được gửi đến email của bạn." });

  } catch (error) {
    console.error("❌ Lỗi khi gửi OTP:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi gửi OTP", error: error.message });
  }
};

// === HÀM ĐĂNG NHẬP (ĐÃ CHUYỂN SANG EXPORTS) ===
exports.login = async (req, res) => {

  const { tenDangNhap, matKhau } = req.body;

  try {
    const user = await TaiKhoan.findOne({ where: { tenDangNhap } });
    if (!user) return res.status(404).json({ message: "Tài khoản không tồn tại" });
    if (!user.trangThai) return res.status(403).json({ message: "Tài khoản đang bị khóa" });

    const match = await bcrypt.compare(matKhau, user.matKhau);
    if (!match) return res.status(401).json({ message: "Mật khẩu không đúng" });

    // ... (logic tạo token, lấy thông tin user)
    const token = jwt.sign(
        { maTK: user.maTK, tenDangNhap: user.tenDangNhap, maNhom: user.maNhom },
        process.env.JWT_SECRET || "secret123",
        { expiresIn: "1d" }
    );
    const nhomQuyen = await NhomQuyen.findOne({ where: { maNhom: user.maNhom } });
    let maBN = null, maBS = null, loaiNS = null;
    if (user.maNhom === "BENHNHAN") {
      const benhNhan = await BenhNhan.findOne({ where: { maTK: user.maTK } });
      maBN = benhNhan?.maBN || null;
    } else if (user.maNhom === "BACSI") {
      const bacSi = await BacSi.findOne({ where: { maTK: user.maTK } });
      maBS = bacSi?.maBS || null;
    } else if (user.maNhom === "NHANSU") {
      const { NhanSuYTe } = require("../../models");
      const ns = await NhanSuYTe.findOne({ where: { maTK: user.maTK } });
      loaiNS = ns?.loaiNS || null;
    }
    // ... (kết thúc logic)

    res.status(200).json({
      token, message: "Đăng nhập thành công",
      user: { maTK: user.maTK, tenDangNhap: user.tenDangNhap, email: user.email, maNhom: user.maNhom, tenNhom: nhomQuyen?.tenNhom || "Không xác định", loaiNS, maBN, maBS },
    });
  } catch (error) {
    console.error("❌ Lỗi khi đăng nhập:", error);
    res.status(500).json({ message: "Lỗi khi đăng nhập", error: error.message });
  }
};

// === HÀM ĐĂNG NHẬP GOOGLE (ĐÃ CHUYỂN SANG EXPORTS) ===
exports.googleLogin = async (req, res) => {
  try {
    const { tenDangNhap, email, maNhom } = req.body;

    if (!email) return res.status(400).json({ success: false, message: "Thiếu email Google" });

    let user = await TaiKhoan.findOne({ where: { email } });

    // --- TẠO MỚI TÀI KHOẢN (Nếu chưa tồn tại) ---
    if (!user) {
      const maTK = uuidv4().slice(0, 8).toUpperCase();
      const fakePass = uuidv4();
      const hashed = await bcrypt.hash(fakePass, 10);

      // TẠO KEY PAIR CHO BLOCKCHAIN
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048, publicKeyEncoding: { type: 'spki', format: 'pem' }, privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
      });

      user = await TaiKhoan.create({
        maTK, tenDangNhap: tenDangNhap || email.split("@")[0], email, matKhau: hashed, maNhom: maNhom || "BENHNHAN", trangThai: true, publicKey, privateKey
      });

      if (user.maNhom === "BENHNHAN") {
        await BenhNhan.create({
          maBN: user.maTK, maTK: user.maTK, hoTen: user.tenDangNhap, email: user.email,
        });
        
        const hoso = await HoSoBenhAn.create({
          maHSBA: user.maTK, maBN: user.maTK, ngayLap: new Date(), dotKhamBenh: new Date(), lichSuBenh: null, ghiChu: null
        });
        
        // TẠO KHỐI KHỞI TẠO (GENESIS BLOCK)
        const genesisData = { maBN: user.maTK, ngayLap: hoso.ngayLap, hoTen: user.tenDangNhap };
        if (typeof blockchainService !== 'undefined' && blockchainService.addBlock) {
             await blockchainService.addBlock(hoso.maHSBA, 'TAO_MOI', genesisData, user.maTK);
        }
      }
    }

    const token = jwt.sign(
      { maTK: user.maTK, email: user.email, maNhom: user.maNhom },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Đăng nhập Google thành công",
      token,
      user: {
        maTK: user.maTK,
        tenDangNhap: user.tenDangNhap,
        email: user.email,
        maNhom: user.maNhom,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi khi đăng nhập Google:", error);
    res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
  }
};

// === HÀM LẤY USER HIỆN TẠI (ĐÃ CHUYỂN SANG EXPORTS) ===
exports.getCurrentUser = async (req, res) => {
  try {
    const { maTK } = req.user;
    const user = await TaiKhoan.findByPk(maTK);
    if (!user) return res.status(404).json(null);

    return res.json({
      maTK: user.maTK,
      tenDangNhap: user.tenDangNhap,
      email: user.email,
      maNhom: user.maNhom,
    });
  } catch (err) {
    console.error("❌ Lỗi khi lấy thông tin user:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// === HÀM TẠO MÃ XÁC THỰC (ĐÃ CHUYỂN SANG EXPORTS) ===
exports.taoMaXacThuc = (req, res) => {
  const { maTaiKhoan } = req.params;
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  maXacThucMap[maTaiKhoan] = code; 
  res.json({ success: true, message: "Mã xác thực của bạn là: " + code });
};

// === HÀM ĐỔI MẬT KHẨU (ĐÃ CHUYỂN SANG EXPORTS) ===
exports.doiMatKhau = async (req, res) => {
  const { maTK, matKhauCu, matKhauMoi } = req.body;
  try {
    const taiKhoan = await TaiKhoan.findByPk(maTK);
    if (!taiKhoan)
      return res.status(404).json({ success: false, message: "Không tìm thấy tài khoản" });

    const match = await bcrypt.compare(matKhauCu, taiKhoan.matKhau);
    if (!match)
      return res.status(400).json({ success: false, message: "Mật khẩu cũ không đúng" });

    if (matKhauMoi === matKhauCu)
      return res.status(400).json({ success: false, message: "Mật khẩu mới không được trùng mật khẩu cũ" });

    const hashedNew = await bcrypt.hash(matKhauMoi, 10);
    taiKhoan.matKhau = hashedNew;
    await taiKhoan.save();

    return res.json({ success: true, message: "✅ Đổi mật khẩu thành công" });
  } catch (err) {
    console.error("❌ Lỗi đổi mật khẩu:", err);
    return res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};

// === HÀM QUÊN MẬT KHẨU (DEMO CŨ) (ĐÃ CHUYỂN SANG EXPORTS) ===
exports.quenMatKhau = async (req, res) => {
  const { maTK, maBenhNhan, email } = req.body;
  try {
    const benhNhan = await BenhNhan.findByPk(maBenhNhan);
    const taiKhoan = await TaiKhoan.findByPk(maTK);

    if (!taiKhoan)
      return res.status(400).json({ success: false, message: "Tài khoản không tồn tại" });

    if (!benhNhan || benhNhan.email !== email)
      return res.status(400).json({ success: false, message: "Email không khớp" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    // maXacThucMap[maTK] = code; // Dùng map cũ

    console.log(`✅ Mã xác thực gửi tới email ${email}: ${code}`);
    return res.json({ success: true, message: "Mã xác thực đã gửi (demo)", maXacThuc: code });
  } catch (err) {
    console.error("❌ Lỗi quên mật khẩu:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};


// === HÀM QUÊN MẬT KHẨU MỚI ===
/*
[POST] /auth/forgot-password - Yêu cầu gửi OTP
*/
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Vui lòng nhập email" });
    }

    const user = await TaiKhoan.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại trong hệ thống" });
    }

    if (typeof otpService !== 'undefined' && otpService.createAndSendOtp) {
        const otpEntry = await otpService.createAndSendOtp(email, 'RESET_PASSWORD');
        console.log(`🔑 [DEBUG] OTP Quên mật khẩu cho ${email}: ${otpEntry.otpCode}`);
    } else {
        console.error("❌ otpService.createAndSendOtp không khả dụng.");
        return res.status(500).json({ message: "Dịch vụ OTP không khả dụng" });
    }
    

    return res.json({ 
      success: true, 
      message: "Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra (cả mục Spam)." 
    });

  } catch (err) {
    console.error("Lỗi quên mật khẩu:", err);
    const friendlyError = err.message.includes('Authentication') 
      ? "Lỗi cấu hình mail server. Vui lòng liên hệ quản trị viên." 
      : err.message;
    return res.status(500).json({ message: friendlyError });
  }
};

/*
Xác thực OTP và Đặt lại mật khẩu
 */
exports.resetPassword = async (req, res) => {
  try {
    const { email, otpCode, newPassword } = req.body;

    if (!email || !otpCode || !newPassword) {
      return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
    }
    
    // Giả định otpService.verifyOtp đã được import
    let isValid = false;
    if (typeof otpService !== 'undefined' && otpService.verifyOtp) {
        isValid = await otpService.verifyOtp(email, otpCode, 'RESET_PASSWORD');
    } else {
        console.error("❌ otpService.verifyOtp không khả dụng.");
        return res.status(500).json({ message: "Dịch vụ OTP không khả dụng" });
    }
    
    if (!isValid) {
      return res.status(400).json({ message: "Mã OTP không hợp lệ hoặc đã hết hạn" });
    }

    const user = await TaiKhoan.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.matKhau = hashedPassword;
    await user.save();

    return res.json({ success: true, message: "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay." });

  } catch (err) {
    console.error("Lỗi đặt lại mật khẩu:", err);
    return res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
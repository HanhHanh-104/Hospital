const { HoaDon, ThanhToan, LichKham } = require("../../models");
const PaymentService = require("../../services/payment.service");
const config = require("../../config/payment.config");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

// ==========================================
// 1. TẠO LINK THANH TOÁN (FIX LỖI TRÙNG MÃ)
// ==========================================
exports.createPaymentUrl = async (req, res) => {
  try {
    const { maHD, phuongThuc, bankCode } = req.body;

    // Kiểm tra hóa đơn
    const hoaDon = await HoaDon.findByPk(maHD);
    if (!hoaDon) {
      return res.status(404).json({ success: false, message: "Hóa đơn không tồn tại" });
    }

    if (hoaDon.trangThai === "DA_THANH_TOAN") {
      return res.status(400).json({ success: false, message: "Hóa đơn đã được thanh toán trước đó" });
    }

    const amount = parseInt(hoaDon.tongTien);
    
    // ✅ FIX QUAN TRỌNG: Tạo mã giao dịch duy nhất để tránh lỗi "Giao dịch tồn tại" của MoMo/VNPAY
    // Format: MAHOADON_TIMESTAMP (Ví dụ: HD001_171548293321)
    const uniqueOrderId = `${maHD}_${new Date().getTime()}`; 
    const orderInfo = `Thanh toan hoa don ${maHD}`;

    // --- VNPAY ---
    if (phuongThuc === "VNPAY") {
      const paymentUrl = PaymentService.createVnPayUrl(req, {
        amount,
        orderId: uniqueOrderId, // Gửi mã duy nhất sang VNPAY
        orderInfo,
        bankCode,
      });
      return res.json({ success: true, paymentUrl });
    } 
    
    // --- MOMO ---
    else if (phuongThuc === "MOMO") {
      // ✅ FIX: Tạo orderId ngắn hơn cho MoMo (max 50 ký tự)
      // Format: MAHD_TIMESTAMP (rút gọn timestamp)
      const shortTimestamp = Date.now().toString().slice(-10); // Lấy 10 số cuối
      const momoOrderId = `${maHD}_${shortTimestamp}`;
      
      // ✅ FIX: Đảm bảo amount là số nguyên (MoMo yêu cầu)
      const momoAmount = parseInt(amount);
      
      const requestId = uuidv4();
      const requestBody = PaymentService.createMoMoRequest({
        requestId,
        orderId: momoOrderId, // Sử dụng orderId ngắn hơn
        amount: momoAmount, // MoMo nhận số tiền trực tiếp (không nhân 100)
        orderInfo
      });

      // Gọi API MoMo để lấy link thanh toán
      try {
        const momoRes = await axios.post(config.momo.endpoint, requestBody);
        
        if (momoRes.data && momoRes.data.resultCode === 0) {
          return res.json({ success: true, paymentUrl: momoRes.data.payUrl });
        } else {
          // Log lỗi chi tiết từ MoMo để debug
          console.error("MoMo Error Detail:", momoRes.data);
          return res.status(400).json({ 
            success: false, 
            message: "Lỗi từ MoMo: " + (momoRes.data.message || "Unknown error"), 
            detail: momoRes.data 
          });
        }
      } catch (momoErr) {
        console.error("MoMo Connection Error:", momoErr.message);
        return res.status(500).json({ success: false, message: "Không thể kết nối đến cổng thanh toán MoMo" });
      }
    }

    else {
      return res.status(400).json({ success: false, message: "Phương thức thanh toán không hợp lệ" });
    }

  } catch (error) {
    console.error("Payment Create Error:", error);
    res.status(500).json({ success: false, message: "Lỗi hệ thống khi tạo thanh toán" });
  }
};

// ==========================================
// 2. XỬ LÝ RETURN URL VNPAY (Redirect user sau thanh toán)
// ==========================================
exports.vnpayReturn = async (req, res) => {
  try {
    const vnp_Params = req.query;
    const { isSuccess, responseCode, orderId, amount, transactionNo } = PaymentService.verifyVnPaySignature(vnp_Params);

    // ✅ Tách lấy mã hóa đơn gốc từ uniqueOrderId (HD001_timestamp -> HD001)
    const realMaHD = orderId ? orderId.split('_')[0] : null;

    // Redirect về frontend với kết quả
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    let redirectUrl = `${frontendUrl}/payment-result?`;

    if (isSuccess && responseCode === "00" && realMaHD) {
      // Thanh toán thành công
      redirectUrl += `status=success&maHD=${realMaHD}&transactionNo=${transactionNo || ''}`;
    } else {
      // Thanh toán thất bại
      redirectUrl += `status=failed&maHD=${realMaHD || ''}&message=${encodeURIComponent('Thanh toán thất bại')}`;
    }

    return res.redirect(redirectUrl);
  } catch (error) {
    console.error("VNPAY Return Error:", error);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${frontendUrl}/payment-result?status=error&message=${encodeURIComponent('Lỗi xử lý thanh toán')}`);
  }
};

// ==========================================
// 3. XỬ LÝ IPN VNPAY (CẬP NHẬT LOGIC TÁCH MÃ)
// ==========================================
exports.vnpayIpn = async (req, res) => {
  try {
    const vnp_Params = req.query;
    const { isSuccess, responseCode, orderId, amount, transactionNo } = PaymentService.verifyVnPaySignature(vnp_Params);

    if (!isSuccess) {
      return res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
    }

    // ✅ Tách lấy mã hóa đơn gốc từ uniqueOrderId (HD001_timestamp -> HD001)
    const realMaHD = orderId.split('_')[0];

    const hoaDon = await HoaDon.findByPk(realMaHD);
    if (!hoaDon) {
      return res.status(200).json({ RspCode: "01", Message: "Order not found" });
    }

    if (hoaDon.trangThai === "DA_THANH_TOAN") {
      return res.status(200).json({ RspCode: "02", Message: "Order already confirmed" });
    }

    if (responseCode === "00") {
      // Cập nhật Hóa Đơn
      hoaDon.trangThai = "DA_THANH_TOAN";
      await hoaDon.save();

      // ✅ Cập nhật trạng thái lịch khám nếu có
      await LichKham.update(
        { trangThai: "DA_THANH_TOAN" },
        { where: { maHD: realMaHD } }
      );

      // Lưu lịch sử giao dịch
      await ThanhToan.create({
        maTT: `VNP-${transactionNo}`,
        maHD: realMaHD, // Lưu mã hóa đơn gốc
        soTien: amount,
        phuongThuc: "VNPAY",
        trangThai: "THANH_CONG",
        ngayThanhToan: new Date()
      });

      console.log(`✅ VNPAY Success: Hóa đơn ${realMaHD} thanh toán thành công`);
      return res.status(200).json({ RspCode: "00", Message: "Confirm Success" });
    } else {
      console.log(`❌ VNPAY Failed: Hóa đơn ${realMaHD} lỗi ${responseCode}`);
      return res.status(200).json({ RspCode: "00", Message: "Confirm Success" });
    }

  } catch (error) {
    console.error("VNPAY IPN Error:", error);
    return res.status(200).json({ RspCode: "99", Message: "Unknown Error" });
  }
};

// ==========================================
// 4. XỬ LÝ IPN MOMO (CẬP NHẬT LOGIC TÁCH MÃ)
// ==========================================
exports.momoIpn = async (req, res) => {
  try {
    const { isSuccess, resultCode, orderId, amount, transId } = PaymentService.verifyMoMoSignature(req.body);

    if (!isSuccess) {
      return res.status(400).json({ message: "Signature Mismatch" });
    }

    // ✅ Tách lấy mã hóa đơn gốc từ uniqueOrderId (HD001_timestamp -> HD001)
    const realMaHD = orderId ? orderId.split('_')[0] : null;

    const hoaDon = await HoaDon.findByPk(realMaHD);
    if (!hoaDon) return res.status(404).json({ message: "Order not found" });

    // Chỉ cập nhật nếu giao dịch thành công (resultCode = 0)
    if (resultCode === 0) {
      if (hoaDon.trangThai !== "DA_THANH_TOAN") {
        hoaDon.trangThai = "DA_THANH_TOAN";
        await hoaDon.save();

        // ✅ Cập nhật trạng thái lịch khám nếu có
        await LichKham.update(
          { trangThai: "DA_THANH_TOAN" },
          { where: { maHD: realMaHD } }
        );

        await ThanhToan.create({
          maTT: `MOMO-${transId}`,
          maHD: realMaHD, // Lưu mã hóa đơn gốc
          soTien: amount,
          phuongThuc: "MOMO",
          trangThai: "THANH_CONG",
          ngayThanhToan: new Date()
        });
        console.log(`✅ MoMo Success: Hóa đơn ${realMaHD} thanh toán thành công`);
      }
    } else {
        console.log(`❌ MoMo Failed: Hóa đơn ${realMaHD} thất bại (Code: ${resultCode})`);
    }

    return res.status(204).send();

  } catch (error) {
    console.error("MoMo IPN Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
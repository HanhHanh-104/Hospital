const crypto = require("crypto");
const qs = require("qs");
const moment = require("moment");
const config = require("../config/payment.config");

/**
 * Sắp xếp object theo key (Bắt buộc với VNPAY để tạo chữ ký đúng)
 */
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(key);
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = obj[str[key]];
  }
  return sorted;
}

const PaymentService = {
  /**
   * Tạo URL thanh toán VNPAY
   * @param {Object} req - Express request object
   * @param {Object} params - { amount, orderId, orderInfo, bankCode }
   */
  createVnPayUrl: (req, { amount, orderId, orderInfo, bankCode }) => {
    process.env.TZ = "Asia/Ho_Chi_Minh";
    const date = new Date();
    const createDate = moment(date).format("YYYYMMDDHHmmss");

    // Lấy IP của người dùng
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = config.vnpay.tmnCode;
    vnp_Params["vnp_Locale"] = "vn";
    vnp_Params["vnp_CurrCode"] = "VND";
    vnp_Params["vnp_TxnRef"] = orderId; // Mã hóa đơn
    vnp_Params["vnp_OrderInfo"] = orderInfo;
    vnp_Params["vnp_OrderType"] = "billpayment";
    vnp_Params["vnp_Amount"] = amount * 100; // VNPAY tính đơn vị đồng
    vnp_Params["vnp_ReturnUrl"] = config.vnpay.returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;

    if (bankCode) {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    // Sắp xếp tham số
    vnp_Params = sortObject(vnp_Params);

    // Tạo chữ ký
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", config.vnpay.hashSecret);
    const signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");
    
    vnp_Params["vnp_SecureHash"] = signed;
    
    let vnpUrl = config.vnpay.url;
    vnpUrl += "?" + qs.stringify(vnp_Params, { encode: false });

    return vnpUrl;
  },

  /**
   * Kiểm tra chữ ký trả về từ VNPAY (IPN hoặc Return URL)
   */
  verifyVnPaySignature: (vnp_Params) => {
    let secureHash = vnp_Params["vnp_SecureHash"];
    
    // Xóa 2 tham số hash để tái tạo chuỗi ký
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", config.vnpay.hashSecret);
    const signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");

    return {
      isSuccess: secureHash === signed,
      responseCode: vnp_Params["vnp_ResponseCode"],
      orderId: vnp_Params["vnp_TxnRef"],
      amount: vnp_Params["vnp_Amount"] / 100, // Chia lại 100 để ra số tiền gốc
      transactionNo: vnp_Params["vnp_TransactionNo"]
    };
  },

  /**
   * Tạo body request cho MoMo (Signature SHA256)
   */
  createMoMoRequest: ({ requestId, orderId, amount, orderInfo }) => {
    const { partnerCode, accessKey, secretKey, ipnUrl, redirectUrl } = config.momo;
    const requestType = "captureWallet";
    const extraData = ""; // Pass empty string if not used

    // Chuỗi ký đặc thù của MoMo
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    return {
      partnerCode,
      partnerName: "Hospital Management",
      storeId: "MomoTestStore",
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang: "vi",
      requestType,
      autoCapture: true,
      extraData,
      signature,
    };
  },

  /**
   * Kiểm tra chữ ký IPN từ MoMo
   */
  verifyMoMoSignature: (body) => {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature,
    } = body;

    const { accessKey, secretKey } = config.momo;

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    const generatedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    return {
      isSuccess: signature === generatedSignature,
      resultCode: resultCode,
      orderId: orderId,
      amount: amount,
      transId: transId
    };
  }
};

module.exports = PaymentService;
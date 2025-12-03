const express = require("express");
const router = express.Router();
const controller = require("./controller");
const verifyToken = require("../../middleware/auth");

// API tạo URL thanh toán (Yêu cầu Login)
router.post("/create-url", verifyToken, controller.createPaymentUrl);
// API Return URL - Public, không cần login (user redirect sau thanh toán)
router.get("/vnpay-return", controller.vnpayReturn);

// API IPN (Webhook) - Public, không cần login (để Gateway gọi vào)
router.get("/vnpay-ipn", controller.vnpayIpn);
router.post("/momo-ipn", controller.momoIpn);

module.exports = router;
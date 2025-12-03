// backend/src/modules/auth/routes.js
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const controller = require("./controller");

const authMiddleware = require("../../middleware/auth");
const { registerValidationRules, changePasswordRules } = require("../../middleware/authValidation");
const validateMiddleware = require("../../middleware/validation");


const loginValidator = [
  // ... (giữ nguyên)
  body("tenDangNhap")
    .notEmpty()
    .withMessage("Tên đăng nhập là bắt buộc"),
  body("matKhau")
    .notEmpty()
    .withMessage("Mật khẩu là bắt buộc"),
];

// === THÊM MỚI ROUTE NÀY ===
/**
 * @route   POST /api/auth/request-otp
 * @desc    Yêu cầu gửi OTP để đăng ký
 * @access  Public
 */
router.post(
  "/request-otp",
  [
    body("email").isEmail().withMessage("Email không hợp lệ"),
    body("tenDangNhap").notEmpty().withMessage("Tên đăng nhập là bắt buộc")
  ],
  controller.requestRegisterOtp // <-- Thêm controller này ở bước sau
);

router.post("/register",registerValidationRules, validateMiddleware, controller.register);
router.post("/login", loginValidator, validateMiddleware, controller.login);
router.post("/google-login", controller.googleLogin);
router.get("/ma-xac-thuc/:maTaiKhoan", controller.taoMaXacThuc);
router.post("/doi-mat-khau", changePasswordRules, controller.doiMatKhau);
router.post("/quenmatkhau", controller.quenMatKhau);
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password", controller.resetPassword);
router.get("/me", authMiddleware, controller.getCurrentUser);

module.exports = router;
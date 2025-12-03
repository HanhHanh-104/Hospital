const express = require("express");
const router = express.Router();
const controller = require("./controller");
const checkRole = require("../../middleware/checkRole");
const verifyToken = require("../../middleware/auth");

// Import bộ luật chuẩn và middleware kiểm tra
const { registerValidationRules } = require("../../middleware/authValidation");
const validateMiddleware = require("../../middleware/validation");

// 1. Lấy danh sách (Admin)
// SỬA LỖI: Bỏ registerValidationRules ở đây để không chặn request lấy danh sách
router.get(
  "/", 
  verifyToken, 
  checkRole("ADMIN"), 
  controller.getAll
);

// 2. Lấy chi tiết (Admin)
router.get("/:id", verifyToken, checkRole("ADMIN"), controller.getById);

// 3. Admin TẠO TÀI KHOẢN MỚI
// SỬA LỖI: Áp dụng bộ luật registerValidationRules để chặn mật khẩu yếu "123456"
router.post(
  "/",
  verifyToken,
  checkRole("ADMIN"),
  registerValidationRules, // <-- Dùng bộ luật chuẩn (8 ký tự, Hoa, Thường, Số)
  validateMiddleware,      // <-- Chặn ngay nếu sai
  controller.register
);

// 4. Cập nhật (Admin)
router.put("/:id", verifyToken, checkRole("ADMIN"), controller.update);

// 5. Xóa (Admin)
router.delete("/:id", verifyToken, checkRole("ADMIN"), controller.remove);

// 6. Y Tá ĐĂNG KÝ BỆNH NHÂN
router.post(
  "/dangky-benhnhan", 
  registerValidationRules, // Áp dụng bộ luật chuẩn
  validateMiddleware,
  controller.dangKyBenhNhan
);

module.exports = router;
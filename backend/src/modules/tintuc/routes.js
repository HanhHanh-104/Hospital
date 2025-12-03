const express = require("express");
const router = express.Router();
const controller = require("./controller");
const verifyToken = require("../../middleware/auth");
const checkRole = require("../../middleware/checkRole");

// Public: Lấy tất cả tin tức (không cần đăng nhập)
router.get("/", controller.getAll);

// Public: Lấy 1 tin tức
router.get("/:maTin", controller.getOne);

// Admin/Nhân viên: Tạo tin tức
router.post("/", verifyToken, checkRole("ADMIN", "NHANSU"), controller.create);

// Admin/Nhân viên: Cập nhật tin tức
router.put("/:maTin", verifyToken, checkRole("ADMIN", "NHANSU"), controller.update);

// Admin: Xóa tin tức
router.delete("/:maTin", verifyToken, checkRole("ADMIN"), controller.delete);

module.exports = router;


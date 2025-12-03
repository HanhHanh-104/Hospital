const express = require("express");
const router = express.Router();
const controller = require("./controller");
const verifyToken = require("../../middleware/auth");

// QUAN TRỌNG: Đặt các route cụ thể TRƯỚC route generic /:id
// để tránh Express match nhầm "maTK" hoặc "tk" như là một id

// Route lấy bác sĩ theo mã tài khoản (đặt trước /:id)
// Yêu cầu authentication để bảo mật
router.get("/maTK/:maTK", verifyToken, controller.getByMaTK);
router.get("/tk/:maTK", verifyToken, controller.getByMaTK);

// Route chung
router.get("/", verifyToken, controller.getAll);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.remove);


module.exports = router;

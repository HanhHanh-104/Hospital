// 📁 backend/src/modules/PhongKhamNgoai/routes.js
const express = require("express");
const router = express.Router();
const controller = require("./controller");

// Danh sách tất cả phòng khám ngoài
router.get("/", controller.getAll);

// Lấy 1 phòng khám cụ thể
router.get("/:id", controller.getById);

// Tạo mới
router.post("/", controller.create);

// Cập nhật
router.put("/:id", controller.update);

// Xóa
router.delete("/:id", controller.delete);

module.exports = router;

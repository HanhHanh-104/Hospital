const express = require("express");
const router = express.Router();
const controller = require("./controller");
const verifyToken = require("../../middleware/auth");
const checkRole = require("../../middleware/checkRole");

// Bệnh nhân: Tạo phản hồi
router.post("/", verifyToken, checkRole("BENHNHAN"), controller.create);

// Bệnh nhân: Xem phản hồi của mình
router.get("/benhnhan/:maBN", verifyToken, checkRole("BENHNHAN"), controller.getByBenhNhan);
router.get("/benhnhan", verifyToken, checkRole("BENHNHAN"), controller.getByBenhNhan);

// Nhân viên/Admin: Lấy tất cả phản hồi
router.get("/", verifyToken, checkRole("ADMIN", "NHANSU"), controller.getAll);

// Nhân viên/Admin: Xử lý phản hồi
router.put("/:maPH", verifyToken, checkRole("ADMIN", "NHANSU"), controller.update);

// Admin: Xóa phản hồi
router.delete("/:maPH", verifyToken, checkRole("ADMIN"), controller.delete);

// Admin: Thống kê
router.get("/stats", verifyToken, checkRole("ADMIN"), controller.getStats);

module.exports = router;


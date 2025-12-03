const express = require("express");
const router = express.Router();
const controller = require("./controller/thongbao.controller");

// 🔔 Thông báo cá nhân
router.get("/canhan/:maTK", controller.getAll); // hoặc controller.getThongBaoCaNhan nếu có riêng
router.post("/canhan", controller.createCaNhan);
router.patch("/canhan/:id/doc", controller.markAsRead);
router.delete("/canhan/:id", controller.remove);

// 📢 Thông báo chung
router.get("/chung", controller.getAll); // hoặc controller.getThongBaoChung nếu tách riêng
router.post("/chung", controller.createChung);

module.exports = router;

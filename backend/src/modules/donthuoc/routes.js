// ROUTES: Định tuyến đơn thuốc và chi tiết đơn thuốc
const express = require("express");
const router = express.Router();
const controller = require("./controller");
const verifyToken = require("../../middleware/auth");
const upload = require("../../middleware/upload");

router.get("/", controller.getAll);
router.post("/", verifyToken,upload,controller.create); // ✅ Route này giờ sẽ nhận cả chi tiết

// Xóa các route không còn dùng
// router.post("/chitiet", controller.addChiTiet);
// router.get("/chitiet/:maDT", controller.getChiTiet);

// donthuoc.js
router.get("/by-month/:dotKhamBenh", controller.getByMonth);


module.exports = router;
// ROUTES: Định tuyến API cho lịch làm việc của bác sĩ
const express = require("express");
const router = express.Router();
const controller = require("./controller");

//  Lấy toàn bộ lịch làm việc (cho ADMIN)
router.get("/", controller.getAll);

//  Lấy lịch làm việc theo mã BÁC SĨ (dùng maBS)
router.get("/bacsi/:maBS", controller.getByBacSi);

//  Tạo mới lịch làm việc
router.post("/", controller.create);

//  Cập nhật lịch làm việc
router.put("/:id", controller.update);

//  Xoá lịch làm việc
router.delete("/:id", controller.remove);

module.exports = router;

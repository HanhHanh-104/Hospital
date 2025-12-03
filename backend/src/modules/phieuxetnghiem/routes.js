const express = require("express");
const router = express.Router();
const controller = require("./controller");
const verifyToken = require("../../middleware/auth");
const upload = require("../../middleware/upload");
// API cho bệnh viện
router.get("/", controller.getAll);
router.post("/", verifyToken, upload, controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

// API cho BỆNH NHÂN
router.post("/from-patient", controller.createFromPatient);
router.get("/byMaHSBA/:maHSBA", controller.getByMaHSBA);
router.get("/by-month/:dotKhamBenh", controller.getByMonth);
router.put("/capnhat-trangthai", controller.updateTrangThai);

module.exports = router;

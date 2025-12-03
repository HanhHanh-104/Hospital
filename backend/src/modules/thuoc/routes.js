// ROUTES: Định tuyến API cho module Thuốc – bao gồm thuốc, nhóm thuốc, đơn vị tính
const express = require("express");
const router = express.Router();
const controller = require("./controller");

// ========== NHÓM THUỐC ==========
router.get("/nhomthuoc", controller.getAllNhom);// lấy tất cả nhóm thuốc
router.get("/nhomthuoc/:id", controller.getOneNhom);// lấy thông tin nhóm thuốc theo ID
router.post("/nhomthuoc", controller.createNhom);// tạo nhóm thuốc mới
router.put("/nhomthuoc/:id", controller.updateNhom);// cập nhật thông tin nhóm thuốc
router.delete("/nhomthuoc/:id", controller.deleteNhom);// xoá nhóm thuốc

// ========== ĐƠN VỊ TÍNH ==========
router.get("/donvitinh", controller.getAllDonVi); // lấy tất cả đơn vị tính
router.get("/donvitinh/:id", controller.getOneDonVi); // lấy thông tin đơn vị tính theo ID
router.post("/donvitinh", controller.createDonVi); // tạo đơn vị tính mới
router.put("/donvitinh/:id", controller.updateDonVi); // cập nhật thông tin đơn vị tính
router.delete("/donvitinh/:id", controller.deleteDonVi); // xoá đơn vị tính

// ========== THUỐC ==========
router.get("/", controller.getAllThuoc); // lấy tất cả thuốc
router.get("/:id", controller.getOneThuoc); // lấy thông tin thuốc theo ID
router.post("/", controller.createThuoc); // tạo thuốc mới
router.put("/:id", controller.updateThuoc); // cập nhật thông tin thuốc
router.delete("/:id", controller.deleteThuoc); // xoá thuốc


module.exports = router;

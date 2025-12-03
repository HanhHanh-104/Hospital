const express = require("express");
const router = express.Router();
const controller = require("./controller");

// ---------------- HOÁ ĐƠN ----------------
router.get("/", controller.getAllHoaDon);
router.post("/", controller.createHoaDon);
router.put("/:maHD", controller.updateTrangThai);

// ---------------- CHI TIẾT HOÁ ĐƠN ----------------
router.post("/chitiet", controller.addChiTietHD);

// ---------------- THANH TOÁN ----------------
router.post("/thanhtoan", controller.createThanhToan);
router.get("/thanhtoan/:maHD", controller.getThanhToanByHoaDon);

// ---------------- GIỎ HÀNG ----------------
router.get("/giohang/:maBN", controller.getGioHang);
router.post("/giohang", controller.addToGioHang);
router.delete("/giohang/item/:id", controller.deleteChiTietGioHang);
router.post("/giohang/confirm", controller.confirmGioHang);

// ---------------- BỆNH NHÂN ----------------
router.get("/myhoadon/:maBN", controller.getHoaDonByBenhNhan);


// ---------------- THỐNG KÊ ----------------
router.get("/thongke", controller.thongKe);


module.exports = router;

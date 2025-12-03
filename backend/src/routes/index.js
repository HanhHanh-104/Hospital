const express = require("express");
const router = express.Router();

//  Đăng nhập & phân quyền
router.use("/auth", require("../modules/auth"));

//  Quản lý người dùng*******


//  Đặt lịch hẹn khám
router.use("/lichkham", require("../modules/lichkham"));

//  Quản lý thuốc, dược
router.use("/thuoc", require("../modules/thuoc"));


//  Hồ sơ bệnh án
router.use("/hsba", require("../modules/hsba"));


//  Phản hồi - Tin tức - Thông báo
router.use("/phanhoi", require("../modules/phanhoi"));
router.use("/tintuc", require("../modules/tintuc"));

//-----------------------------------------------------------------------------
//  Trợ lý bác sĩ
router.use("/tro-ly", require("../modules/troly"));

//  Quản lý tài khoản
router.use("/tai-khoan", require("../modules/account"));
//  Quản lý khoa, phòng
router.use("/khoa", require("../modules/khoa"));
//  Quản lý bác sĩ
router.use("/bacsi", require("../modules/bacsi"));
//  Quản lý nhân viên y tế
router.use("/nhansu", require("../modules/nhansu"));
//  Quản lý bệnh nhân
router.use("/benhnhan", require("../modules/benhnhan"));
router.use("/xetnghiem", require("../modules/xetnghiem"));//  Quản lý xét nghiệm
router.use("/loaixetnghiem", require("../modules/loaixetnghiem"));//  Quản lý loại xét nghiệm
router.use("/yeucauxetnghiem", require("../modules/yeucauxetnghiem"));//  Quản lý yêu cầu xét nghiệm
router.use("/phieuxetnghiem", require("../modules/phieuxetnghiem"));//  Quản lý phiếu xét nghiệm
router.use("/hoadon", require("../modules/hoadon"));//  Quản lý hóa đơn
router.use("/lichlamviec", require("../modules/lichlamviec"));//  Quản lý lịch làm việc
router.use("/catruc", require("../modules/catruc"));//  Quản lý ca trực
//------------------------------------------------------------------------------
router.use("/phieukham", require("../modules/phieukham"));//  Quản lý phiếu khám
router.use("/donthuoc", require("../modules/donthuoc"));//  Quản lý đơn thuốc
//--------------------------------------------------------------------------------------------
router.use("/notification", require("../modules/notification"));
router.use("/phongkhamngoai", require("../modules/PhongKhamNgoai"));

router.use("/chat", require("../modules/chat/routes"));
router.use("/chatbot", require("../modules/chatbot/routes"));

router.use("/payment", require("../modules/payment/routes"));

module.exports = router;

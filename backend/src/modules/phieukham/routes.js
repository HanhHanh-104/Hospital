// ROUTES: Định tuyến API cho phiếu khám của bác sĩ
const express = require("express");
const router = express.Router();
const controller = require("./controller");

// === BẮT ĐẦU SỬA LỖI ===
// 1. Import middleware
const verifyToken = require("../../middleware/auth");
const checkRole = require("../../middleware/checkRole");
const checkCapBac = require("../../middleware/checkCapBac");
const upload = require("../../middleware/upload");

// 2. Áp dụng middleware cho các route
// Bất kỳ ai đã đăng nhập (Admin, Bác sĩ, Nhân viên) đều có thể xem
router.get("/", verifyToken, controller.getAll);                     
router.get("/bacsi/:maBS", verifyToken, controller.getByBacSi);      

// Tạo phiếu khám: Chỉ Bác sĩ sơ cấp trở lên (không cho Bác sĩ thực tập)
// Bác sĩ thực tập chỉ được xem, không được tạo phiếu khám độc lập
router.post("/", 
  verifyToken, 
  checkRole("BACSI"),
  checkCapBac(
    "Bác sĩ sơ cấp",
    "Bác sĩ điều trị",
    "Bác sĩ chuyên khoa I",
    "Bác sĩ chuyên khoa II",
    "Thạc sĩ – Bác sĩ",
    "Tiến sĩ – Bác sĩ",
    "Phó giáo sư – Bác sĩ",
    "Giáo sư – Bác sĩ"
  ),
  upload, 
  controller.create
);

// Các hàm Sửa/Xóa/Lấy chi tiết (đã bị vô hiệu hóa ở controller)
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.remove);
router.get("/:maPK", verifyToken, controller.getByPK); 
router.get("/by-month/:dotKhamBenh", verifyToken, controller.getByMonth);
// === KẾT THÚC SỬA LỖI ===

module.exports = router;
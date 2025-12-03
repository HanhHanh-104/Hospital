const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const controller = require("./controller");
const verifyToken = require("../../middleware/auth");
const checkRole = require("../../middleware/checkRole");

//  Validator
const assistantValidator = [
  body("maNS").notEmpty().withMessage("Thiếu mã nhân sự"),
  body("maBacSi").notEmpty().withMessage("Thiếu mã bác sĩ"),
  body("phamViUyQuyen").optional().isString(),
];

// GET /troly – ADMIN xem tất cả, BACSI xem của mình
router.get("/", verifyToken, checkRole("ADMIN", "BACSI"), controller.getAll);

// POST /troly – chỉ ADMIN
router.post("/", verifyToken, checkRole("ADMIN"), assistantValidator, controller.create);

// PUT /troly/:maTroLy – chỉ ADMIN
router.put("/:maTroLy", verifyToken, checkRole("ADMIN"), assistantValidator, controller.update);

// DELETE /troly/:maTroLy – chỉ ADMIN
router.delete("/:maTroLy", verifyToken, checkRole("ADMIN"), controller.remove);

module.exports = router;

const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const controller = require("./controller");

router.get("/", controller.getAll);
router.post("/", body("tenKhoa").notEmpty(), controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;

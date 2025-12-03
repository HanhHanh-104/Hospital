const express = require("express");
const router = express.Router();
const controller = require("./controller");


router.get("/check", controller.checkTrungLich);

router.get("/", controller.getAll);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);
router.get("/benhnhan/:maBN", controller.getByMaBN);
router.get("/bacsi/:maBS", controller.getByMaBS);

module.exports = router;

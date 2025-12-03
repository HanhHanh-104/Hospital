// ROUTES: API quản lý ca trực bệnh viện
const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.get("/", controller.getAll);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;

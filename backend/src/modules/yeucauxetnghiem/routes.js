const express = require("express");
const router = express.Router();
const controller = require("./controller");
const verifyToken = require("../../middleware/auth");

router.get("/", controller.getAll);
router.post("/", verifyToken,controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;

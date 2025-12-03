const express = require("express");
const router = express.Router();

router.use("/notification", require("./routers"));
// Các route khác như:
// router.use("/nhansu", require("./nhansu.router"));

module.exports = router;

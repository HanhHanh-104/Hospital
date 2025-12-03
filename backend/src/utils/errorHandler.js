const logger = require("./logger");

module.exports = (err, req, res, next) => {
  const thongTinLoi = `${req.method} ${req.originalUrl} – ${err.message}`;
  logger.error(thongTinLoi);

  res.status(err.status || 500).json({
    thongBao: "Đã xảy ra lỗi trong hệ thống. Vui lòng thử lại sau!",
    chiTiet: process.env.NODE_ENV === "development" ? err.message : undefined
  });
};

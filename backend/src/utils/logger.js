const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  level: "error",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new transports.File({ filename: "logs/error.log" }) // Lưu lỗi vào thư mục logs
  ],
});

module.exports = logger;

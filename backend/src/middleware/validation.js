const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Gom các lỗi lại thành một cấu trúc dễ đọc cho Frontend
    const formattedErrors = errors.array().map(err => ({
      truong: err.path || err.param, // Tên trường bị lỗi (ví dụ: email, matKhau)
      thongDiep: err.msg,            // Nội dung lỗi
      giaTri: err.value              // Giá trị người dùng nhập (tùy chọn, cẩn thận với password)
    }));

    // Log nhẹ để debug (không log mật khẩu)
    console.log("❌ Validation Failed:", JSON.stringify(formattedErrors));

    return res.status(400).json({
      success: false,
      message: "Dữ liệu đầu vào không hợp lệ",
      errors: formattedErrors
    });
  }

  next();
};

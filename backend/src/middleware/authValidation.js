const { body } = require("express-validator");

/**
 * Định nghĩa các quy tắc kiểm tra mật khẩu mạnh
 * - Tối thiểu 8 ký tự (có thể cấu hình)
 * - Ít nhất 1 chữ thường
 * - Ít nhất 1 chữ hoa
 * - Ít nhất 1 chữ số
 */
const passwordRules = body("matKhau")
  .notEmpty().withMessage("Mật khẩu không được để trống")
  .isLength({ min: 8 }).withMessage("Mật khẩu phải có ít nhất 8 ký tự")
  .matches(/[a-z]/).withMessage("Mật khẩu phải chứa ít nhất 1 chữ cái thường")
  .matches(/[A-Z]/).withMessage("Mật khẩu phải chứa ít nhất 1 chữ cái in hoa")
  .matches(/[0-9]/).withMessage("Mật khẩu phải chứa ít nhất 1 chữ số");

/**
 * Định nghĩa quy tắc kiểm tra Email
 */
const emailRule = body("email")
  .notEmpty().withMessage("Email không được để trống")
  .isEmail().withMessage("Định dạng email không hợp lệ (Ví dụ: user@example.com)")
  .normalizeEmail();

/**
 * Bộ rule đầy đủ cho chức năng Đăng ký / Tạo tài khoản
 */
const registerValidationRules = [
  body("tenDangNhap")
    .notEmpty().withMessage("Tên đăng nhập là bắt buộc")
    .isLength({ min: 4 }).withMessage("Tên đăng nhập phải từ 4 ký tự trở lên")
    .trim(),
  
  emailRule,
  
  passwordRules,

  body("maNhom")
    .notEmpty().withMessage("Nhóm quyền là bắt buộc")
    .isIn(['ADMIN', 'BACSI', 'NHANSU', 'BENHNHAN']).withMessage("Nhóm quyền không hợp lệ"),
];

/**
 * Bộ rule cho chức năng Đổi mật khẩu (kiểm tra mật khẩu mới)
 */
const changePasswordRules = [
  body("matKhauMoi")
    .custom((value, { req }) => {
      if (value === req.body.matKhauCu) {
        throw new Error("Mật khẩu mới không được trùng với mật khẩu cũ");
      }
      return true;
    }),
  // Áp dụng lại quy tắc mạnh cho mật khẩu mới
  body("matKhauMoi")
    .isLength({ min: 8 }).withMessage("Mật khẩu mới phải có ít nhất 8 ký tự")
    .matches(/[a-z]/).withMessage("Mật khẩu mới phải chứa chữ thường")
    .matches(/[A-Z]/).withMessage("Mật khẩu mới phải chứa chữ hoa")
    .matches(/[0-9]/).withMessage("Mật khẩu mới phải chứa chữ số")
];

module.exports = {
  registerValidationRules,
  changePasswordRules,
  passwordRules,
  emailRule
};
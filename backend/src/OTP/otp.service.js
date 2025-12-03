const { Otp, TaiKhoan } = require('../models');
const { Op } = require('sequelize');
const { sendEmail } = require('../OTP/email.service');
const crypto = require('crypto');

const OTP_EXPIRES_IN_MINUTES = parseInt(process.env.OTP_EXPIRES_IN_MINUTES || '5', 10);

/**
 * Tạo mã OTP 6 số
 */
const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Gửi email chứa mã OTP
 */
const sendOtpEmail = async (email, otpCode, purpose) => {
  let subject = '';
  let message = '';

  if (purpose === 'REGISTER_PATIENT') {
    subject = 'Xác thực tài khoản Bệnh viện Hospital5';
    message = `Chào bạn,<br><br>Mã OTP để kích hoạt tài khoản của bạn là: <h2>${otpCode}</h2><br>Mã này sẽ hết hạn sau ${OTP_EXPIRES_IN_MINUTES} phút.<br><br>Trân trọng,<br>Bệnh viện Hospital5`;
  } else if (purpose === 'RESET_PASSWORD') {
    subject = 'Yêu cầu đặt lại mật khẩu Bệnh viện Hospital5';
    message = `Chào bạn,<br><br>Mã OTP để đặt lại mật khẩu của bạn là: <h2>${otpCode}</h2><br>Mã này sẽ hết hạn sau ${OTP_EXPIRES_IN_MINUTES} phút.<br><br>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email.<br><br>Trân trọng,<br>Bệnh viện Hospital5`;
  }  else if (purpose === 'UPDATE_EMAIL') {
    subject = 'Xác thực Email mới cho Bệnh viện Hospital5';
    message = `Chào bạn,<br><br>Mã OTP để xác thực email mới của bạn là: <h2>${otpCode}</h2><br>Mã này sẽ hết hạn sau ${OTP_EXPIRES_IN_MINUTES} phút.<br><br>Trân trọng,<br>Bệnh viện Hospital5`;
  } else {
    return; // Không gửi nếu không rõ mục đích
  }

  await sendEmail(email, subject, message);
};

/**
 * Tạo, lưu và gửi OTP
 * @param {string} email Email của người nhận
 * @param {string} purpose Mục đích ('REGISTER_PATIENT' hoặc 'RESET_PASSWORD')
 */
const createAndSendOtp = async (email, purpose) => {
  // Xóa các OTP cũ cùng mục đích
  await Otp.destroy({
    where: { email, purpose },
  });

  const otpCode = generateOtp();
  const expiredAt = new Date(Date.now() + OTP_EXPIRES_IN_MINUTES * 60 * 1000);

  // Lưu OTP mới vào CSDL
  const newOtp = await Otp.create({
    email,
    otpCode,
    purpose,
    expiredAt,
  });

  // Gửi email
  await sendOtpEmail(email, otpCode, purpose);

  return newOtp;
};

/**
 * Xác thực mã OTP
 * @param {string} email
 * @param {string} otpCode
 * @param {string} purpose
 * @returns {Promise<boolean>}
 */
const verifyOtp = async (email, otpCode, purpose) => {
  const otpEntry = await Otp.findOne({
    where: {
      email,
      otpCode,
      purpose,
      expiredAt: {
        [Op.gt]: new Date(), // Lớn hơn thời gian hiện tại (chưa hết hạn)
      },
    },
  });

  if (!otpEntry) {
    return false; // Sai mã, hết hạn, hoặc không đúng mục đích
  }

  // Xóa OTP sau khi xác thực thành công (dùng một lần)
  await otpEntry.destroy();
  return true;
};

module.exports = {
  createAndSendOtp,
  verifyOtp,
};
const nodemailer = require('nodemailer');

// Cấu hình transporter (dịch vụ gửi mail)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: process.env.EMAIL_SECURE === 'true', // true cho port 465, false cho các port khác
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Gửi email
 * @param {string} to Email người nhận
 * @param {string} subject Tiêu đề email
 * @param {string} html Nội dung HTML của email
 */
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Bệnh viện Hospital5" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email đã gửi: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Lỗi khi gửi email đến ${to}:`, error);
    throw new Error('Không thể gửi email xác thực.');
  }
};

module.exports = {
  sendEmail,
};
const express = require('express');
const router = express.Router();
const controller = require('./chatbot.controller');
const verifyToken = require('../../middleware/auth'); // Import middleware xác thực

const optionalAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    req.user = null; // Là khách
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Là thành viên
  } catch (error) {
    req.user = null; // Token lỗi/hết hạn -> coi như khách
  }
  next();
};

// Tất cả các route trong file này đều yêu cầu xác thực
router.use(verifyToken);

/**
 * @route   POST /api/chatbot
 * @desc    Gửi tin nhắn đến chatbot
 * @access  Private
 */
router.post('/',optionalAuth, controller.handleMessage);

/**
 * @route   GET /api/chatbot/history
 * @desc    Lấy lịch sử hội thoại của người dùng
 * @access  Private
 */
router.get('/history', controller.getHistory);

/**
 * @route   GET /api/chatbot/intents
 * @desc    Lấy danh sách các intent (demo)
 * @access  Private (hoặc Admin)
 */
router.get('/intents', controller.getIntents);

module.exports = router;
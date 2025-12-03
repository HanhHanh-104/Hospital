const express = require("express");
const router = express.Router();
const controller = require("./controller");
const verifyToken = require("../../middleware/auth");

// Yêu cầu xác thực cho tất cả route chat
router.use(verifyToken);

/**
 * @route   GET /api/chat/contacts
 * @desc    Lấy danh sách user có thể chat (danh bạ)
 * @access  Private
 */
router.get("/contacts", controller.getContacts);

/**
 * @route   GET /api/chat/rooms
 * @desc    Lấy danh sách phòng chat (cuộc hội thoại cũ)
 * @access  Private
 */
router.get("/rooms", controller.getUserRooms);

/**
 * @route   GET /api/chat/messages/:roomId
 * @desc    Lấy lịch sử tin nhắn của một phòng (roomName)
 * @access  Private
 */
router.get("/messages/:roomId", controller.getRoomMessages);

module.exports = router;
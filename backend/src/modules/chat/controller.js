const chatService = require("../../chat/chatService");

/**
 * Lấy danh sách các phòng chat CŨ của user
 */
exports.getUserRooms = async (req, res) => {
  try {
    const userId = req.user.maTK;
    const rooms = await chatService.getUserRooms(userId);
    res.json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Lấy lịch sử tin nhắn của một phòng
 */
exports.getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params; // roomId ở đây là roomName
    // TODO: Thêm bước kiểm tra xem user có thuộc phòng này không
    const history = await chatService.getRoomHistory(roomId);
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Lấy danh sách user CÓ THỂ liên hệ
 */
exports.getContacts = async (req, res) => {
    try {
        // req.user được gán từ middleware verifyToken
        const contacts = await chatService.getContacts(req.user);
        res.json({ success: true, data: contacts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
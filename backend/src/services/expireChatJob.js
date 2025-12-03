const db = require("../models");
const { ChatRooms } = db;
const chatService = require("../chat/chatService");

/**
 * Job tự động ngưng chat sau 15 phút
 * Chạy mỗi 1 phút để kiểm tra và cập nhật trạng thái
 */
const expireChatSessions = async () => {
  try {
    // Lấy tất cả các phòng chat đang ACTIVE
    const activeRooms = await ChatRooms.findAll({
      where: {
        trangThai: 'ACTIVE'
      }
    });

    if (activeRooms.length === 0) {
      return; // Không có phòng nào cần kiểm tra
    }

    let expiredCount = 0;
    const now = new Date();

    for (const room of activeRooms) {
      // Kiểm tra xem chat có còn trong thời gian 15 phút không
      if (!chatService.isChatActive(room)) {
        // Hết thời gian: cập nhật trạng thái
        await ChatRooms.update(
          { trangThai: 'EXPIRED' },
          { where: { roomName: room.roomName } }
        );
        expiredCount++;
        console.log(`⏰ Đã ngưng chat phòng ${room.roomName} - Hết hạn 15 phút`);
      }
    }

    if (expiredCount > 0) {
      console.log(`✅ Đã ngưng ${expiredCount} cuộc chat hết hạn`);
    }
  } catch (error) {
    console.error("❌ Lỗi khi kiểm tra chat hết hạn:", error);
  }
};

const startExpireChatJob = () => {
  console.log("✅ Đã khởi động job ngưng chat hết hạn (chạy mỗi 1 phút)");
  expireChatSessions(); // Chạy ngay lần đầu
  setInterval(expireChatSessions, 60 * 1000); // Chạy mỗi 1 phút
};

module.exports = { startExpireChatJob, expireChatSessions };


const db = require("../models");
const { LichKham, HoaDon } = db;

const CANCEL_AFTER_MINUTES = 15; // Hủy sau 15 phút

const cancelExpiredAppointments = async () => {
  try {
    const now = new Date();
    const cancelTime = new Date(now.getTime() - CANCEL_AFTER_MINUTES * 60 * 1000);

    // Tìm các lịch có trạng thái CHO_THANH_TOAN và đã quá 15 phút
    const { Op } = require("sequelize");
    const expiredAppointments = await LichKham.findAll({
      where: {
        trangThai: "CHO_THANH_TOAN",
        thoiGianTao: {
          [Op.lt]: cancelTime
        }
      }
    });

    if (expiredAppointments.length > 0) {
      console.log(`🕐 Tìm thấy ${expiredAppointments.length} lịch hết hạn thanh toán, đang hủy...`);
      
      for (const appointment of expiredAppointments) {
        // Cập nhật trạng thái lịch thành DA_HUY
        await LichKham.update(
          { trangThai: "DA_HUY" },
          { where: { maLich: appointment.maLich } }
        );

        // Nếu có hóa đơn, cập nhật trạng thái hóa đơn
        if (appointment.maHD) {
          await HoaDon.update(
            { trangThai: "DA_HUY" },
            { where: { maHD: appointment.maHD } }
          );
        }

        console.log(`❌ Đã hủy lịch ${appointment.maLich} - Quá 15 phút chưa thanh toán`);
      }
    }
  } catch (error) {
    console.error("❌ Lỗi khi hủy lịch hết hạn:", error);
  }
};

// Chạy job mỗi 1 phút
const startCancelJob = () => {
  console.log("✅ Đã khởi động job hủy lịch hết hạn thanh toán (chạy mỗi 1 phút)");
  
  // Chạy ngay lần đầu
  cancelExpiredAppointments();
  
  // Sau đó chạy mỗi 1 phút
  setInterval(cancelExpiredAppointments, 60 * 1000);
};

module.exports = { startCancelJob, cancelExpiredAppointments };

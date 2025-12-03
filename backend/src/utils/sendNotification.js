const { v4: uuidv4 } = require("uuid");
const ThongBao = require("../modules/Notification/model");

const sendNotification = async ({ tieuDe, noiDung, maNguoiNhan, loaiThongBao = "ca_nhan" }) => {
  try {
    await ThongBao.create({
      maTB: uuidv4(),
      tieuDe,
      noiDung,
      maNguoiNhan,
      loaiThongBao,
      thoiGian: new Date(),
    });
  } catch (error) {
    console.error(" Gửi thông báo thất bại:", error.message);
  }
};

module.exports = sendNotification;

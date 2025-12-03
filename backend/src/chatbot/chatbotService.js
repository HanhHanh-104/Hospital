const axios = require('axios');
const db = require('../models');
const { Op } = require('sequelize');

const CHATBOT_API_URL = process.env.CHATBOT_API_URL;
const CHATBOT_API_KEY = process.env.CHATBOT_API_KEY;

// Hàm ghi log (chạy ngầm, không chặn luồng chính)
const logConversation = async (maTK, message, reply, intent) => {
  if (!maTK) return; 
  try {
    await db.ChatLog.create({ maTK, message, reply, intent });
  } catch (error) {
    console.error('Lỗi ghi log chatbot:', error.message);
  }
};

/**
 * Tạo Prompt hệ thống động dựa trên ngữ cảnh trang
 */
const generateSystemPrompt = (pageContext) => {
  let contextInstruction = "";

  switch (pageContext) {
    case 'register':
      contextInstruction = `
      [NGỮ CẢNH: Trang Đăng Ký Tài Khoản]
      - Hướng dẫn người dùng nhập: Email, Mật khẩu (>=6 ký tự), Họ tên.
      - Giải thích các lỗi thường gặp: "Email đã tồn tại" (thì khuyên Đăng nhập hoặc Quên mật khẩu).
      - Giọng điệu: Khuyến khích, hỗ trợ kỹ thuật.
      `;
      break;

    case 'appointment':
      contextInstruction = `
      [NGỮ CẢNH: Trang Đặt Lịch Khám]
      - Nhiệm vụ chính: Gợi ý KHOA KHÁM dựa trên triệu chứng.
      - Ví dụ: 
        + Ho, sốt -> Khoa Nội Hô Hấp.
        + Đau xương khớp -> Khoa Cơ Xương Khớp.
        + Mẩn ngứa -> Khoa Da Liễu.
        + Đau bụng -> Khoa Tiêu Hóa.
      - Nhắc nhở: Kiểm tra kỹ ngày giờ và bác sĩ trước khi xác nhận.
      `;
      break;

    case 'prescription':
      contextInstruction = `
      [NGỮ CẢNH: Trang Đơn Thuốc]
      - Nhiệm vụ: Giải thích cách dùng thuốc (Sáng/Chiều/Tối, Trước/Sau ăn).
      - Cảnh báo: Không tự ý thay đổi liều lượng, tuân thủ chỉ định bác sĩ.
      - KHÔNG được kê đơn thuốc mới. Chỉ giải thích dựa trên kiến thức dược lý chung.
      `;
      break;

    default:
      contextInstruction = `[NGỮ CẢNH: Trang Chủ/Chung] Hỗ trợ thông tin chung về bệnh viện, giờ làm việc, quy trình.`;
      break;
  }

  return `Bạn là Trợ lý Y tế Ảo của Bệnh viện Hospital5 (biểu tượng chữ thập xanh).
    ${contextInstruction}

    QUY TẮC AN TOÀN:
    1. KHÔNG CHẨN ĐOÁN BỆNH thay bác sĩ. Luôn thêm câu "Thông tin chỉ mang tính tham khảo, vui lòng đi khám để chính xác nhất." khi nói về bệnh lý.
    2. Trả lời ngắn gọn, súc tích, thân thiện.

    QUY TẮC KỸ THUẬT (JSON OUTPUT):
    Nếu nhận diện được ý định cần tra cứu dữ liệu, trả về JSON: {"intent": "TEN_INTENT", "entities": {...}}
    Các intent: VIEW_APPOINTMENTS (xem lịch), VIEW_PRESCRIPTIONS (xem đơn), BOOK_APPOINTMENT (đặt lịch), CANCEL_APPOINTMENT (hủy lịch).
    Ngược lại, trả lời bằng văn bản thường.
  `;
};

const sendMessageToExternalAPI = async (message, pageContext) => {
  const fullApiUrl = `${CHATBOT_API_URL}?key=${CHATBOT_API_KEY}`;
  const systemPrompt = generateSystemPrompt(pageContext);

  try {
    const payload = {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: message }] }],
      generationConfig: { responseMimeType: "text/plain" }
    };

    // Timeout 10s để tránh treo
    const response = await axios.post(fullApiUrl, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000 
    });

    const rawReply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawReply) return { reply: 'Xin lỗi, kết nối đến trí tuệ nhân tạo bị gián đoạn.', intent: 'BLOCKED', entities: {} };

    // Cố gắng parse JSON intent
    try {
      const jsonMatch = rawReply.match(/\{.*\}/s);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.intent) return { reply: null, intent: parsed.intent, entities: parsed.entities || {} };
      }
    } catch (e) {}

    return { reply: rawReply, intent: 'FAQ_GENERAL', entities: {} };

  } catch (error) {
    if (error.code === 'ECONNABORTED') return { reply: 'Hệ thống đang bận, vui lòng thử lại sau giây lát.', intent: 'TIMEOUT_ERROR', entities: {} };
    return { reply: 'Xin lỗi, tôi đang gặp sự cố kỹ thuật.', intent: 'EXTERNAL_API_ERROR', entities: {} };
  }
};

const handleInternalLogic = async (intent, entities, userContext) => {
  const { maTK, maBN } = userContext;
  const personalIntents = ['VIEW_APPOINTMENTS', 'VIEW_PRESCRIPTIONS', 'CANCEL_APPOINTMENT'];

  if (personalIntents.includes(intent) && !maBN) {
    return 'Chức năng này chỉ dành cho bệnh nhân đã có hồ sơ tại bệnh viện.';
  }

  try {
    switch (intent) {
      case 'VIEW_APPOINTMENTS':
        const appts = await db.LichKham.findAll({
          where: { maBN, ngayKham: { [Op.gte]: new Date() } },
          include: [{ model: db.BacSi, as: 'BacSi', attributes: ['hoTen'] }],
          limit: 3, order: [['ngayKham', 'ASC']]
        });
        if (!appts.length) return 'Bạn hiện không có lịch khám nào sắp tới.';
        return 'Lịch khám của bạn:\n' + appts.map(a => `📅 ${a.gioKham} - ${a.ngayKham} (BS. ${a.BacSi?.hoTen || '---'})`).join('\n');

      case 'VIEW_PRESCRIPTIONS':
        return 'Bạn có thể xem chi tiết đơn thuốc trong mục "Hồ sơ bệnh án". Tôi có thể giải thích công dụng thuốc nếu bạn cung cấp tên thuốc.';

      case 'BOOK_APPOINTMENT':
        return 'Để đặt lịch, bạn hãy chọn chuyên khoa và bác sĩ ở màn hình chính, sau đó chọn giờ trống (màu xanh) nhé.';

      default:
        return 'Xin lỗi, tôi chưa hỗ trợ thao tác này.';
    }
  } catch (error) {
    return 'Đã xảy ra lỗi khi truy xuất dữ liệu.';
  }
};

const handleMessage = async (message, userContext, pageContext = 'home') => {
  // 1. Gọi AI với ngữ cảnh
  const analysis = await sendMessageToExternalAPI(message, pageContext);
  let finalReply = analysis.reply;
  const intent = analysis.intent;

  // 2. Nếu AI trả về intent (cần dữ liệu DB), gọi logic nội bộ
  if (!finalReply) {
    finalReply = await handleInternalLogic(intent, analysis.entities, userContext);
  }

  // 3. Ghi log (không await để tránh treo)
  logConversation(userContext.maTK, message, finalReply, intent);

  return { reply: finalReply, intent };
};

// Giữ nguyên các hàm phụ trợ
const getChatHistory = async (maTK) => {
  try {
    return await db.ChatLog.findAll({ where: { maTK }, order: [['timestamp', 'ASC']], limit: 50 });
  } catch (e) { return []; }
};

// Hàm xử lý ảnh (giữ nguyên logic cũ, thêm pageContext nếu muốn)
const handleImageUpload = async (prompt, image, userContext) => {
    return { reply: "Tính năng đọc ảnh đang được bảo trì.", intent: "MAINTENANCE" };
};

module.exports = { handleMessage, getChatHistory, handleImageUpload };
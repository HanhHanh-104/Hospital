const chatbotService = require('../../chatbot/chatbotService');
const db = require('../../models');

/**
 * Lấy ngữ cảnh người dùng (helper function)
 */
const getUserContext = async (maTK) => {
  let userContext = { maTK };
  
  if (maTK) {
    const benhNhan = await db.BenhNhan.findOne({ where: { maTK } });
    if (benhNhan) {
      userContext.maBN = benhNhan.maBN;
      userContext.tenBN = benhNhan.hoTen;
    }

    const bacSi = await db.BacSi.findOne({ where: { maTK } });
    if (bacSi) {
      userContext.maBS = bacSi.maBS;
      userContext.tenBS = bacSi.hoTen;
    }
  }
  return userContext;
};


/**
 * Xử lý tin nhắn VĂN BẢN: POST /api/chatbot
 */
exports.handleMessage = async (req, res) => {
  try {
    // Nhận thêm pageContext từ body (ví dụ: "register", "appointment")
    const { message, pageContext } = req.body;
    
    // Cho phép chat ngay cả khi chưa login (để hỗ trợ trang Đăng ký)
    let maTK = null;
    if (req.user) {
      maTK = req.user.maTK;
    }

    if (!message) {
      return res.status(400).json({ success: false, message: 'Tin nhắn không được rỗng.' });
    }

    const userContext = await getUserContext(maTK);
    
    // Gửi kèm pageContext vào service
    const response = await chatbotService.handleMessage(message, userContext, pageContext);

    res.json({ success: true, data: response });
  } catch (error) {
    console.error('Lỗi Chatbot Controller (Text):', error.message);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ Chatbot.' });
  }
};

/**
 * Xử lý tin nhắn HÌNH ẢNH: POST /api/chatbot/upload
 */
exports.handleImageMessage = async (req, res) => {
  try {
    const { image, prompt, pageContext } = req.body; // Nhận thêm context
    const { maTK } = req.user;

    if (!maTK) {
      return res.status(401).json({ success: false, message: 'Yêu cầu xác thực.' });
    }
    if (!image) {
      return res.status(400).json({ success: false, message: 'Không có dữ liệu hình ảnh.' });
    }

    const userContext = await getUserContext(maTK);
    
    const response = await chatbotService.handleImageUpload(prompt, image, userContext, pageContext);

    res.json({ success: true, data: response });

  } catch (error) {
    console.error('Lỗi Chatbot Controller (Image):', error.message);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi xử lý ảnh.' });
  }
};

// Giữ nguyên các hàm khác
exports.getHistory = async (req, res) => {
    try {
        const { maTK } = req.user;
        if (!maTK) return res.status(401).json({ success: false, message: 'Yêu cầu xác thực.' });
        const history = await chatbotService.getChatHistory(maTK);
        res.json({ success: true, data: history });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
    }
};

exports.getIntents = (req, res) => {
    res.json({ success: true, data: [] });
};
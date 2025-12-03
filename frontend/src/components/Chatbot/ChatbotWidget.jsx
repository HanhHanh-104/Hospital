import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom"; 
// SỬA LỖI IMPORT: Đảm bảo đường dẫn chính xác tới file service vừa tạo
import { sendMessage, getHistory, uploadImage } from "../../services/chatbot/chatbotService.js";

// --- ICONS (SVG) ---
const DoctorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-teal-600 bg-white rounded-full p-1 shadow-sm">
    <path d="M19 2H5C3.34 2 2 3.34 2 5v14c0 1.66 1.34 3 3 3h14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3zm-1 11h-4v4h-4v-4H6v-4h4V5h4v4h4v4z"/>
  </svg>
);
const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const SendIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>);
const PaperClipIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.687 7.687a1.5 1.5 0 0 0 2.122 2.122l7.687-7.687-2.122-2.122Z" /></svg>);
const ExtractedDataIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1 inline-block"><path fillRule="evenodd" d="M1 4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4Zm12 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm1 3a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H8Z" clipRule="evenodd" /></svg>);

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [quickReplies, setQuickReplies] = useState([]);
  
  const location = useLocation();
  const [pageContext, setPageContext] = useState('home');

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // 1. Xác định ngữ cảnh trang (Thêm login)
  useEffect(() => {
    const path = location.pathname;
    // Gộp chung đăng ký và đăng nhập vào context 'register' (hỗ trợ tài khoản)
    if (path.includes('/register') || path.includes('/dang-ky') || path.includes('/login') || path.includes('/dang-nhap')) {
      setPageContext('register');
    } else if (path.includes('/lich') || path.includes('/dat-lich')) {
      setPageContext('appointment');
    } else if (path.includes('/don-thuoc') || path.includes('/hoso')) {
      setPageContext('prescription');
    } else {
      setPageContext('home');
    }
  }, [location]);

  // 2. Cập nhật lời chào và gợi ý
  useEffect(() => {
    if (isOpen) {
      let suggestions = [];
      let welcome = "";

      switch (pageContext) {
        case 'register':
          welcome = "Chào bạn! Tôi có thể hỗ trợ gì về Đăng nhập hoặc Đăng ký tài khoản không?";
          suggestions = ["Hướng dẫn đăng ký", "Quên mật khẩu", "Không đăng nhập được"];
          break;
        case 'appointment':
          welcome = "Chào bạn! Tôi có thể giúp bạn chọn Khoa khám phù hợp.";
          suggestions = ["Đau đầu khám khoa nào?", "Sốt cao nên đi đâu?", "Quy trình đặt lịch"];
          break;
        case 'prescription':
          welcome = "Chào bạn! Bạn cần giải thích về cách dùng thuốc phải không?";
          suggestions = ["Uống thuốc trước hay sau ăn?", "Quên uống thuốc phải làm sao?", "Tác dụng phụ"];
          break;
        default:
          welcome = "Xin chào! Tôi là Trợ lý Y tế ảo của bệnh viện. Tôi có thể giúp gì cho bạn?";
          suggestions = ["Đặt lịch khám", "Xem lịch khám", "Giờ làm việc"];
          break;
      }

      if (messages.length === 0) {
        setMessages([{ sender: "bot", text: welcome }]);
      }
      setQuickReplies(suggestions);
    }
  }, [isOpen, pageContext]);

  // Tự động cuộn
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Tải lịch sử chat
  const loadHistory = async () => {
    // Nếu đang ở trang login/register, KHÔNG tải lịch sử để tránh lỗi 401
    if (pageContext === 'register') return;

    try {
      setLoading(true);
      const res = await getHistory(); 
      const historyLogs = res.data || [];

      // Lọc bỏ tin nhắn hệ thống
      const historyMessages = historyLogs.flatMap((log) => [
        { sender: "user", text: log.message },
        { sender: "bot", text: log.reply, intent: log.intent, extractedData: null },
      ]).filter(msg => msg.text && !msg.text.includes("[User uploaded an image]"));

      if (historyMessages.length > 0) {
        setMessages(prev => {
            if (prev.length <= 1) return [...prev, ...historyMessages];
            return historyMessages;
        });
      }
    } catch (err) {
      // Lỗi 401 (chưa đăng nhập) là bình thường ở các trang public, không cần log error
      if (err.response && err.response.status !== 401) {
          console.error("Lỗi tải lịch sử:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Gọi load history khi mở lần đầu
  useEffect(() => { 
      if (isOpen) loadHistory(); 
  }, [isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = newMessage.trim();
    if (!text) return;
    await processMessage(text);
    setNewMessage("");
  };

  const handleQuickReplyClick = (text) => {
    processMessage(text);
  };

  const processMessage = async (text) => {
    if (loading) return;
    setMessages(prev => [...prev, { sender: "user", text }]);
    setLoading(true);
    setQuickReplies([]);

    try {
      const res = await sendMessage(text, pageContext);
      setMessages(prev => [...prev, { sender: "bot", text: res.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: "bot", text: "Xin lỗi, hệ thống đang bận." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Vui lòng chọn file ảnh.'); return; }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result;
      setMessages(prev => [...prev, { sender: "user", text: "Đã gửi ảnh...", image: base64 }]);
      setLoading(true);
      
      try {
        const res = await uploadImage(base64, "Trích xuất thông tin y tế", pageContext);
        setMessages(prev => [...prev, { 
            sender: "bot", 
            text: res.reply,
            intent: res.intent,
            extractedData: res.data 
        }]);
      } catch (err) {
        setMessages(prev => [...prev, { sender: "bot", text: "Lỗi xử lý ảnh." }]);
      } finally {
        setLoading(false);
        if(fileInputRef.current) fileInputRef.current.value = "";
      }
    };
  };

  return (
    <>
      <div className={`fixed bottom-24 right-5 w-80 md:w-96 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col transition-all duration-300 z-50 border border-gray-200 overflow-hidden ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}>
        
        {/* Header */}
        <div className="bg-teal-600 text-white p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-full text-teal-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <div>
              <h3 className="font-bold text-sm">Trợ lý Y tế</h3>
              <div className="flex items-center gap-1 text-xs text-teal-100">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Trực tuyến
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-teal-700 p-1 rounded"><CloseIcon /></button>
        </div>

        {/* Nội dung Chat */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              {msg.sender === "bot" && <DoctorIcon />}
              
              <div className={`mx-2 p-3 rounded-2xl max-w-[80%] text-sm shadow-sm whitespace-pre-wrap ${
                msg.sender === "user" 
                  ? "bg-teal-600 text-white rounded-br-none" 
                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
              }`}>
                {msg.image && <img src={msg.image} className="mb-2 rounded-lg max-h-40" alt="upload" />}
                {msg.text}

                {/* Hiển thị thông tin trích xuất nếu có */}
                {msg.extractedData && (
                  <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200 text-xs">
                    <p className="font-bold text-teal-700 mb-1"><ExtractedDataIcon/> Thông tin nhận diện:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      {msg.extractedData.hoTen && <li>Họ tên: {msg.extractedData.hoTen}</li>}
                      {msg.extractedData.ngaySinh && <li>Ngày sinh: {msg.extractedData.ngaySinh}</li>}
                      {msg.extractedData.gioiTinh && <li>Giới tính: {msg.extractedData.gioiTinh}</li>}
                      {msg.extractedData.diaChi && <li>Địa chỉ: {msg.extractedData.diaChi}</li>}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex items-center gap-2">
              <DoctorIcon />
              <div className="bg-gray-200 p-3 rounded-2xl rounded-bl-none flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Gợi ý */}
        {quickReplies.length > 0 && !loading && (
          <div className="px-4 py-2 bg-gray-50 flex gap-2 flex-wrap border-t border-gray-100">
            {quickReplies.map((reply, i) => (
              <button key={i} onClick={() => handleQuickReplyClick(reply)} className="text-xs bg-teal-50 text-teal-700 border border-teal-200 px-3 py-1 rounded-full hover:bg-teal-100 transition">
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="text-gray-400 hover:text-teal-600 p-2">
            <PaperClipIcon />
          </button>
          
          <input
            type="text"
            className="flex-1 bg-gray-100 text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Nhập câu hỏi..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading} className="text-teal-600 hover:text-teal-800 p-2 disabled:opacity-50">
            <SendIcon />
          </button>
        </form>
      </div>

      {/* Nút mở chat */}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 w-14 h-14 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 flex items-center justify-center transition-transform hover:scale-110 z-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </button>
      )}
    </>
  );
};

export default ChatbotWidget;
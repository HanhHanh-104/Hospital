import { io } from 'socket.io-client';

// URL của backend, Vite sẽ proxy qua /api, nhưng socket cần URL đầy đủ
const BACKEND_URL = 'http://localhost:4000'; 
let socket;

/**
 * Khởi tạo và kết nối socket với JWT
 */
export const connectSocket = () => {
  const rawToken = localStorage.getItem('token');
  if (rawToken && (!socket || !socket.connected)) {
    const token = rawToken.startsWith('Bearer ') ? rawToken : `Bearer ${rawToken}`;
    socket = io(BACKEND_URL, {
      // Gửi token qua handshake auth
      auth: {
        token
      }
    });

    socket.on('connect', () => {
      console.log('✅ Socket đã kết nối:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Lỗi kết nối Socket:', err.message);
      if (err.message.includes("Token không hợp lệ")) {
         // Xử lý logout...
      }
    });

    socket.on('chatError', (error) => {
      console.error('Lỗi từ server:', error.message);
    });
  }
};

/**
 * Ngắt kết nối socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('🔻 Socket đã ngắt kết nối.');
  }
};

// === HÀM GỬI SỰ KIỆN MỚI (REQUEST/ACCEPT/REJECT) ===

/**
 * Gửi yêu cầu bắt đầu chat (User A -> Server)
 * @param {string} receiverId - maTK của người nhận (User B)
 */
export const requestChat = (receiverId) => {
  if (socket && socket.connected) {
    socket.emit('requestChat', { receiverId });
  } else {
    console.error('❌ Socket không kết nối, không thể gửi requestChat.');
  }
};

/**
 * Mở lại phòng chat đã được chấp nhận/tạo (Gửi tín hiệu để server join phòng và load history)
 * @param {string} receiverId - maTK của người nhận (User B)
 */
export const openActiveRoom = (receiverId) => {
  if (socket && socket.connected) {
    socket.emit('openActiveRoom', { receiverId });
  } else {
     console.error('❌ Socket không kết nối, không thể gửi openActiveRoom.');
  }
};


/**
 * Chấp nhận yêu cầu chat (User B -> Server)
 * @param {string} requesterId - maTK của người gửi yêu cầu (User A)
 */
export const acceptChat = (requesterId) => {
  if (socket && socket.connected) {
    socket.emit('acceptChat', { requesterId });
  } else {
     console.error('❌ Socket không kết nối, không thể gửi acceptChat.');
  }
};

/**
 * Từ chối yêu cầu chat (User B -> Server)
 * @param {string} requesterId - maTK của người gửi yêu cầu (User A)
 */
export const rejectChat = (requesterId) => {
  if (socket && socket.connected) {
    socket.emit('rejectChat', { requesterId });
  } else {
     console.error('❌ Socket không kết nối, không thể gửi rejectChat.');
  }
};

/**
 * Gửi tin nhắn (Giữ nguyên)
 * @param {string} receiverId - maTK của người nhận
 * @param {string} message - Nội dung tin nhắn
 */
export const sendMessage = (receiverId, message) => {
  if (socket && socket.connected) {
    socket.emit('sendMessage', { receiverId, message });
  } else {
     console.error('❌ Socket không kết nối, không thể gửi tin nhắn.');
  }
};

// --- LẮNG NGHE CÁC SỰ KIỆN MỚI ---

/**
 * Lắng nghe yêu cầu chat mới (Server -> User B)
 */
export const onChatRequest = (callback) => {
  if (socket) {
    socket.on('chatRequest', (senderInfo) => {
      callback(senderInfo);
    });
  }
};

/**
 * Lắng nghe khi yêu cầu gửi thành công (Server -> User A)
 */
export const onRequestSent = (callback) => {
  if (socket) {
    socket.on('requestSent', (data) => {
      callback(data);
    });
  }
};

/**
 * Lắng nghe khi yêu cầu được chấp nhận (Server -> User A và B)
 */
export const onChatAccepted = (callback) => {
  if (socket) {
    socket.on('chatAccepted', (data) => {
      callback(data);
    });
  }
};

/**
 * Lắng nghe khi yêu cầu bị từ chối/hết hạn (Server -> User A)
 */
export const onChatRejected = (callback) => {
  if (socket) {
    socket.on('chatRejected', (data) => {
      callback(data);
    });
  }
};

/**
 * Lắng nghe khi chat hết hạn (15 phút) (Server -> User A và B)
 */
export const onChatExpired = (callback) => {
  if (socket) {
    socket.on('chatExpired', (data) => {
      callback(data);
    });
  }
};


// --- Lắng nghe các sự kiện chat thường ---

export const onReceiveMessage = (callback) => {
  if (socket) {
    socket.on('receiveMessage', (messageData) => {
      callback(messageData);
    });
  }
};

export const onRoomHistory = (callback) => {
  if (socket) {
    socket.on('roomHistory', (data) => {
      callback(data); 
    });
  }
};

export const onNewMessageNotification = (callback) => {
    if(socket) {
        socket.on('newMessageNotification', (notificationData) => {
            callback(notificationData);
        });
    }
};

// --- Hủy lắng nghe ---

export const offChatRequest = (callback) => { if (socket) { socket.off('chatRequest', callback); } };
export const offRequestSent = (callback) => { if (socket) { socket.off('requestSent', callback); } };
export const offChatAccepted = (callback) => { if (socket) { socket.off('chatAccepted', callback); } };
export const offChatRejected = (callback) => { if (socket) { socket.off('chatRejected', callback); } };
export const offChatExpired = (callback) => { if (socket) { socket.off('chatExpired', callback); } };

export const offReceiveMessage = (callback) => {
  if (socket) {
    socket.off('receiveMessage', callback);
  }
};

export const offRoomHistory = (callback) => {
  if (socket) {
    socket.off('roomHistory', callback);
  }
};

export const offNewMessageNotification = (callback) => {
    if(socket) {
        socket.off('newMessageNotification', callback);
    }
};
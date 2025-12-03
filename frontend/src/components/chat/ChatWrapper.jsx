import React, { useState, useEffect, useRef } from 'react';
import axiosClient from '../../api/axiosClient.js';
import {
  connectSocket,
  disconnectSocket,
  sendMessage,
  onReceiveMessage,
  onRoomHistory,
  onNewMessageNotification,
  offReceiveMessage,
  offRoomHistory,
  offNewMessageNotification,
  
  // === IMPORT CÁC HÀM MỚI ===
  requestChat,
  acceptChat,
  rejectChat,
  onChatRequest,
  onRequestSent,
  onChatAccepted,
  onChatRejected,
  onChatExpired,
  offChatRequest,
  offRequestSent,
  offChatAccepted,
  offChatRejected,
  offChatExpired,
  openActiveRoom
  // === END IMPORT MỚI ===
} from '../../services/chat/socketService.js'; 
import toast from 'react-hot-toast';

// --- Biểu tượng ---
const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 12.75c0 1.148.563 2.19 1.58 3.005a8.699 8.699 0 0 0 2.314 1.307L6.75 21l3.181-2.12c.676.096 1.367.145 2.069.145 4.97 0 9-2.784 9-6.25s-4.03-6.25-9-6.25-9 2.784-9 6.25z"
    />
  </svg>
);
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);
const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);


/**
 * Component ChatWrapper (chính)
 * Quản lý trạng thái chung của cửa sổ chat.
 */
const ChatWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [contacts, setContacts] = useState([]); // Toàn bộ danh bạ
  const [loadingContacts, setLoadingContacts] = useState(false);
  
  // Lấy vai trò user
  const userRole = localStorage.getItem("role"); 
  const maTK = localStorage.getItem("maTK");

  // FIX: Nếu không có mã tài khoản (chưa đăng nhập), KHÔNG render component này
  if (!maTK) return null; 

  // Quản lý các chế độ xem (view)
  const [currentView, setCurrentView] = useState(userRole === 'BENHNHAN' ? 'menu' : 'list'); 
  const [selectedContact, setSelectedContact] = useState(null); // Người đang chat

  // === STATE MỚI: Quản lý Yêu cầu Chat ===
  const [incomingRequests, setIncomingRequests] = useState([]); // Array of { maTK, tenDangNhap, maNhom }
  const [pendingTo, setPendingTo] = useState(null); // maTK của người mình đang chờ chấp nhận
  // === END STATE MỚI ===
  
  // === STATE: Quản lý tin nhắn chưa đọc ===
  const [unreadMessages, setUnreadMessages] = useState({}); // { maTK: count }
  // === END STATE ===

  const contactsRef = useRef(contacts);
  const selectedContactRef = useRef(selectedContact);
  const isOpenRef = useRef(isOpen);
  const currentViewRef = useRef(currentView);

  useEffect(() => { contactsRef.current = contacts; }, [contacts]);
  useEffect(() => { selectedContactRef.current = selectedContact; }, [selectedContact]);
  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);
  useEffect(() => { currentViewRef.current = currentView; }, [currentView]);
  
  // ✅ Đảm bảo khi selectedContact thay đổi, currentView được set thành 'chat'
  useEffect(() => {
    if (selectedContact && currentView !== 'chat') {
      setCurrentView('chat');
    }
  }, [selectedContact, currentView]);
  
  // ✅ Reset số đếm tin nhắn chưa đọc khi đang chat với contact này
  useEffect(() => {
    if (selectedContact?.maTK && currentView === 'chat') {
      setUnreadMessages((prev) => {
        const newUnread = { ...prev };
        delete newUnread[selectedContact.maTK];
        return newUnread;
      });
    }
  }, [selectedContact?.maTK, currentView]);

  useEffect(() => {
    if (!maTK) return;
    connectSocket();
    return () => {
      disconnectSocket();
    };
  }, [maTK]);

  useEffect(() => {
    if (!maTK) return;

    const handleNewMessageNotification = (notification) => {
      const { senderId, tenDangNhap } = notification;
      const isOpenSnapshot = isOpenRef.current;
      const selected = selectedContactRef.current;
      
      // ✅ Chỉ tăng số đếm nếu:
      // 1. Cửa sổ chat đóng HOẶC
      // 2. Đang mở nhưng không chat với người gửi
      if (!isOpenSnapshot || selected?.maTK !== senderId) {
        setUnreadMessages((prev) => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1
        }));
        
        // Hiển thị thông báo desktop nếu có quyền
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`Tin nhắn mới từ ${tenDangNhap}`, {
            body: notification.message || 'Bạn có tin nhắn mới',
            icon: '/favicon.ico',
            tag: `chat-${senderId}`
          });
        }
      }
      
      toast.success(`Tin nhắn mới từ ${tenDangNhap}`, { icon: '💬' });
    };

    const handleChatRequest = (senderInfo) => {
      setIncomingRequests((prev) => {
        if (prev.some((req) => req.maTK === senderInfo.maTK)) return prev;
        toast(`🔔 Yêu cầu chat mới từ ${senderInfo.tenDangNhap}`, { icon: '🤝' });
        return [...prev, senderInfo];
      });
    };

    const handleRequestSent = (data) => {
      setPendingTo(data.receiverId);
    };

    const handleChatAccepted = ({ roomName, partnerId }) => {
      setPendingTo(null);

      axiosClient
        .get('/chat/contacts')
        .then((res) => setContacts(res.data.data || []))
        .catch((err) => console.error('Lỗi tải lại danh bạ:', err));

      const selected = selectedContactRef.current;
      const contactsSnapshot = contactsRef.current;
      const isOpenSnapshot = isOpenRef.current;

      if (selected?.maTK === partnerId) {
        setSelectedContact((prev) => ({ ...prev, status: 'active', roomName }));
        openActiveRoom(partnerId);
        return;
      }

      const partnerContact =
        contactsSnapshot.find((c) => c.maTK === partnerId) || { maTK: partnerId, tenDangNhap: `User ID: ${partnerId}` };

      toast.success(`✅ Đã bắt đầu chat với ${partnerContact.tenDangNhap}`);

      if (!isOpenSnapshot) {
        setIsOpen(true);
      }

      setSelectedContact({ ...partnerContact, status: 'active', roomName });
      setCurrentView('chat');
    };

    const handleChatExpired = ({ message }) => {
      toast.error(message || "Cuộc trò chuyện đã hết hạn (15 phút). Vui lòng gửi yêu cầu chat mới.", { icon: '⏰' });
      
      // Cập nhật trạng thái contact thành expired
      const selected = selectedContactRef.current;
      if (selected) {
        setSelectedContact((prev) => ({ ...prev, status: 'expired' }));
      }
    };

    const handleChatRejected = ({ rejecterId, message }) => {
      setPendingTo(null);
      const selected = selectedContactRef.current;
      const contactsSnapshot = contactsRef.current;

      if (selected?.maTK === rejecterId) {
        setSelectedContact((prev) => ({ ...prev, status: 'rejected' }));
      }

      const contactName = contactsSnapshot.find((c) => c.maTK === rejecterId)?.tenDangNhap || rejecterId;
      toast.error(message || `❌ ${contactName} đã từ chối yêu cầu chat.`);
    };

    onNewMessageNotification(handleNewMessageNotification);
    onChatRequest(handleChatRequest);
    onRequestSent(handleRequestSent);
    onChatAccepted(handleChatAccepted);
    onChatRejected(handleChatRejected);
    onChatExpired(handleChatExpired);

    return () => {
      offNewMessageNotification(handleNewMessageNotification);
      offChatRequest(handleChatRequest);
      offRequestSent(handleRequestSent);
      offChatAccepted(handleChatAccepted);
      offChatRejected(handleChatRejected);
      offChatExpired(handleChatExpired);
    };
  }, [maTK]);

  // Load danh bạ (contacts) khi cửa sổ được mở HOẶC khi view thay đổi (để cập nhật danh bạ sau khi chấp nhận)
  useEffect(() => {
    if (isOpen) {
      // ✅ KHÔNG reset view nếu đang ở view 'chat' hoặc có selectedContact
      // Nếu có selectedContact, đảm bảo view là 'chat'
      if (selectedContact) {
        if (currentView !== 'chat') {
          setCurrentView('chat');
        }
        // Đang chat, không reset view và không load lại danh bạ
        return;
      }
      
      if (currentView === 'chat') {
        // Nếu view là 'chat' nhưng không có selectedContact, reset về menu/list
        if (userRole === 'BENHNHAN') {
          setCurrentView('menu');
        } else {
          setCurrentView('list');
        }
        return;
      }
      
      if (userRole === 'BENHNHAN') {
        // Chỉ đặt lại Menu nếu không có yêu cầu chat nào đang chờ
        if (incomingRequests.length === 0) {
            setCurrentView('menu');
        } else {
             // Giữ view ở 'list' hoặc trạng thái khác 'menu' để hiển thị IncomingRequestsList
             setCurrentView('list');
        }
      } else if (userRole !== 'BENHNHAN' && currentView === 'list_yta') {
        setCurrentView('list');
      }

      // Chỉ tải danh bạ nếu chưa có hoặc nếu view là menu/list/list_yta
      if (contacts.length === 0 || currentView !== 'chat') { 
        setLoadingContacts(true);
        // FIX: Đảm bảo kiểm tra userRole trước khi gọi API chat
        if (maTK) {
            axiosClient.get('/chat/contacts')
            .then(res => {
                setContacts(res.data.data || []);
            })
            .catch(err => console.error("Lỗi tải danh bạ:", err))
            .finally(() => setLoadingContacts(false));
        } else {
             setLoadingContacts(false);
        }
      }
    }
  }, [isOpen, userRole, currentView, incomingRequests.length, maTK, selectedContact]); // Thêm selectedContact vào dependency
  
  // Hàm xử lý khi chọn một contact từ danh bạ
  const handleSelectContactForRequest = (contact) => {
    // ✅ Kiểm tra xem có cần gửi yêu cầu không
    // Chỉ bệnh nhân chat với admin/y tá mới cần gửi yêu cầu
    const isBenhNhan = userRole === 'BENHNHAN';
    const isContactAdminOrYTa = contact.maNhom === 'ADMIN' || 
                                 (contact.maNhom === 'NHANSU' && contact.NhanSuYTe?.loaiNS === 'YT');
    
    // ✅ Set cả selectedContact và currentView cùng lúc để tránh useEffect reset
    if (isBenhNhan && isContactAdminOrYTa) {
      // Bệnh nhân chat với admin/y tá: trạng thái 'new' (cần gửi yêu cầu)
      setSelectedContact({ ...contact, status: 'new' }); 
      setCurrentView('chat');
    } else {
      // Admin/y tá chat với bệnh nhân hoặc các trường hợp khác: tự động tạo phòng
      setSelectedContact({ ...contact, status: 'active' }); 
      setCurrentView('chat');
      // Tự động mở phòng (sẽ tự động tạo phòng ở backend)
      requestChat(contact.maTK);
    }
  };
  
  // Hàm xử lý chấp nhận yêu cầu từ người khác
  const handleAcceptRequest = (requesterId, requesterName) => {
    // 1. Gửi chấp nhận
    acceptChat(requesterId);
    // 2. Cập nhật UI
    const requesterContact = incomingRequests.find(req => req.maTK === requesterId) || { maTK: requesterId, tenDangNhap: requesterName };
    setSelectedContact({ ...requesterContact, status: 'active' });
    setIncomingRequests(prev => prev.filter(req => req.maTK !== requesterId));
    setCurrentView('chat');
  };
  
  const handleRejectRequest = (requesterId) => {
    rejectChat(requesterId);
    setIncomingRequests(prev => prev.filter(req => req.maTK !== requesterId));
  };

  // Logic điều hướng (navigation) bên trong cửa sổ chat
  const renderCurrentView = () => {
    
    // 0. Tab Yêu cầu đang chờ (ƯU TIÊN TUYỆT ĐỐI)
    // Nếu có yêu cầu đến, luôn hiển thị danh sách yêu cầu
    if (incomingRequests.length > 0) {
        return (
             <IncomingRequestsList 
                requests={incomingRequests} 
                onAccept={handleAcceptRequest}
                onReject={handleRejectRequest}
                // Nếu quay lại từ IncomingRequestsList, quay lại Menu (BN) hoặc Danh bạ (Staff/Admin)
                onBack={() => setCurrentView(userRole === 'BENHNHAN' ? 'menu' : 'list')}
            />
        );
    }
    
    // 1. Đang chat
    if (currentView === 'chat' && selectedContact) {
      return (
        <ChatWindow
          contact={selectedContact}
          userRole={userRole} // Truyền vai trò vào để xử lý timeout
          pendingTo={pendingTo} // Truyền trạng thái pending
          onBack={() => {
            // Quay lại menu (nếu là BN) hoặc danh bạ (nếu là staff/admin)
            const previousView = userRole === 'BENHNHAN' ? 'menu' : 'list';
            setCurrentView(previousView);
            setSelectedContact(null);
          }}
          // Truyền các hàm chat request/openActiveRoom vào
          onRequestChat={() => requestChat(selectedContact.maTK)}
          onOpenActiveRoom={() => openActiveRoom(selectedContact.maTK)}
        />
      );
    }
    
    // 2. Bệnh nhân: Xem Menu Phím 1/2
    else if (userRole === 'BENHNHAN' && currentView === 'menu') {
        return (
            <MainMenu
                contacts={contacts}
                loading={loadingContacts}
                onSelectAdmin={(adminContact) => {
                    handleSelectContactForRequest(adminContact);
                }}
                onSelectYtaList={() => {
                    setCurrentView('list_yta'); // Chuyển sang xem danh sách Y tá
                }}
            />
        );
    }

    // 3. Bệnh nhân: Xem danh sách Y tá (sau khi bấm phím 2)
    else if (userRole === 'BENHNHAN' && currentView === 'list_yta') {
        // Lọc chỉ Y tá từ danh bạ (Backend đã lọc, nhưng an toàn hơn)
        const ytaList = contacts.filter(c => c.maNhom === 'NHANSU' && c.NhanSuYTe?.loaiNS === 'YT');
        return (
             <ChatList
                title="Y tá & Trợ lý"
                contacts={ytaList}
                loading={loadingContacts}
                onSelectContact={(contact) => {
                    handleSelectContactForRequest(contact);
                }}
                onBack={() => setCurrentView('menu')} // Nút quay lại Menu
            />
        );
    }

    // 4. Admin/Bác sĩ/Nhân viên: Xem toàn bộ danh bạ
    else if (userRole !== 'BENHNHAN' && currentView === 'list') {
         return (
            <ChatList
                title="Danh bạ"
                contacts={contacts}
                loading={loadingContacts}
                onSelectContact={(contact) => {
                    handleSelectContactForRequest(contact);
                }}
                // Admin/Staff không có nút "quay lại" từ danh bạ
            />
        );
    }

    // Mặc định (hoặc đang tải)
    return <div className="w-full h-full flex items-center justify-center text-gray-500">Đang tải...</div>;
  };

  return (
    <>
      {/* Cửa sổ Chat */}
      <div
        className={`fixed bottom-32 right-5 w-80 h-[450px] bg-white rounded-lg shadow-xl flex flex-col transition-all duration-300 z-50 ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg shadow">
          <h3 className="font-bold text-lg">
            {selectedContact ? `Chat với ${selectedContact.tenDangNhap}` : 'Hỗ trợ nội bộ'}
          </h3>
          <div className="flex items-center gap-2">
            {/* ✅ Badge hiển thị số tin nhắn chưa đọc từ contact hiện tại */}
            {selectedContact && unreadMessages[selectedContact.maTK] > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                {unreadMessages[selectedContact.maTK]} tin nhắn mới
              </span>
            )}
            {/* Nút yêu cầu đang chờ */}
            {incomingRequests.length > 0 && currentView !== 'chat' && (
                // Sửa: Khi click vào nút này, chuyển view để hiển thị danh sách yêu cầu
                <button
                    onClick={() => {
                        setIsOpen(true);
                        setCurrentView('list'); // Chuyển sang view ưu tiên kiểm tra incomingRequests
                    }}
                    className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse"
                >
                    🔔 {incomingRequests.length} Yêu cầu
                </button>
            )}
            <button onClick={() => setIsOpen(false)} className="hover:opacity-75">
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Body (Nội dung thay đổi theo 'currentView') */}
        <div className="flex-1 flex overflow-hidden">
          {renderCurrentView()}
        </div>
      </div>

      {/* Nút Bong Bóng Chat */}
      <button
        onClick={() => {
          setIsOpen(prev => !prev);
          // ✅ Reset số đếm tin nhắn chưa đọc khi mở cửa sổ chat
          if (!isOpen) {
            setUnreadMessages({});
          }
        }}
        className="fixed bottom-24 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50 relative"
        aria-label="Mở chat nội bộ"
      >
        <ChatIcon />
        {/* ✅ Badge hiển thị tổng số (yêu cầu + tin nhắn chưa đọc) */}
        {(incomingRequests.length > 0 || Object.values(unreadMessages).reduce((sum, count) => sum + count, 0) > 0) && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            {incomingRequests.length + Object.values(unreadMessages).reduce((sum, count) => sum + count, 0)}
          </span>
        )}
      </button>
    </>
  );
};


/**
 * Component ChatWindow (Cần phải định nghĩa để ChatWrapper hoạt động)
 */
const ChatWindow = ({ contact, pendingTo, onBack, onRequestChat, onOpenActiveRoom, userRole }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [roomName, setRoomName] = useState(null);
    const [isActive, setIsActive] = useState(contact.status === 'active');
    const messagesEndRef = useRef(null);
    const maTK = localStorage.getItem("maTK");
    
    // ✅ Kiểm tra xem có cần hiển thị nút "Gửi yêu cầu" không
    // Chỉ bệnh nhân mới có thể gửi yêu cầu chat tới admin/y tá
    const isBenhNhan = userRole === 'BENHNHAN';
    const isContactAdminOrYTa = contact.maNhom === 'ADMIN' || 
                                 (contact.maNhom === 'NHANSU' && contact.NhanSuYTe?.loaiNS === 'YT');
    const canShowRequestButton = isBenhNhan && isContactAdminOrYTa;
    
    // Tải lịch sử phòng khi component mount/contact thay đổi
    useEffect(() => {
        // Nếu trạng thái là 'new', không tải lịch sử, chỉ chờ gửi request
        if (contact.status === 'new') {
            setIsActive(false);
            setRoomName(null);
            setMessages([]);
            return; 
        }
        
        // Nếu là trạng thái 'active', yêu cầu mở phòng
        if (contact.status === 'active') {
            onOpenActiveRoom();
        }
        
        const handleRoomHistory = ({ room, history, trangThai, message, thoiGianBatDauChat }) => {
            // Chỉ cập nhật nếu room thuộc về contact hiện tại
            if (room) {
                setRoomName(room);
                // Nếu trạng thái là EXPIRED, không set active
                if (trangThai === 'EXPIRED') {
                    setIsActive(false);
                } else {
                    setIsActive(true);
                }
            }
            setMessages(history || []);
            
            // Nếu có thông báo hết hạn, hiển thị
            if (trangThai === 'EXPIRED' && message) {
                toast.error(message, { icon: '⏰' });
            }
            
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
            }, 100);
        };

        const handleReceiveMessage = (messageData) => {
            // Chỉ thêm tin nhắn nếu thuộc về phòng hiện tại hoặc từ contact hiện tại
            if (messageData.room === roomName || 
                messageData.senderId === contact.maTK || 
                messageData.receiverId === contact.maTK) {
                setMessages(prev => {
                    // Tránh trùng lặp tin nhắn
                    const exists = prev.some(msg => msg.id === messageData.id);
                    if (exists) return prev;
                    return [...prev, messageData];
                });
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        };
        
        onRoomHistory(handleRoomHistory);
        onReceiveMessage(handleReceiveMessage);

        return () => {
            // Clear listeners when unmounting
            offRoomHistory(handleRoomHistory);
            offReceiveMessage(handleReceiveMessage);
        };
    }, [contact.maTK, contact.status, onOpenActiveRoom, roomName]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        const msg = inputMessage.trim();
        if (msg && isActive) {
            sendMessage(contact.maTK, msg);
            setInputMessage('');
        }
    };
    
    const statusText = isActive 
        ? "✅ Đã kết nối" 
        : contact.status === 'expired'
            ? "⏰ Cuộc trò chuyện đã hết hạn (15 phút). Vui lòng gửi yêu cầu chat mới."
        : pendingTo === contact.maTK 
            ? "⏳ Đang chờ chấp nhận..." 
            : contact.status === 'rejected'
                ? "❌ Đã bị từ chối" 
                : "💡 Bấm Gửi Yêu Cầu để bắt đầu.";
                
    const statusClass = isActive 
        ? "bg-green-100 text-green-700" 
        : contact.status === 'expired'
            ? "bg-red-100 text-red-700"
        : pendingTo === contact.maTK 
            ? "bg-yellow-100 text-yellow-700" 
            : "bg-gray-100 text-gray-500";


    return (
        <div className="w-full h-full flex flex-col">
            {/* Header chat window */}
            <div className="p-3 border-b flex items-center space-x-2 flex-shrink-0">
                <button onClick={onBack} className="text-gray-600 hover:text-blue-600">
                    <BackIcon />
                </button>
                <div className="font-bold text-gray-800">{contact.tenDangNhap}</div>
            </div>
            
            {/* Status bar */}
            <div className={`p-2 text-xs font-medium border-b ${statusClass} flex-shrink-0`}>
                {statusText}
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.senderId === maTK ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`p-2 px-3 rounded-xl max-w-[80%] text-sm ${
                            msg.senderId === maTK 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-800'
                        }`}>
                           {/* Hiển thị tên người gửi nếu không phải mình */}
                           {msg.senderId !== maTK && <span className="font-bold text-xs block mb-0.5">{msg.Sender?.tenDangNhap || contact.tenDangNhap}</span>}
                           {msg.message}
                            <span className="text-[10px] opacity-70 block text-right mt-1">
                                {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 border-t flex-shrink-0">
                {!isActive && pendingTo !== contact.maTK && (contact.status === 'new' || contact.status === 'expired') && canShowRequestButton ? (
                     <button
                        type="button"
                        onClick={onRequestChat}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        {contact.status === 'expired' ? '🔄 Gửi Yêu Cầu Chat Mới' : '🤝 Gửi Yêu Cầu Trò Chuyện'}
                    </button>
                ) : !isActive && !canShowRequestButton ? (
                    // Admin/y tá chat với bệnh nhân: tự động tạo phòng, không cần nút yêu cầu
                    <div className="text-center text-sm text-gray-500 py-2">
                        Đang kết nối...
                    </div>
                ) : (
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder={isActive ? "Nhập tin nhắn..." : "Chờ chấp nhận..."}
                            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
                            disabled={!isActive}
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                            disabled={!isActive || inputMessage.trim().length === 0}
                        >
                            Gửi
                        </button>
                    </div>
                )}
               
            </form>
        </div>
    );
};


// === COMPONENT MỚI: DANH SÁCH YÊU CẦU ĐẾN (CẦN THIẾT CHO NÚT CHẤP NHẬN) ===
const IncomingRequestsList = ({ requests, onAccept, onReject, onBack }) => {
  const userRole = localStorage.getItem("role");
  
  return (
    <div className="w-full h-full p-3 flex flex-col overflow-y-auto">
        {/* Nút quay lại chỉ hiển thị nếu không phải là Bệnh nhân (vì BN bắt đầu từ Menu) */}
        {userRole !== 'BENHNHAN' && (
             <button
                onClick={onBack}
                className="p-3 border-b text-blue-600 hover:bg-gray-100 flex items-center space-x-2 w-full flex-shrink-0"
             >
                <BackIcon />
                <span>Quay lại Danh bạ</span>
             </button>
        )}
        
      <h3 className="text-lg font-bold text-red-600 mb-4 mt-2">🔔 {requests.length} Yêu cầu chat mới</h3>
      <div className="space-y-3">
        {requests.map(req => (
          <div key={req.maTK} className="bg-red-50 p-3 rounded-lg border border-red-200">
            <p className="font-semibold text-gray-800">{req.tenDangNhap} ({req.maNhom})</p>
            <div className="flex justify-between gap-2 mt-2">
              <button
                onClick={() => onAccept(req.maTK, req.tenDangNhap)}
                className="flex-1 bg-green-500 text-white text-sm py-1 rounded hover:bg-green-600"
              >
                Chấp nhận
              </button>
              <button
                onClick={() => onReject(req.maTK)}
                className="flex-1 bg-gray-500 text-white text-sm py-1 rounded hover:bg-gray-600"
              >
                Từ chối
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


/**
 * Component MainMenu (IVR cho Bệnh nhân)
 */
const MainMenu = ({ contacts, loading, onSelectAdmin, onSelectYtaList }) => {
  
  const handleSelectAdmin = () => {
    const adminContact = contacts.find(c => c.maNhom === 'ADMIN');
    if (adminContact) {
      onSelectAdmin(adminContact);
    } else {
      toast.error("Không tìm thấy tài khoản Admin để chat.");
    }
  };

  const handleSelectYta = () => {
    const ytaContacts = contacts.filter(c => c.maNhom === 'NHANSU' && c.NhanSuYTe?.loaiNS === 'YT');
    if (ytaContacts.length > 0) {
      onSelectYtaList(ytaContacts); // Báo cho cha là cần chuyển view
    } else {
      toast.error("Hiện không có Y tá/Trợ lý nào trong danh bạ.");
    }
  };
  
  if (loading) return <p className="p-4 text-center text-gray-500">Đang tải danh bạ...</p>;

  return (
    <div className="w-full h-full p-6 flex flex-col items-center justify-center space-y-4">
      <p className="text-lg font-semibold text-gray-700 text-center">Vui lòng chọn một tùy chọn:</p>
      <button
        onClick={handleSelectAdmin}
        className="w-full p-4 bg-blue-500 text-white rounded-lg font-bold text-lg hover:bg-blue-600 transition-all"
      >
        Phím 1: Chat với Admin
      </button>
      <button
        onClick={handleSelectYta}
        className="w-full p-4 bg-green-500 text-white rounded-lg font-bold text-lg hover:bg-green-600 transition-all"
      >
        Phím 2: Chat với Y tá / Trợ lý
      </button>
    </div>
  );
};


/**
 * Component ChatList (Hiển thị danh bạ)
 */
const ChatList = ({ title, contacts, loading, onSelectContact, onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContacts = contacts.filter(c => 
    c.tenDangNhap.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Nút quay lại (nếu có) */}
      {onBack && (
        <button
          onClick={onBack}
          className="p-3 border-b text-blue-600 hover:bg-gray-100 flex items-center space-x-2 w-full flex-shrink-0"
        >
          <BackIcon />
          <span>Quay lại Menu</span>
        </button>
      )}
      
      <div className="p-3 border-b flex-shrink-0">
          <input 
            type="text" 
            placeholder={`Tìm kiếm ${title.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
          />
      </div>

      {loading && <p className="p-4 text-center text-gray-500">Đang tải...</p>}
      
      <ul className="divide-y divide-gray-200 overflow-y-auto flex-1">
          {filteredContacts.map(contact => (
            <li
                key={contact.maTK}
                onClick={() => onSelectContact(contact)}
                className="p-3 flex items-center space-x-3 hover:bg-gray-100 cursor-pointer"
            >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
                  ${contact.maNhom === 'ADMIN' ? 'bg-blue-200 text-blue-700' :
                    contact.maNhom === 'BENHNHAN' ? 'bg-red-200 text-red-700' :
                    contact.maNhom === 'BACSI' ? 'bg-purple-200 text-purple-700' :
                    'bg-green-200 text-green-700' // NHANSU
                  }`}
                >
                  {contact.tenDangNhap[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold">{contact.tenDangNhap}</div>
                  <div className="text-sm text-gray-500">
                    {contact.maNhom === 'NHANSU' ? `Nhân viên (${contact.NhanSuYTe?.loaiNS || 'N/A'})` : contact.maNhom}
                  </div>
                </div>
            </li>
          ))}
      </ul>
    </div>
  );
};


export default ChatWrapper;
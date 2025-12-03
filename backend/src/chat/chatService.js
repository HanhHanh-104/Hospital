const db = require("../models");
const { Op } = require("sequelize");

// Tải các model cần thiết
const ChatMessages = db.ChatMessages;
const ChatRooms = db.ChatRooms;
const TaiKhoan = db.TaiKhoan;
const BacSi = db.BacSi;
const NhanSuYTe = db.NhanSuYTe;
const BenhNhan = db.BenhNhan;

/**
 * Helper tạo tên phòng 1-1
 */
const getRoomName = (id1, id2) => {
    return [id1, id2].sort().join('_');
};

/**
 * TÌM phòng chat (không tạo mới nếu chưa tồn tại)
 */
const findRoom = async (user1Id, user2Id) => {
    const roomName = getRoomName(user1Id, user2Id);
    return ChatRooms.findOne({ where: { roomName } });
};

/**
 * Kiểm tra xem chat có còn trong thời gian 15 phút không
 */
const isChatActive = (room) => {
    if (!room || room.trangThai !== 'ACTIVE' || !room.thoiGianBatDauChat) {
        return false;
    }
    const startTime = new Date(room.thoiGianBatDauChat);
    const now = new Date();
    const diffMs = now - startTime;
    const diffMins = diffMs / (1000 * 60);
    return diffMins < 15; // Còn trong 15 phút
};

/**
 * TẠO phòng chat (chỉ sau khi chấp nhận - nếu chưa tồn tại)
 */
const createRoom = async (user1Id, user2Id, thoiGianBatDauChat = null) => {
    const roomName = getRoomName(user1Id, user2Id);
    let room = await ChatRooms.findOne({ where: { roomName } });
    if (!room) {
        const sortedIds = [user1Id, user2Id].sort();
        room = await ChatRooms.create({
            roomName,
            user1Id: sortedIds[0],
            user2Id: sortedIds[1],
            trangThai: 'ACTIVE',
            thoiGianBatDauChat: thoiGianBatDauChat || new Date()
        });
    } else {
        // Cập nhật trạng thái và thời gian bắt đầu nếu đang PENDING hoặc EXPIRED
        if (room.trangThai === 'PENDING' || room.trangThai === 'EXPIRED') {
            await ChatRooms.update({
                trangThai: 'ACTIVE',
                thoiGianBatDauChat: thoiGianBatDauChat || new Date()
            }, { where: { roomName } });
            room.trangThai = 'ACTIVE';
            room.thoiGianBatDauChat = thoiGianBatDauChat || new Date();
        }
    }
    return room.roomName;
};

/**
 * Lưu tin nhắn vào CSDL
 */
const saveMessage = async ({ room, senderId, receiverId, message }) => {
  try {
    const msg = await ChatMessages.create({
      room,
      senderId,
      receiverId,
      message
    });
    // Cập nhật trường 'updatedAt' của phòng chat để sắp xếp
    await ChatRooms.update({ updatedAt: new Date() }, { where: { roomName: room } });
    return msg;
  } catch (error) {
    console.error("Lỗi lưu tin nhắn:", error);
    return null;
  }
};

/**
 * Lấy lịch sử tin nhắn của một phòng
 */
const getRoomHistory = async (roomName) => {
  return await ChatMessages.findAll({
    where: { room: roomName },
    order: [['timestamp', 'ASC']],
    include: [
      { model: TaiKhoan, as: 'Sender', attributes: ['tenDangNhap', 'maTK'] }
    ]
  });
};

const getContacts = async (user) => {
    const { maTK, maNhom, loaiNS } = user;
    let contacts = [];

    // Cấu hình chung
    const attributes = ['maTK', 'tenDangNhap', 'maNhom'];
    const includeNhanSuYTe = [{
        model: NhanSuYTe,
        attributes: ['loaiNS'],
        required: false
    }];

    // Helper queries (Hàm truy vấn phụ)
    const getAdmin = () => TaiKhoan.findOne({ 
        where: { maNhom: 'ADMIN', maTK: { [Op.ne]: maTK } }, 
        attributes 
    });
    
    const getAllStaff = () => TaiKhoan.findAll({ 
        where: { maNhom: { [Op.in]: ['BACSI', 'NHANSU'] }, maTK: { [Op.ne]: maTK } }, 
        attributes, 
        include: includeNhanSuYTe
    });

    const getAllPatients = () => TaiKhoan.findAll({ 
        where: { maNhom: 'BENHNHAN' }, 
        attributes 
    });

    // === Logic dựa trên vai trò ===

    if (maNhom === 'ADMIN') {
        // Admin thấy EVERYONE (Staff + Patients)
        const staff = await getAllStaff();
        const patients = await getAllPatients();
        contacts = [...staff, ...patients];
    } 
    else if (maNhom === 'BENHNHAN') {
        // Bệnh nhân thấy Admin + Y tá
        
        // 1. Lấy Admin
        const admin = await getAdmin();
        if (admin) contacts.push(admin);

        // 2. Lấy Y tá (YT)
        const ytaListRaw = await NhanSuYTe.findAll({ 
            where: { loaiNS: 'YT' }, // Chỉ lấy Y Tá
            include: [{
                model: TaiKhoan,
                attributes: attributes, // Lấy các cột 'maTK', 'tenDangNhap', 'maNhom'
                required: true // Đảm bảo chỉ lấy NSYT có tài khoản
            }]
        });
        
        // Lấy đối tượng TaiKhoan từ kết quả
        const ytaAccounts = ytaListRaw.map(ns => ({
             ...ns.TaiKhoan.dataValues,
             NhanSuYTe: { loaiNS: 'YT' } // Thêm lại thông tin loaiNS
        })).filter(Boolean);
        contacts.push(...ytaAccounts);
    } 
    else if (maNhom === 'BACSI') {
        // Bác sĩ thấy Admin, Staff khác (Nội bộ) + Bệnh nhân (Hỗ trợ)
        const admin = await getAdmin();
        if (admin) contacts.push(admin);

        const staff = await getAllStaff();
        const patients = await getAllPatients();
        contacts = [...contacts, ...staff, ...patients];
    }
    else if (maNhom === 'NHANSU') {
        // Admin luôn thấy
        const admin = await getAdmin();
        if (admin) contacts.push(admin);
        
        // Y tá (YT) thấy Staff khác (Nội bộ) + Bệnh nhân (Hỗ trợ)
        if (loaiNS === 'YT') {
            const staff = await getAllStaff();
            const patients = await getAllPatients();
            contacts = [...contacts, ...staff, ...patients];
        } 
        // Other Staff (XN, TN...) chỉ thấy Admin + Staff khác (Nội bộ)
        else {
            const staff = await getAllStaff();
            contacts = [...contacts, ...staff];
        }
    }

    // Lọc trùng lặp và loại bỏ chính mình
    const uniqueContacts = Array.from(new Map(contacts.map(c => [c.maTK, c])).values());
    return uniqueContacts.filter(c => c && c.maTK !== user.maTK);
};

/**
 * Lấy danh sách các phòng chat của user (các cuộc hội thoại đã có)
 */
const getUserRooms = async (userId) => {
    try {
        const rooms = await ChatRooms.findAll({
            where: {
                [Op.or]: [
                    { user1Id: userId },
                    { user2Id: userId }
                ]
            },
            include: [
                {
                    model: TaiKhoan,
                    as: 'User1',
                    attributes: ['maTK', 'tenDangNhap', 'maNhom']
                },
                {
                    model: TaiKhoan,
                    as: 'User2',
                    attributes: ['maTK', 'tenDangNhap', 'maNhom']
                }
            ],
            order: [['updatedAt', 'DESC']]
        });

        // Chuyển đổi để trả về thông tin đối tác (partner) cho mỗi phòng
        return rooms.map(room => {
            const partner = room.user1Id === userId ? room.User2 : room.User1;
            return {
                roomName: room.roomName,
                partner: partner ? {
                    maTK: partner.maTK,
                    tenDangNhap: partner.tenDangNhap,
                    maNhom: partner.maNhom
                } : null,
                updatedAt: room.updatedAt
            };
        });
    } catch (error) {
        console.error("Lỗi lấy danh sách phòng chat:", error);
        return [];
    }
};

module.exports = {
  findRoom,
  createRoom,
  saveMessage,
  getRoomHistory,
  getContacts,
  getUserRooms,
  isChatActive
};
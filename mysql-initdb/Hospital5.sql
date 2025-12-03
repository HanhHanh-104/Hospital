-- Đặt mã hóa UTF-8 ngay từ đầu
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- 1. Tạo database với mã hóa UTF-8
CREATE DATABASE IF NOT EXISTS Hospital5 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE Hospital5;

-- 2. Các bảng KHÔNG có phụ thuộc khóa ngoại
CREATE TABLE IF NOT EXISTS NhomQuyen (
    maNhom VARCHAR(100) PRIMARY KEY,
    tenNhom VARCHAR(50) NOT NULL UNIQUE,
    moTa VARCHAR(255)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS KhoaPhong (
    maKhoa VARCHAR(100) PRIMARY KEY,
    tenKhoa VARCHAR(100) NOT NULL,
    moTa TEXT
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS CaKham (
    maCa VARCHAR(100) PRIMARY KEY,
    tenCa VARCHAR(50) NOT NULL,
    thoiGianBatDau TIME NOT NULL,
    thoiGianKetThuc TIME NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS NhomThuoc (
    maNhom VARCHAR(100) PRIMARY KEY,
    tenNhom VARCHAR(100) NOT NULL,
    moTa TEXT
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS DonViTinh (
    maDVT VARCHAR(100) PRIMARY KEY,
    tenDVT VARCHAR(20) NOT NULL,
    moTa VARCHAR(100)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS LoaiXetNghiem (
    maLoaiXN VARCHAR(100) PRIMARY KEY,
    tenLoai VARCHAR(100) NOT NULL,
    moTa TEXT
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3. Các bảng phụ thuộc MỨC 1
CREATE TABLE IF NOT EXISTS TaiKhoan (
    maTK VARCHAR(100) PRIMARY KEY,
    tenDangNhap VARCHAR(50) UNIQUE NOT NULL,
    matKhau VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    trangThai TINYINT(1) DEFAULT 1,
    maNhom VARCHAR(100) NOT NULL,
    publicKey TEXT,
    privateKey TEXT, 
    FOREIGN KEY (maNhom) REFERENCES NhomQuyen(maNhom)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS Thuoc (
    maThuoc VARCHAR(100) PRIMARY KEY,
    tenThuoc VARCHAR(150) NOT NULL,
    tenHoatChat VARCHAR(150) NOT NULL,
    hamLuong VARCHAR(50),
    maDVT VARCHAR(100) NOT NULL,
    maNhom VARCHAR(100) NOT NULL,
    soDangKy VARCHAR(50),
    nuocSanXuat VARCHAR(100),
    hangSanXuat VARCHAR(100),
    giaNhap DECIMAL(12,2) NOT NULL,
    giaBanLe DECIMAL(12,2) NOT NULL,
    giaBanBuon DECIMAL(12,2),
    tonKhoToiThieu INT DEFAULT 0,
    tonKhoHienTai INT DEFAULT 0,
    hanSuDung DATE,
    trangThai TINYINT(1) DEFAULT 1,
    FOREIGN KEY (maDVT) REFERENCES DonViTinh(maDVT),
    FOREIGN KEY (maNhom) REFERENCES NhomThuoc(maNhom)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS XetNghiem (
    maXN VARCHAR(100) PRIMARY KEY,
    maLoaiXN VARCHAR(100) NOT NULL,
    tenXN VARCHAR(100) NOT NULL,
    chiPhi DECIMAL(12,2) NOT NULL,
    thoiGianTraKetQua VARCHAR(100),
    FOREIGN KEY (maLoaiXN) REFERENCES LoaiXetNghiem(maLoaiXN)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 4. Các bảng phụ thuộc MỨC 2
CREATE TABLE IF NOT EXISTS BacSi (
    maBS VARCHAR(100) PRIMARY KEY,
    maTK VARCHAR(100) UNIQUE NOT NULL,
    maKhoa VARCHAR(100) NOT NULL,
    hoTen VARCHAR(100) NOT NULL,
    chuyenMon VARCHAR(100),
    chucVu VARCHAR(100),
    trinhDo VARCHAR(50),
    capBac VARCHAR(50) DEFAULT 'Bác sĩ điều trị' COMMENT 'Cấp bậc bác sĩ: Bác sĩ thực tập, Bác sĩ sơ cấp, Bác sĩ điều trị, BSCK I, BSCK II, Thạc sĩ, Tiến sĩ, PGS, GS',
    FOREIGN KEY (maTK) REFERENCES TaiKhoan(maTK),
    FOREIGN KEY (maKhoa) REFERENCES KhoaPhong(maKhoa)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS NhanSuYTe (
    maNS VARCHAR(100) PRIMARY KEY,
    maTK VARCHAR(100) UNIQUE NOT NULL,
    maKhoa VARCHAR(100),
    hoTen VARCHAR(100) NOT NULL,
    loaiNS VARCHAR(20) NOT NULL,
    chuyenMon VARCHAR(100),
    capBac VARCHAR(50),
    FOREIGN KEY (maTK) REFERENCES TaiKhoan(maTK),
    FOREIGN KEY (maKhoa) REFERENCES KhoaPhong(maKhoa)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS BenhNhan (
    maBN VARCHAR(100) PRIMARY KEY,
    maTK VARCHAR(100) UNIQUE,
    hoTen VARCHAR(100) NOT NULL,
    ngaySinh DATE,
    gioiTinh VARCHAR(10),
    diaChi VARCHAR(255),
    soDienThoai VARCHAR(15),
    bhyt VARCHAR(20),
    FOREIGN KEY (maTK) REFERENCES TaiKhoan(maTK)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ThongTinDuocLy (
    maTTDL VARCHAR(100) PRIMARY KEY,
    maThuoc VARCHAR(100) NOT NULL,
    tacDungChinh TEXT NOT NULL,
    chiDinh TEXT,
    chongChiDinh TEXT,
    tacDungPhu TEXT,
    tuongTacThuoc TEXT,
    canhBao TEXT,
    doiTuongSuDung TEXT,
    cachDung TEXT,
    baoQuan TEXT,
    FOREIGN KEY (maThuoc) REFERENCES Thuoc(maThuoc)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ThanhPhanThuoc (
    maThanhPhan VARCHAR(100) PRIMARY KEY,
    maThuoc VARCHAR(100) NOT NULL,
    tenHoatChat VARCHAR(100) NOT NULL,
    hamLuong VARCHAR(50) NOT NULL,
    donViTinh VARCHAR(20),
    FOREIGN KEY (maThuoc) REFERENCES Thuoc(maThuoc)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 5. Các bảng phụ thuộc MỨC 3
CREATE TABLE IF NOT EXISTS UyQuyen (
    maUyQuyen VARCHAR(100) PRIMARY KEY,
    maNguoiUyQuyen VARCHAR(100) NOT NULL,
    maNguoiDuocUyQuyen VARCHAR(100) NOT NULL,
    loaiUyQuyen VARCHAR(50) NOT NULL,
    thoiGianBatDau DATETIME NOT NULL,
    thoiGianKetThuc DATETIME NOT NULL,
    moTa TEXT,
    FOREIGN KEY (maNguoiUyQuyen) REFERENCES TaiKhoan(maTK),
    FOREIGN KEY (maNguoiDuocUyQuyen) REFERENCES TaiKhoan(maTK)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS TroLyBacSi (
    maTroLy VARCHAR(100) PRIMARY KEY,
    maNS VARCHAR(100) NOT NULL,
    maBacSi VARCHAR(100) NOT NULL,
    phamViUyQuyen VARCHAR(255),
    FOREIGN KEY (maNS) REFERENCES NhanSuYTe(maNS),
    FOREIGN KEY (maBacSi) REFERENCES BacSi(maBS)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS LichLamViec (
    maLichLV VARCHAR(100) PRIMARY KEY,
    maBS VARCHAR(100) NOT NULL,
    maNS VARCHAR(100) NOT NULL,
    maCa VARCHAR(100) NOT NULL,
    ngayLamViec DATETIME NOT NULL,
    FOREIGN KEY (maBS) REFERENCES BacSi(maBS),
    FOREIGN KEY (maNS) REFERENCES NhanSuYTe(maNS),
    FOREIGN KEY (maCa) REFERENCES CaKham(maCa)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS HoSoBenhAn (
    maHSBA VARCHAR(100) PRIMARY KEY,
    maBN VARCHAR(100) NOT NULL,
    ngayLap DATE DEFAULT (CURRENT_DATE),
    dotKhamBenh DATETIME,
    lichSuBenh TEXT,
    ghiChu TEXT,
    FOREIGN KEY (maBN) REFERENCES BenhNhan(maBN)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS LichKham (
    maLich VARCHAR(100) PRIMARY KEY,
    maBN VARCHAR(100) NOT NULL,
    maBS VARCHAR(100) NOT NULL,
    ngayKham DATE NOT NULL,
    gioKham VARCHAR(20) NOT NULL,
    phong VARCHAR(100),
    ghiChu TEXT,
    trangThai VARCHAR(20) DEFAULT 'CHO_THANH_TOAN' NOT NULL,
    thoiGianTao DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    maHD VARCHAR(100) NULL,
    FOREIGN KEY (maBN) REFERENCES BenhNhan(maBN),
    FOREIGN KEY (maBS) REFERENCES BacSi(maBS)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS YeuCauXetNghiem (
    maYeuCau VARCHAR(100) PRIMARY KEY,
    maBN VARCHAR(100) NOT NULL,
    maBS VARCHAR(100),
    loaiYeuCau VARCHAR(20) DEFAULT 'THONG_THUONG',
    ngayYeuCau DATETIME DEFAULT (CURRENT_TIMESTAMP),
    trangThai VARCHAR(20) DEFAULT 'CHO_THUC_HIEN',
    
    FOREIGN KEY (maBN) REFERENCES BenhNhan(maBN),
    FOREIGN KEY (maBS) REFERENCES BacSi(maBS)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 6. Các bảng phụ thuộc MỨC 4
CREATE TABLE IF NOT EXISTS ChiTietYeuCauXN (
    maCT VARCHAR(100) PRIMARY KEY,
    maYeuCau VARCHAR(100) NOT NULL,
    maXN VARCHAR(100) NOT NULL,
    FOREIGN KEY (maYeuCau) REFERENCES YeuCauXetNghiem(maYeuCau),
    FOREIGN KEY (maXN) REFERENCES XetNghiem(maXN)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS PhieuKham (
    maPK VARCHAR(100) PRIMARY KEY,
    maHSBA VARCHAR(100) NOT NULL,
    maBN VARCHAR(100) NOT NULL,
    maBS VARCHAR(100) NOT NULL,
    ngayKham DATETIME DEFAULT (CURRENT_TIMESTAMP),
    trieuChung TEXT,
    chuanDoan TEXT,
    loiDan TEXT,
    trangThai VARCHAR(50) DEFAULT 'DA_KHAM',
    file MEDIUMTEXT NOT NULL,
    FOREIGN KEY (maHSBA) REFERENCES HoSoBenhAn(maHSBA),
    FOREIGN KEY (maBN) REFERENCES BenhNhan(maBN),
    FOREIGN KEY (maBS) REFERENCES BacSi(maBS)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS DonThuoc (
    maDT VARCHAR(100) PRIMARY KEY,
    maPK VARCHAR(100) NOT NULL,
    maBS VARCHAR(100) NOT NULL,
    maThuoc VARCHAR(100), 
    ngayKeDon DATE DEFAULT (CURRENT_DATE),
    file MEDIUMTEXT NOT NULL,
    FOREIGN KEY (maPK) REFERENCES PhieuKham(maPK),
    FOREIGN KEY (maThuoc) REFERENCES Thuoc(maThuoc),
    FOREIGN KEY (maBS) REFERENCES BacSi(maBS)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS PhieuXetNghiem (
    maPhieuXN VARCHAR(100) PRIMARY KEY,
    maYeuCau VARCHAR(100) NOT NULL,
    maXN VARCHAR(100) NOT NULL,
    maNS VARCHAR(100),
    maHSBA VARCHAR(100),
    ngayThucHien DATETIME,
    ketQua TEXT,
    ghiChu TEXT,
    file MEDIUMTEXT NOT NULL,
    FOREIGN KEY (maYeuCau) REFERENCES YeuCauXetNghiem(maYeuCau),
    FOREIGN KEY (maXN) REFERENCES XetNghiem(maXN),
    FOREIGN KEY (maHSBA) REFERENCES HoSoBenhAn(maHSBA),
    FOREIGN KEY (maNS) REFERENCES NhanSuYTe(maNS)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS GioHang (
    maGH VARCHAR(100) PRIMARY KEY,
    maBN VARCHAR(100) NOT NULL,
    ngayTao DATETIME DEFAULT (CURRENT_TIMESTAMP),
    trangThai VARCHAR(20) DEFAULT 'CHO_THANH_TOAN',
    FOREIGN KEY (maBN) REFERENCES BenhNhan(maBN)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS HoaDon (
    maHD VARCHAR(100) PRIMARY KEY,
    maBN VARCHAR(100) NOT NULL,
    ngayLap DATETIME DEFAULT (CURRENT_TIMESTAMP),
    tongTien DECIMAL(15,2) DEFAULT 0,
    trangThai VARCHAR(20) DEFAULT 'CHUA_THANH_TOAN',
    maNS VARCHAR(100) NOT NULL,
    FOREIGN KEY (maBN) REFERENCES BenhNhan(maBN),
    FOREIGN KEY (maNS) REFERENCES NhanSuYTe(maNS)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS TinTuc (
    maTin VARCHAR(100) PRIMARY KEY,
    tieuDe VARCHAR(255) NOT NULL,
    noiDung TEXT,
    ngayDang DATE NOT NULL,
    maNS VARCHAR(100) NOT NULL,
    FOREIGN KEY (maNS) REFERENCES NhanSuYTe(maNS)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS PhanHoi (
    maPH VARCHAR(100) PRIMARY KEY,
    maBN VARCHAR(100) NOT NULL,
    noiDung TEXT NOT NULL,
    ngayGui DATETIME NOT NULL,
    trangThai VARCHAR(20),
    FOREIGN KEY (maBN) REFERENCES BenhNhan(maBN)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 7. Các bảng phụ thuộc MỨC 5
CREATE TABLE IF NOT EXISTS ChiTietDonThuoc (
    maCTDT VARCHAR(100) PRIMARY KEY,
    maDT VARCHAR(100) NOT NULL,
    maThuoc VARCHAR(100) NOT NULL,
    soLuong INT NOT NULL,
    lieuDung VARCHAR(255),
    FOREIGN KEY (maDT) REFERENCES DonThuoc(maDT),
    FOREIGN KEY (maThuoc) REFERENCES Thuoc(maThuoc)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ChiTietHoaDon (
    maCTHD VARCHAR(100) PRIMARY KEY,
    maHD VARCHAR(100) NOT NULL,
    loaiDichVu VARCHAR(50) NOT NULL,
    maDichVu VARCHAR(100) NOT NULL,
    donGia DECIMAL(12,2) NOT NULL,
    soLuong INT DEFAULT 1,
    thanhTien DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (maHD) REFERENCES HoaDon(maHD)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ChiTietGioHang (
    maCTGH VARCHAR(100) PRIMARY KEY,
    maGH VARCHAR(100) NOT NULL,
    loaiDichVu VARCHAR(50) NOT NULL,
    maDichVu VARCHAR(100) NOT NULL,
    donGia DECIMAL(12,2) NOT NULL,
    soLuong INT DEFAULT 1,
    thanhTien DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (maGH) REFERENCES GioHang(maGH)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ThanhToan (
    maTT VARCHAR(100) PRIMARY KEY,
    maHD VARCHAR(100) NOT NULL,
    soTien DECIMAL(15,2) NOT NULL,
    phuongThuc VARCHAR(50) NOT NULL,
    trangThai VARCHAR(20) DEFAULT 'CHO_THANH_TOAN',
    ngayThanhToan DATETIME DEFAULT (CURRENT_TIMESTAMP),
    FOREIGN KEY (maHD) REFERENCES HoaDon(maHD)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================
-- 💬 BỔ SUNG BẢNG CHAT NỘI BỘ
-- =============================================
-- 8. Bảng ChatRooms: Lưu thông tin các phòng chat 1-1
CREATE TABLE IF NOT EXISTS ChatRooms (
    `id` INTEGER NOT NULL auto_increment,
    `roomName` VARCHAR(255) NOT NULL UNIQUE COMMENT 'Tên phòng, VD: TK001_TK002',
    `user1Id` VARCHAR(100) NOT NULL,
    `user2Id` VARCHAR(100) NOT NULL,
    `trangThai` VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING, ACTIVE, EXPIRED',
    `thoiGianBatDauChat` DATETIME NULL COMMENT 'Thời gian bắt đầu chat (khi được chấp nhận)',
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user1Id`) REFERENCES `TaiKhoan` (`maTK`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`user2Id`) REFERENCES `TaiKhoan` (`maTK`) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 9. Bảng ChatMessages: Lưu nội dung từng tin nhắn
CREATE TABLE IF NOT EXISTS ChatMessages (
    `id` INTEGER NOT NULL auto_increment,
    `room` VARCHAR(255) NOT NULL COMMENT 'Tên phòng (roomName) từ ChatRooms',
    `senderId` VARCHAR(100) NOT NULL COMMENT 'maTK người gửi',
    `receiverId` VARCHAR(100) NOT NULL COMMENT 'maTK người nhận',
    `message` TEXT NOT NULL,
    `timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `daXem` TINYINT(1) DEFAULT 0,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`senderId`) REFERENCES `TaiKhoan` (`maTK`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`receiverId`) REFERENCES `TaiKhoan` (`maTK`) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `room_index` (`room`) -- Thêm index cho cột room để tăng tốc độ truy vấn
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Otps` (
  `id` INTEGER NOT NULL auto_increment,
  `email` VARCHAR(255) NOT NULL,
  `otpCode` VARCHAR(6) NOT NULL,
  `purpose` VARCHAR(50) NOT NULL COMMENT 'Mục đích: REGISTER_PATIENT hoặc RESET_PASSWORD',
  `expiredAt` DATETIME NOT NULL COMMENT 'Thời gian hết hạn',
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `Otps_email_purpose` (`email`, `purpose`) -- Thêm chỉ mục để tra cứu nhanh
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 8. Bảng ghi log Chatbot (Thêm mới)
CREATE TABLE IF NOT EXISTS ChatLogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    maTK VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    reply TEXT,
    intent VARCHAR(100),
    timestamp DATETIME DEFAULT (CURRENT_TIMESTAMP),
    FOREIGN KEY (maTK) REFERENCES TaiKhoan(maTK)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================
-- 🏥 BẢNG MÔ PHỎNG BLOCKCHAIN CHO HỒ SƠ BỆNH ÁN
-- =============================================
CREATE TABLE IF NOT EXISTS HoSoAnChuoiKham (
    id INT AUTO_INCREMENT PRIMARY KEY,
    maHSBA VARCHAR(100) NOT NULL,         
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    block_type VARCHAR(50) NOT NULL,      
    data_json MEDIUMTEXT NOT NULL,              
    maNguoiTao VARCHAR(100) NOT NULL,
    signature TEXT NOT NULL,
    previous_hash VARCHAR(256) NOT NULL,  
    current_hash VARCHAR(256) NOT NULL,   
    FOREIGN KEY (maHSBA) REFERENCES HoSoBenhAn(maHSBA) ON DELETE CASCADE,
    INDEX(maHSBA) -- Tăng tốc độ truy vấn
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- Dữ liệu mẫu
INSERT INTO NhomQuyen (maNhom, tenNhom, moTa) VALUES
('ADMIN', 'Quản trị viên', 'Có toàn quyền quản lý hệ thống'),
('BACSI', 'Bác sĩ', 'Quản lý khám chữa bệnh'),
('NHANSU', 'Nhân sự y tế', 'Quản lý nhân viên y tế'),
('BENHNHAN', 'Bệnh nhân', 'Đặt lịch hẹn và xem hồ sơ bệnh án');

-- Bổ sung nhân sự hệ thống để đại diện khi bệnh nhân tạo hóa đơn
INSERT INTO TaiKhoan (maTK, tenDangNhap, matKhau, maNhom)
VALUES ('SYSNS001', 'system_nhansu', '123456', 'NHANSU')
ON DUPLICATE KEY UPDATE tenDangNhap = tenDangNhap;

INSERT INTO NhanSuYTe (maNS, maTK, hoTen, loaiNS)
VALUES ('SYSTEM', 'SYSNS001', 'Tự động hệ thống', 'HT')
ON DUPLICATE KEY UPDATE hoTen = hoTen;


INSERT INTO KhoaPhong (maKhoa, tenKhoa, moTa) VALUES
('K001', 'Khoa Nội', 'Chuyên điều trị bệnh nội khoa'),
('K002', 'Khoa Ngoại', 'Chuyên phẫu thuật và điều trị ngoại khoa'),
('K003', 'Khoa Xét nghiệm', 'Chuyên thực hiện các xét nghiệm y học'),
('K004', 'Khoa Dược', 'Quản lý thuốc và cấp phát thuốc');

INSERT INTO NhomThuoc (maNhom, tenNhom, moTa) VALUES
('NH001', 'Thuốc giảm đau', 'Các loại thuốc giảm đau, hạ sốt'),
('NH002', 'Thuốc kháng sinh', 'Các loại thuốc kháng sinh'),
('NH003', 'Thuốc tim mạch', 'Các loại thuốc điều trị bệnh tim mạch');

INSERT INTO CaKham (maCa, tenCa, thoiGianBatDau, thoiGianKetThuc) VALUES
('CA001', 'Ca Sáng', '08:00:00', '12:00:00'),
('CA002', 'Ca Chiều', '13:00:00', '17:00:00');

INSERT INTO DonViTinh (maDVT, tenDVT, moTa) VALUES
('DVT001', 'Viên', 'Đơn vị tính theo viên'),
('DVT002', 'Vỉ', 'Đơn vị tính theo vỉ (10 viên/vỉ)'),
('DVT003', 'Chai', 'Đơn vị tính theo chai');

INSERT INTO Thuoc (maThuoc, tenThuoc, tenHoatChat, hamLuong, maDVT, maNhom, soDangKy, nuocSanXuat, hangSanXuat, giaNhap, giaBanLe, giaBanBuon, tonKhoToiThieu, tonKhoHienTai, hanSuDung, trangThai) VALUES
('TH001', 'Paracetamol', 'Paracetamol', '500mg', 'DVT001', 'NH001', 'SDK001', 'Việt Nam', 'Dược phẩm Hà Nội', 10000, 12000, 11500, 10, 50, '2025-12-31', 1),
('TH002', 'Amoxicillin', 'Amoxicillin', '500mg', 'DVT001', 'NH002', 'SDK002', 'Việt Nam', 'Dược phẩm Sài Gòn', 15000, 18000, 17000, 5, 30, '2025-11-30', 1),
('TH003', 'Atorvastatin', 'Atorvastatin', '20mg', 'DVT001', 'NH003', 'SDK003', 'Thụy Sĩ', 'Pfizer', 25000, 30000, 28000, 5, 20, '2025-10-15', 1);



INSERT INTO LoaiXetNghiem (maLoaiXN, tenLoai, moTa) VALUES
('LXN001', 'Xét nghiệm máu', 'Các xét nghiệm liên quan đến máu'),
('LXN002', 'Xét nghiệm nước tiểu', 'Các xét nghiệm liên quan đến nước tiểu'),
('LXN003', 'Xét nghiệm sinh hóa', 'Các xét nghiệm sinh hóa cơ bản');



INSERT INTO XetNghiem (maXN, maLoaiXN, tenXN, chiPhi, thoiGianTraKetQua) VALUES
('XN001', 'LXN001', 'Tổng phân tích tế bào máu', 120000, '2 giờ'),
('XN002', 'LXN001', 'Đường huyết', 50000, '1 giờ'),
('XN003', 'LXN002', 'Tổng phân tích nước tiểu', 80000, '1.5 giờ'),
('XN004', 'LXN003', 'Chức năng gan', 150000, '3 giờ');




-- INSERT INTO ChiTietDonThuoc (maCTDT, maDT, maThuoc, soLuong, lieuDung) VALUES
-- ('CTDT001', 'DT001', 'TH001', 20, '1 viên/lần, 3 lần/ngày khi đau'),
-- ('CTDT002', 'DT002', 'TH003', 30, '1 viên/lần, 1 lần/ngày trước khi ngủ'),
-- ('CTDT003', 'DT003', 'TH002', 15, '1 viên/lần, 2 lần/ngày sau ăn');



-- INSERT INTO HoaDon (maHD, maBN, ngayLap, tongTien, trangThai, maNS) VALUES
-- ('HD001', 'BN001', '2023-04-01 11:00:00', 290000, 'DA_THANH_TOAN', 'NS001'),
-- ('HD002', 'BN002', '2023-03-15 16:00:00', 230000, 'CHUA_THANH_TOAN', 'NS001');

-- INSERT INTO ChiTietHoaDon (maCTHD, maHD, loaiDichVu, maDichVu, donGia, soLuong, thanhTien) VALUES
-- ('CTHD001', 'HD001', 'KHAM_BENH', 'PK001', 100000, 1, 100000),
-- ('CTHD002', 'HD001', 'XET_NGHIEM', 'PXN001', 120000, 1, 120000),
-- ('CTHD003', 'HD001', 'XET_NGHIEM', 'PXN002', 50000, 1, 50000),
-- ('CTHD004', 'HD001', 'THUOC', 'DT001', 20000, 1, 20000),
-- ('CTHD005', 'HD002', 'KHAM_BENH', 'PK002', 100000, 1, 100000),
-- ('CTHD006', 'HD002', 'THUOC', 'DT003', 30000, 1, 30000),
-- ('CTHD007', 'HD002', 'XET_NGHIEM', 'YCXN002', 100000, 1, 100000);


-- INSERT INTO PhieuXetNghiem (maPhieuXN, maYeuCau, maXN, maNS, maHSBA, ngayThucHien, ketQua) VALUES
-- ('PXN001', 'YCXN001', 'XN001', 'NS001', 'HSBA001', '2023-04-01 10:00:00', 'Số lượng hồng cầu: 4.5 triệu/mm3, bạch cầu: 7000/mm3'),
-- ('PXN002', 'YCXN001', 'XN002', 'NS001', 'HSBA001', '2023-04-01 10:15:00', 'Đường huyết: 5.2 mmol/L');

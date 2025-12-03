-- ---
-- SCRIPT BẢO MẬT BLOCKCHAIN: KHÓA TUYỆT ĐỐI BẰNG TRIGGER
-- Mục đích: Đảm bảo tính bất biến của dữ liệu y tế đã ghi.
-- ---

-- 1. Chọn Database
USE Hospital5;

-- 2. TẠO USER VÀ CẤP QUYỀN ĐẦY ĐỦ TRƯỚC (Giữ nguyên việc cấp quyền rộng cho các bảng khác)
CREATE USER IF NOT EXISTS 'hospital_app'@'%' IDENTIFIED BY 'MatKhauBaoMatHon123456';

-- Cấp quyền thao tác trên toàn bộ DB Hospital5 
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, REFERENCES, INDEX, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES, EXECUTE, CREATE VIEW, SHOW VIEW, CREATE ROUTINE, ALTER ROUTINE, EVENT, TRIGGER ON Hospital5.* TO 'hospital_app'@'%';

FLUSH PRIVILEGES;

-- ==============================================================
-- 3. TẠO TRIGGER ĐỂ KHÓA TUYỆT ĐỐI QUYỀN "UPDATE"
-- Trigger này sẽ CHẶN mọi lệnh UPDATE trên bảng HoSoAnChuoiKham
-- ==============================================================
DROP TRIGGER IF EXISTS prevent_blockchain_update;

DELIMITER $$
CREATE TRIGGER prevent_blockchain_update
BEFORE UPDATE ON HoSoAnChuoiKham
FOR EACH ROW
BEGIN
    -- Lệnh SIGNAL này được kích hoạt cho MỌI UPDATE, bất kể người dùng là ai.
    SIGNAL SQLSTATE '45000' 
    SET MESSAGE_TEXT = 'BAO MAT: KHONG DUOC PHEP CHINH SUA DU LIEU KHOI BLOCKCHAIN! Du lieu la bat bien.';
END$$
DELIMITER ;

-- ==============================================================
-- 4. TẠO TRIGGER ĐỂ KHÓA TUYỆT ĐỐI QUYỀN "DELETE"
-- Trigger này sẽ CHẶN mọi lệnh DELETE trên bảng HoSoAnChuoiKham
-- ==============================================================
DROP TRIGGER IF EXISTS prevent_blockchain_delete;

DELIMITER $$
CREATE TRIGGER prevent_blockchain_delete
BEFORE DELETE ON HoSoAnChuoiKham
FOR EACH ROW
BEGIN
    -- Lệnh SIGNAL này được kích hoạt cho MỌI DELETE, bất kể người dùng là ai.
    SIGNAL SQLSTATE '45000' 
    SET MESSAGE_TEXT = 'BAO MAT: KHONG DUOC PHEP XOA DU LIEU KHOI BLOCKCHAIN! Du lieu la bat bien.';
END$$
DELIMITER ;
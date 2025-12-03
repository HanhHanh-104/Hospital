// File: hospital-management-master/backend/src/middleware/upload.js
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require("uuid");

// Cấu hình nơi lưu trữ và tên file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Lưu vào thư mục public/uploads
    cb(null, path.join(__dirname, '..', 'public', 'uploads')); 
  },
  filename: (req, file, cb) => {
    // Đảm bảo tên file duy nhất: [maYeuCau]_[UUID].[ext]
    const maYeuCau = req.body.maYeuCau || 'NOYC';
    const uniqueSuffix = uuidv4().slice(0, 8);
    const ext = path.extname(file.originalname);
    cb(null, `${maYeuCau}_${uniqueSuffix}${ext}`);
  }
});

// Giới hạn kích thước file (ví dụ: 10MB)
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn 10MB
  fileFilter: (req, file, cb) => {
    // Chỉ chấp nhận hình ảnh
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cb(new Error('Chỉ cho phép tải lên file hình ảnh (jpg, jpeg, png, gif)!'), false);
    }
    cb(null, true);
  }
}).single('file'); // 'file' là tên trường trong FormData.

module.exports = upload;
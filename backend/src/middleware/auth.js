const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "mat-khau-bi-mat";

//  Middleware kiểm tra token đăng nhập
module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.error("Không có token trong header yêu cầu");
    return res.status(401).json({ thongBao: "Không có token truy cập" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.error("Token không hợp lệ");
    return res.status(401).json({ thongBao: "Token không hợp lệ" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("✅ Token đã xác thực:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Lỗi xác thực token:", error);
    return res.status(403).json({ thongBao: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// src/middleware/checkRole.js
module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.maNhom;
    console.log("🎯 Vai trò hiện tại:", userRole);
    console.log("✅ Cho phép truy cập:", allowedRoles);

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ thongBao: "Không có quyền truy cập" });
    }

    next();
  };
};

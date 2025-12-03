/**
 * Middleware kiểm tra cấp bậc bác sĩ để phân quyền thao tác nghiệp vụ
 * Sử dụng: checkCapBac(allowedCapBacs)
 */

const { BacSi } = require('../models');

module.exports = (...allowedCapBacs) => {
  return async (req, res, next) => {
    try {
      // Lấy mã tài khoản từ user đã được xác thực
      const maTK = req.user?.maTK;
      
      if (!maTK) {
        return res.status(401).json({ 
          message: "Không tìm thấy thông tin người dùng" 
        });
      }

      // Lấy thông tin bác sĩ từ database
      const bacSi = await BacSi.findOne({ 
        where: { maTK: maTK },
        attributes: ['maBS', 'hoTen', 'capBac']
      });

      if (!bacSi) {
        return res.status(403).json({ 
          message: "Không tìm thấy thông tin bác sĩ" 
        });
      }

      const capBac = bacSi.capBac || 'Bác sĩ điều trị';

      // Log để debug
      console.log("🔍 [checkCapBac] Kiểm tra quyền:", {
        maTK,
        maBS: bacSi.maBS,
        capBac,
        allowedCapBacs,
        isAllowed: allowedCapBacs.includes(capBac)
      });

      // Kiểm tra cấp bậc có được phép thực hiện thao tác này không
      // Normalize string để so sánh (loại bỏ khoảng trắng thừa)
      const normalizedCapBac = capBac.trim();
      const normalizedAllowed = allowedCapBacs.map(cb => cb.trim());
      
      if (!normalizedAllowed.includes(normalizedCapBac)) {
        console.error("❌ [checkCapBac] Không đủ quyền:", {
          capBac: normalizedCapBac,
          allowed: normalizedAllowed
        });
        return res.status(403).json({ 
          message: `Cấp bậc "${capBac}" không có quyền thực hiện thao tác này. Yêu cầu: ${allowedCapBacs.join(', ')}`,
          debug: {
            currentCapBac: capBac,
            allowedCapBacs: normalizedAllowed
          }
        });
      }

      // Lưu thông tin bác sĩ vào request để sử dụng sau này
      req.bacSi = bacSi;
      req.capBac = capBac;

      next();
    } catch (error) {
      console.error("❌ Lỗi kiểm tra cấp bậc:", error);
      return res.status(500).json({ 
        message: "Lỗi kiểm tra quyền truy cập", 
        error: error.message 
      });
    }
  };
};

/**
 * Helper function để kiểm tra cấp bậc có đủ điều kiện không
 * Trả về true nếu cấp bậc >= cấp bậc yêu cầu
 */
const capBacLevels = {
  "Bác sĩ thực tập": 1,
  "Bác sĩ sơ cấp": 2,
  "Bác sĩ điều trị": 3,
  "Bác sĩ chuyên khoa I": 4,
  "Bác sĩ chuyên khoa II": 5,
  "Thạc sĩ – Bác sĩ": 6,
  "Tiến sĩ – Bác sĩ": 7,
  "Phó giáo sư – Bác sĩ": 8,
  "Giáo sư – Bác sĩ": 9
};

module.exports.checkMinLevel = (requiredLevel) => {
  return async (req, res, next) => {
    try {
      const maTK = req.user?.maTK;
      if (!maTK) {
        return res.status(401).json({ message: "Không tìm thấy thông tin người dùng" });
      }

      const bacSi = await BacSi.findOne({ 
        where: { maTK: maTK },
        attributes: ['capBac']
      });

      if (!bacSi) {
        return res.status(403).json({ message: "Không tìm thấy thông tin bác sĩ" });
      }

      const currentLevel = capBacLevels[bacSi.capBac] || 3;
      const required = capBacLevels[requiredLevel] || 3;

      if (currentLevel < required) {
        return res.status(403).json({ 
          message: `Yêu cầu cấp bậc tối thiểu: ${requiredLevel}. Cấp bậc hiện tại: ${bacSi.capBac}` 
        });
      }

      req.capBac = bacSi.capBac;
      next();
    } catch (error) {
      console.error("❌ Lỗi kiểm tra cấp bậc:", error);
      return res.status(500).json({ message: "Lỗi kiểm tra quyền truy cập" });
    }
  };
};


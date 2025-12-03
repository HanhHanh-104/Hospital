/**
 * Danh sách chuyên môn y khoa theo cấp bậc bác sĩ
 */

// Chuyên môn cơ bản (cho Bác sĩ thực tập và Bác sĩ sơ cấp)
const chuyenMonCoBan = [
  "Khám tổng quát",
  "Cấp cứu",
  "Nội khoa tổng quát",
  "Ngoại khoa tổng quát",
  "Y học gia đình"
];

// Chuyên môn chính (cho Bác sĩ điều trị)
const chuyenMonChinh = [
  ...chuyenMonCoBan,
  "Tim mạch",
  "Hô hấp",
  "Tiêu hóa",
  "Thần kinh",
  "Nội tiết",
  "Nhi khoa",
  "Sản phụ khoa",
  "Da liễu",
  "Mắt",
  "Tai mũi họng",
  "Xương khớp",
  "Ung bướu"
];

// Chuyên môn chuyên sâu (cho BSCK I và BSCK II)
const chuyenMonChuyenSau = [
  ...chuyenMonChinh,
  "Tim mạch can thiệp",
  "Thần kinh can thiệp",
  "Ngoại thần kinh",
  "Ngoại tim mạch",
  "Ngoại tiêu hóa",
  "Ngoại tiết niệu",
  "Ngoại chỉnh hình",
  "Gây mê hồi sức",
  "Hồi sức cấp cứu",
  "Huyết học",
  "Miễn dịch dị ứng",
  "Tâm thần",
  "Y học thể thao",
  "Y học lao động"
];

// Chuyên môn cao cấp (cho Thạc sĩ, Tiến sĩ, PGS, GS)
const chuyenMonCaoCap = [
  ...chuyenMonChuyenSau,
  "Phẫu thuật tim mạch",
  "Phẫu thuật thần kinh",
  "Phẫu thuật tạo hình",
  "Ghép tạng",
  "Y học hạt nhân",
  "Xạ trị ung thư",
  "Hóa trị ung thư",
  "Y học tái tạo",
  "Y học cá thể hóa",
  "Y học di truyền",
  "Y học phân tử",
  "Nghiên cứu lâm sàng",
  "Dịch tễ học",
  "Y tế công cộng"
];

/**
 * Lấy danh sách chuyên môn phù hợp với cấp bậc
 */
export const getChuyenMonByCapBac = (capBac) => {
  if (!capBac) return chuyenMonCoBan;

  switch (capBac) {
    case "Bác sĩ thực tập":
      return chuyenMonCoBan;
    
    case "Bác sĩ sơ cấp":
      return chuyenMonCoBan;
    
    case "Bác sĩ điều trị":
      return chuyenMonChinh;
    
    case "Bác sĩ chuyên khoa I":
      return chuyenMonChuyenSau;
    
    case "Bác sĩ chuyên khoa II":
      return chuyenMonChuyenSau;
    
    case "Thạc sĩ – Bác sĩ":
      return chuyenMonCaoCap;
    
    case "Tiến sĩ – Bác sĩ":
      return chuyenMonCaoCap;
    
    case "Phó giáo sư – Bác sĩ":
      return chuyenMonCaoCap;
    
    case "Giáo sư – Bác sĩ":
      return chuyenMonCaoCap;
    
    default:
      return chuyenMonChinh;
  }
};

/**
 * Lấy mô tả về chuyên môn theo cấp bậc
 */
export const getMoTaChuyenMon = (capBac) => {
  const moTa = {
    "Bác sĩ thực tập": "Các chuyên môn cơ bản để học tập và thực hành",
    "Bác sĩ sơ cấp": "Các chuyên môn cơ bản, có thể khám và điều trị dưới sự giám sát",
    "Bác sĩ điều trị": "Các chuyên môn chính, có thể khám và điều trị độc lập",
    "Bác sĩ chuyên khoa I": "Các chuyên môn chuyên sâu, đã qua đào tạo chuyên khoa 2 năm",
    "Bác sĩ chuyên khoa II": "Các chuyên môn chuyên sâu cao cấp, đã qua đào tạo chuyên khoa 4 năm",
    "Thạc sĩ – Bác sĩ": "Các chuyên môn cao cấp, có thể nghiên cứu và giảng dạy",
    "Tiến sĩ – Bác sĩ": "Các chuyên môn cao cấp, tham gia nghiên cứu lớn",
    "Phó giáo sư – Bác sĩ": "Các chuyên môn cao cấp, vừa điều trị vừa giảng dạy",
    "Giáo sư – Bác sĩ": "Tất cả các chuyên môn, cấp bậc cao nhất trong lĩnh vực y khoa"
  };
  
  return moTa[capBac] || "Các chuyên môn phù hợp với cấp bậc";
};

/**
 * Tất cả chuyên môn (dùng cho tìm kiếm hoặc hiển thị)
 */
export const getAllChuyenMon = () => {
  return [...new Set([...chuyenMonCoBan, ...chuyenMonChinh, ...chuyenMonChuyenSau, ...chuyenMonCaoCap])];
};

export default {
  chuyenMonCoBan,
  chuyenMonChinh,
  chuyenMonChuyenSau,
  chuyenMonCaoCap,
  getChuyenMonByCapBac,
  getMoTaChuyenMon,
  getAllChuyenMon
};


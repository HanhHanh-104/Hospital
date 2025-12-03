import React, { useEffect, useState } from "react";
// Sửa 1: Import axios
import axios from "../../../api/axiosClient"; 
import { getHoSoByBenhNhan, getChiTietHoSo } from "../../../services/hoso_BN/hsbaService";
import dayjs from "dayjs";

const HoSoBenhAnPage = () => {
  const [list, setList] = useState([]);
  const maBN = localStorage.getItem("maBN"); 
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null); 
  const [isLoadingModal, setIsLoadingModal] = useState(false); 
  
  const [bacSiList, setBacSiList] = useState([]);
  // Sửa 2: Thêm state cho danh sách nhân sự
  const [nhanSuList, setNhanSuList] = useState([]); 

  useEffect(() => {
    fetchData();
    fetchBacSiData(); 
    fetchNhanSuData(); // Sửa 3: Gọi hàm tải danh sách nhân sự
  }, [maBN]); 

  const fetchData = async () => {
    if (!maBN) return; 
    setIsLoading(true);
    try {
      const res = await getHoSoByBenhNhan(maBN);
      setList(res.data.data || []);
    } catch (err) {
      console.error("❌ Lỗi khi gọi API hồ sơ:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBacSiData = async () => {
    try {
      const res = await axios.get("/bacsi");
      setBacSiList(res.data.data || []);
    } catch (err) {
      console.error("❌ Lỗi tải danh sách bác sĩ:", err);
    }
  };

  // Sửa 4: Hàm mới để tải danh sách nhân sự
  const fetchNhanSuData = async () => {
    try {
      const res = await axios.get("/nhansu");
      setNhanSuList(res.data.data || []);
    } catch (err) {
      console.error("❌ Lỗi tải danh sách nhân sự:", err);
    }
  };

  const handleViewDetails = async (maHSBA) => {
    setIsLoadingModal(true);
    setSelectedDetails(true); 
    try {
      const res = await getChiTietHoSo(maHSBA);
      setSelectedDetails(res.data.data); 
    } catch (err) {
      console.error("❌ Lỗi tải chi tiết:", err);
      alert("Lỗi: " + (err.response?.data?.message || "Không thể tải chi tiết hồ sơ."));
      setSelectedDetails(null); 
    } finally {
      setIsLoadingModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Đang tải dữ liệu hồ sơ...</p>
        </div>
      </div>
    );
  }
  
  if (selectedDetails) {
    return (
      <ModalChiTiet 
        data={selectedDetails} 
        isLoading={isLoadingModal}
        onClose={() => setSelectedDetails(null)}
        bacSiList={bacSiList} 
        nhanSuList={nhanSuList}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-xl shadow-lg">
            <span className="text-4xl">📋</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Hồ Sơ Bệnh Án</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                🔒 Blockchain Secured
              </span>
              <span>Quản lý và theo dõi lịch sử khám chữa bệnh</span>
            </p>
          </div>
        </div>
      </div>

      {/* Hồ sơ bệnh án - Mỗi bệnh nhân chỉ có 1 hồ sơ */}
      {list.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="inline-block bg-gray-100 p-6 rounded-full mb-4">
            <span className="text-6xl">📋</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có hồ sơ bệnh án</h3>
          <p className="text-gray-500">Hồ sơ bệnh án của bạn sẽ được hiển thị tại đây sau khi khám bệnh.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <span className="text-4xl">🏥</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">Hồ Sơ Bệnh Án</h2>
                <p className="text-blue-100 text-sm">Mã hồ sơ: <span className="font-semibold">{list[0]?.maHSBA || 'N/A'}</span></p>
              </div>
            </div>
          </div>

          {/* Thông tin hồ sơ */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <span className="text-2xl">📋</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Mã Hồ Sơ</p>
                  <p className="text-lg font-bold text-gray-800">{list[0]?.maHSBA || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="bg-green-100 p-3 rounded-lg">
                  <span className="text-2xl">📅</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Ngày Thành Lập</p>
                  <p className="text-lg font-bold text-gray-800">
                    {list[0]?.ngayLap ? dayjs(list[0].ngayLap).format("DD/MM/YYYY") : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Nút xem chi tiết */}
            <div className="flex justify-end">
              <button
                onClick={() => handleViewDetails(list[0]?.maHSBA)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
              >
                <span>Xem chi tiết lịch sử khám bệnh</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- BASE URL cho Backend (Dựa trên cấu hình Backend đang chạy ở cổng 4000) ---
const BASE_BACKEND_URL = "http://localhost:4000"; 

// --- Component Helper: Hiển thị liên kết File ---
const FileLink = ({ dataUrl, label = "Xem ảnh đính kèm" }) => {
  if (!dataUrl) return (
    <div className="flex items-center gap-2 text-gray-400 italic py-2">
      <span>📎</span>
      <span>Không có file đính kèm</span>
    </div>
  );
  
  // SỬA LỖI: Ghép BASE_BACKEND_URL với đường dẫn tương đối (ví dụ: /uploads/...)
  const fullUrl = dataUrl.startsWith('/uploads/') 
    ? `${BASE_BACKEND_URL}${dataUrl}` 
    : dataUrl; // Giữ nguyên nếu là URL đầy đủ hoặc Base64 (mặc dù hệ thống không dùng Base64 nữa)

  return (
    <div className="mt-3 pt-3 border-t border-gray-200">
      <a 
        href={fullUrl} // SỬ DỤNG FULL URL ĐÃ GHÉP
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-4 py-2 rounded-lg transition-colors border border-blue-200"
      >
        <span>🖼️</span>
        <span>{label}</span>
        <span>↗</span>
      </a>
    </div>
  );
};


// === COMPONENT MODAL (SỬA ĐỔI) ===
// Sửa 6: Nhận `bacSiList` và `nhanSuList`
const ModalChiTiet = ({ data, isLoading, onClose, bacSiList, nhanSuList }) => {
  // State cho bộ lọc
  const [filters, setFilters] = useState({
    phieuKham: true,
    donThuoc: true,
    xetNghiem: true,
    taoMoi: true
  });

  if (isLoading || data === true || !data.hoSo) { 
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <button 
          onClick={onClose} 
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
        >
          <span>←</span>
          <span>Quay lại danh sách</span>
        </button>
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800">Đang tải chi tiết hồ sơ...</h2>
        </div>
      </div>
    );
  }

  const { hoSo, chain } = data;
  
  // Hàm kiểm tra block có được hiển thị không
  const shouldShowBlock = (blockType) => {
    switch (blockType) {
      case 'PHIEU_KHAM':
        return filters.phieuKham;
      case 'DON_THUOC_HOAN_CHINH':
        return filters.donThuoc;
      case 'PHIEU_XET_NGHIEM':
      case 'KET_QUA_XET_NGHIEM':
      case 'XET_NGHIEM_HOAN_CHINH':
        return filters.xetNghiem;
      case 'TAO_MOI':
        return filters.taoMoi;
      default:
        return true;
    }
  };

  // Lọc và nhóm các block theo đợt khám bệnh (tháng) và ngày
  const filteredChain = (chain || []).filter(block => shouldShowBlock(block.block_type));
  
  // Nhóm theo tháng, sau đó nhóm theo ngày trong mỗi tháng
  const groupedByMonth = filteredChain.reduce((acc, block) => {
    const monthKey = dayjs(block.timestamp).format('YYYY-MM');
    const monthLabel = dayjs(block.timestamp).format('MM/YYYY');
    const dayKey = dayjs(block.timestamp).format('YYYY-MM-DD');
    const dayLabel = dayjs(block.timestamp).format('DD/MM/YYYY');
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        label: monthLabel,
        days: {}
      };
    }
    
    if (!acc[monthKey].days[dayKey]) {
      acc[monthKey].days[dayKey] = {
        label: dayLabel,
        items: []
      };
    }
    
    acc[monthKey].days[dayKey].items.push(block);
    return acc;
  }, {});

  // Sắp xếp tháng theo thứ tự giảm dần (mới nhất trước)
  const sortedMonths = Object.keys(groupedByMonth).sort((a, b) => b.localeCompare(a));
  
  // Hàm toggle filter
  const toggleFilter = (filterKey) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={onClose} 
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span>Quay lại danh sách</span>
        </button>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-lg">
              <span className="text-3xl">📋</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">
                Chi tiết Hồ sơ: <span className="text-blue-600">{hoSo.maHSBA}</span>
              </h2>
              <div className="mt-2 flex items-center gap-4 text-gray-600">
                <p className="flex items-center gap-2">
                  <span>📅</span>
                  <span>Ngày thành lập: {dayjs(hoSo.ngayLap).format("DD/MM/YYYY")}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bộ lọc hiển thị/ẩn */}
      <div className="mb-6 bg-white rounded-xl shadow-md p-4 border border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <span className="text-xl">🔍</span>
          </div>
          <h3 className="text-lg font-bold text-gray-800">Bộ lọc hiển thị</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => toggleFilter('phieuKham')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filters.phieuKham
                ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {filters.phieuKham ? '✓' : '✗'} Phiếu Khám
          </button>
          <button
            onClick={() => toggleFilter('donThuoc')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filters.donThuoc
                ? 'bg-purple-600 text-white shadow-md hover:bg-purple-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {filters.donThuoc ? '✓' : '✗'} Đơn Thuốc
          </button>
          <button
            onClick={() => toggleFilter('xetNghiem')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filters.xetNghiem
                ? 'bg-orange-600 text-white shadow-md hover:bg-orange-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {filters.xetNghiem ? '✓' : '✗'} Xét Nghiệm
          </button>
          <button
            onClick={() => toggleFilter('taoMoi')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filters.taoMoi
                ? 'bg-green-600 text-white shadow-md hover:bg-green-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {filters.taoMoi ? '✓' : '✗'} Tạo Mới
          </button>
        </div>
      </div>

      {/* Lịch sử khám bệnh theo đợt (tháng) và ngày */}
      {sortedMonths.length > 0 ? (
        <div className="space-y-8">
          {sortedMonths.map((monthKey) => {
            const monthData = groupedByMonth[monthKey];
            const sortedDays = Object.keys(monthData.days).sort((a, b) => b.localeCompare(a));
            const totalEvents = Object.values(monthData.days).reduce((sum, day) => sum + day.items.length, 0);
            
            return (
              <div key={monthKey} className="space-y-6">
                {/* Month Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                    <span className="text-xl">📅</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Đợt khám bệnh: Tháng {monthData.label}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {totalEvents} sự kiện
                  </span>
                </div>

                {/* Blocks grouped by day */}
                <div className="space-y-6">
                  {sortedDays.map((dayKey) => {
                    const dayData = monthData.days[dayKey];
                    return (
                      <div key={dayKey} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        {/* Day Header */}
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-300">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <span className="text-lg">📆</span>
                          </div>
                          <h4 className="text-lg font-bold text-gray-800">
                            Ngày {dayData.label}
                          </h4>
                          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                            {dayData.items.length} sự kiện
                          </span>
                        </div>

                        {/* Blocks for this day */}
                        <div className="space-y-4">
                          {dayData.items.map((block, index) => (
                            <div key={block.id} className="relative">
                              {/* Timeline connector */}
                              {index < dayData.items.length - 1 && (
                                <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 to-indigo-300"></div>
                              )}
                              <BlockWidget 
                                block={block} 
                                bacSiList={bacSiList} 
                                nhanSuList={nhanSuList} 
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="inline-block bg-gray-100 p-6 rounded-full mb-4">
            <span className="text-5xl">📭</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {filteredChain.length === 0 && (chain || []).length > 0
              ? "Không có sự kiện nào khớp với bộ lọc"
              : "Chưa có lịch sử khám bệnh"}
          </h3>
          <p className="text-gray-500">
            {filteredChain.length === 0 && (chain || []).length > 0
              ? "Vui lòng bật các bộ lọc để xem sự kiện."
              : "Các phiếu khám và xét nghiệm sẽ được hiển thị tại đây."}
          </p>
        </div>
      )}
    </div>
  );
};

// --- Các component hiển thị nội dung từng loại khối ---

// Sửa 10: Thêm hàm tìm tên Bác sĩ
const getBacSiName = (maBS, bacSiList) => {
  if (!bacSiList || bacSiList.length === 0) return maBS;
  const bacSi = bacSiList.find(bs => bs.maBS === maBS);
  return bacSi ? bacSi.hoTen : maBS; 
};

// Sửa 11: Thêm hàm tìm tên Nhân sự
const getNhanSuName = (maNS, nhanSuList) => {
  if (!nhanSuList || nhanSuList.length === 0) return maNS;
  const nhanSu = nhanSuList.find(ns => ns.maNS === maNS);
  return nhanSu ? nhanSu.hoTen : maNS; 
};

const InfoRow = ({ label, value }) => (
  <div className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
    <span className="text-gray-500 font-medium min-w-[140px]">{label}:</span>
    <span className="text-gray-800 flex-1">{value || <span className="text-gray-400 italic">Không có</span>}</span>
  </div>
);

const TaoMoiContent = ({ data }) => (
  <>
    <InfoRow label="Mã Bệnh nhân" value={data.maBN} />
    <InfoRow label="Ngày lập" value={dayjs(data.ngayLap).format("DD/MM/YYYY")} />
    <InfoRow label="Lịch sử bệnh" value={data.lichSuBenh} />
  </>
);

// Sửa 12: Cập nhật PhieuKhamContent (Thêm FileLink)
// Gợi ý đơn thuốc THAM KHẢO cho bệnh nhân, dựa trên chẩn đoán
// LƯU Ý: Đây chỉ là gợi ý minh hoạ cho đồ án, KHÔNG thay thế chỉ định bác sĩ.
const getSuggestedMedicinesByDiagnosis = (diagnosisRaw) => {
  if (!diagnosisRaw) return [];
  const diagnosis = diagnosisRaw.toLowerCase();

  // Một số rule đơn giản theo từ khoá trong chẩn đoán
  const suggestions = [];

  if (diagnosis.includes("cảm") || diagnosis.includes("cúm")) {
    suggestions.push({
      tenThuoc: "Paracetamol 500mg",
      cachDung: "1 viên x 3 lần / ngày, sau ăn nếu có sốt hoặc đau đầu.",
    });
    suggestions.push({
      tenThuoc: "Vitamin C 500mg",
      cachDung: "1 viên x 1–2 lần / ngày, sau ăn.",
    });
  }

  if (diagnosis.includes("ho")) {
    suggestions.push({
      tenThuoc: "Siro ho thảo dược",
      cachDung: "5–10 ml x 3 lần / ngày, sau ăn.",
    });
  }

  if (
    diagnosis.includes("đau đầu") ||
    diagnosis.includes("nhức đầu") ||
    diagnosis.includes("migraine")
  ) {
    suggestions.push({
      tenThuoc: "Paracetamol 500mg",
      cachDung: "1 viên khi đau, tối đa 3 lần / ngày, cách nhau ít nhất 4–6 giờ.",
    });
  }

  if (
    diagnosis.includes("dạ dày") ||
    diagnosis.includes("viêm loét dạ dày") ||
    diagnosis.includes("trào ngược")
  ) {
    suggestions.push({
      tenThuoc: "Thuốc giảm tiết acid (ví dụ: Omeprazol 20mg)",
      cachDung: "1 viên trước ăn sáng 30 phút, dùng theo chỉ định bác sĩ.",
    });
  }

  if (
    diagnosis.includes("dị ứng") ||
    diagnosis.includes("mẩn ngứa") ||
    diagnosis.includes("mề đay")
  ) {
    suggestions.push({
      tenThuoc: "Thuốc kháng histamin (ví dụ: Cetirizin 10mg)",
      cachDung: "1 viên buổi tối hoặc theo chỉ định bác sĩ.",
    });
  }

  if (suggestions.length === 0) {
    return [];
  }

  return suggestions;
};

const PhieuKhamContent = ({ data, bacSiList }) => {
  const goiYThuoc = getSuggestedMedicinesByDiagnosis(data.chuanDoan);

  return (
    <>
      <InfoRow label="Mã Phiếu Khám" value={data.maPK} />
      <InfoRow label="Bác sĩ" value={getBacSiName(data.maBS, bacSiList)} />
      <InfoRow label="Triệu chứng" value={data.trieuChung} />
      <InfoRow label="Chẩn đoán" value={data.chuanDoan} />
      <InfoRow label="Lời dặn" value={data.loiDan} />
      <FileLink dataUrl={data.file} label="Xem ảnh Phiếu khám" />

      {/* Gợi ý đơn thuốc cho bệnh nhân (chỉ mang tính tham khảo) */}
      {goiYThuoc.length > 0 && (
      <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💡</span>
            <span className="font-semibold text-gray-800">
              Gợi ý đơn thuốc (tham khảo, KHÔNG thay thế đơn của bác sĩ)
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-2">
            Thông tin dưới đây chỉ mang tính tham khảo theo chẩn đoán. Bạn không nên tự ý mua và dùng thuốc
            khi chưa có chỉ định cụ thể của bác sĩ.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-800">
            {goiYThuoc.map((item, idx) => (
              <li key={idx}>
                <span className="font-semibold">{item.tenThuoc}</span>
                <span className="ml-1 text-gray-700">– {item.cachDung}</span>
              </li>
                ))}
          </ul>
          </div>
        )}
    </>
  );
};

// Sửa 13: Cập nhật DonThuocHoanChinhContent (Thêm FileLink)
const DonThuocHoanChinhContent = ({ data, bacSiList }) => (
  <div className="space-y-3">
    <InfoRow label="Mã Đơn Thuốc" value={data.maDT} />
    <InfoRow label="Gắn với Phiếu Khám" value={data.maPK} />
    <InfoRow label="Bác sĩ" value={getBacSiName(data.maBS, bacSiList)} />

    {/* BỔ SUNG HIỂN THỊ FILE CHO ĐƠN THUỐC */}
    <FileLink dataUrl={data.file} label="Xem ảnh Đơn thuốc" />

    {/* Bảng chi tiết thuốc */}
    <div className="mt-4 pt-4 border-t border-gray-200">
      <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <span>💊</span>
        <span>Chi tiết thuốc:</span>
      </h5>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gradient-to-r from-purple-50 to-purple-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Mã Thuốc</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Tên Thuốc</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Số Lượng</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Liều Dùng</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(data.chiTietList || []).map((item, index) => (
              <tr key={index} className="hover:bg-purple-50 transition-colors">
                <td className="px-4 py-3 text-gray-800 font-medium">{item.maThuoc}</td>
                <td className="px-4 py-3 text-gray-700">{item.tenThuoc || <span className="text-gray-400 italic">(Không có tên)</span>}</td>
                <td className="px-4 py-3 text-gray-700">{item.soLuong}</td>
                <td className="px-4 py-3 text-gray-700">{item.lieuDung}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Sửa 14: Cập nhật KetQuaXetNghiemContent (Thêm FileLink)
const KetQuaXetNghiemContent = ({ data, nhanSuList }) => (
  <>
    <InfoRow label="Mã Phiếu XN" value={data.maPhieuXN} />
    <InfoRow label="Mã Yêu Cầu" value={data.maYeuCau} />
    <InfoRow label="Mã Xét Nghiệm" value={data.maXN} />
    {/* Thay thế ID bằng Tên */}
    <InfoRow label="Nhân viên" value={getNhanSuName(data.maNS, nhanSuList)} />
    <InfoRow label="Kết quả" value={data.ketQua} />
    <InfoRow label="Ghi chú" value={data.ghiChu} />
    <FileLink dataUrl={data.file} label="Xem ảnh Kết quả XN" />
  </>
);

// Helper function to get gradient colors based on block type
const getGradientColor = (blockType) => {
  switch (blockType) {
    case 'PHIEU_KHAM':
      return 'from-blue-500 to-blue-600';
    case 'TAO_MOI':
      return 'from-green-500 to-green-600';
    case 'DON_THUOC_HOAN_CHINH':
      return 'from-purple-500 to-purple-600';
    case 'PHIEU_XET_NGHIEM':
    case 'KET_QUA_XET_NGHIEM':
    case 'XET_NGHIEM_HOAN_CHINH':
      return 'from-orange-500 to-orange-600';
    default:
      return 'from-gray-500 to-gray-600';
  }
};

// === COMPONENT CON ĐỂ HIỂN THỊ KHỐI (BLOCK) (Giữ nguyên) ===
const BlockWidget = ({ block, bacSiList, nhanSuList }) => {
  let content, icon, title, color;
  
  const blockData = block.data_json ? JSON.parse(block.data_json) : {}; 

  switch (block.block_type) {
    case 'PHIEU_KHAM':
      icon = "🩺";
      title = "Phiếu Khám";
      color = "text-blue-700";
      content = <PhieuKhamContent data={blockData} bacSiList={bacSiList} />;
      break;
    case 'TAO_MOI':
      icon = "👤";
      title = "Tạo Hồ Sơ";
      color = "text-green-700";
      content = <TaoMoiContent data={blockData} />;
      break;
    
    case 'DON_THUOC_HOAN_CHINH':
      icon = "💊";
      title = "Đơn Thuốc";
      color = "text-purple-700";
      content = <DonThuocHoanChinhContent data={blockData} bacSiList={bacSiList} />;
      break;
      
    // Ẩn Yêu Cầu Xét Nghiệm
    case 'YEU_CAU_XET_NGHIEM':
      return null;
      
    case 'PHIEU_XET_NGHIEM':
    case 'KET_QUA_XET_NGHIEM':
    case 'XET_NGHIEM_HOAN_CHINH': 
       icon = "🔬";
      title = "Kết Quả Xét Nghiệm";
      color = "text-orange-800";
      // Sửa 9: Truyền `nhanSuList`
      content = <KetQuaXetNghiemContent data={blockData} nhanSuList={nhanSuList} />;
      break;

    default:
      return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getGradientColor(block.block_type)} p-4`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <span className="text-2xl">{icon}</span>
            </div>
            <h4 className="text-lg font-bold text-white">
              {title}
            </h4>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
            <span className="text-xs font-semibold text-white">
              {dayjs(block.timestamp).format("DD/MM/YYYY HH:mm")}
            </span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="space-y-3 text-sm">
          {content}
        </div>
      </div>
    </div>
  );
};

export default HoSoBenhAnPage;
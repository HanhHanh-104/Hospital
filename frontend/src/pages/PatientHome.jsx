import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Activity, 
  FileText, 
  CreditCard, 
  Clock, 
  Phone, 
  MapPin,
  ChevronRight,
  Search
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext'; 
import { getLichByBenhNhan } from '../services/lichkham/lichkhamService';

// --- Components Con (Local) ---

const FeatureCard = ({ icon: Icon, title, desc, onClick, colorClass = "bg-primary-50 text-primary-600" }) => (
  <div 
    onClick={onClick}
    className="card card-hover cursor-pointer flex flex-col items-start gap-4 h-full border-t-4 border-t-transparent hover:border-t-primary-500 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
  >
    <div className={`p-3 rounded-xl ${colorClass}`}>
      <Icon size={24} />
    </div>
    <div>
      <h3 className="text-lg font-bold mb-1 text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
    <div className="mt-auto pt-2 flex items-center text-sm font-medium text-primary-600 group">
      Truy cập ngay <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform"/>
    </div>
  </div>
);

const InfoItem = ({ icon: Icon, text, subText }) => (
  <div className="flex items-center gap-3">
    <div className="p-2 bg-white/10 rounded-lg text-white">
      <Icon size={20} />
    </div>
    <div>
      <p className="font-semibold text-white">{text}</p>
      {subText && <p className="text-xs text-blue-100">{subText}</p>}
    </div>
  </div>
);

// --- Trang Chính ---

const PatientHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [nextAppointment, setNextAppointment] = useState(null);
  const [loadingAppointment, setLoadingAppointment] = useState(false);
  const [appointmentError, setAppointmentError] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Chào buổi sáng');
    else if (hour < 18) setGreeting('Chào buổi chiều');
    else setGreeting('Chào buổi tối');
  }, []);

  // Lấy lịch khám sắp tới của bệnh nhân
  useEffect(() => {
    const maBN = localStorage.getItem("maBN");
    if (!maBN) return;

    const fetchNextAppointment = async () => {
      try {
        setLoadingAppointment(true);
        setAppointmentError('');
        const res = await getLichByBenhNhan(maBN);
        const list = res.data?.data || [];

        if (!list.length) {
          setNextAppointment(null);
          return;
        }

        const now = new Date();

        const upcoming = list
          .map(item => {
            const date = new Date(item.ngayKham);
            if (item.gioKham) {
              const [h, m] = item.gioKham.split(":");
              date.setHours(Number(h) || 0, Number(m) || 0, 0, 0);
            }
            return { ...item, datetime: date };
          })
          .filter(item => item.datetime >= now)
          .sort((a, b) => a.datetime - b.datetime);

        if (!upcoming.length) {
          setNextAppointment(null);
          return;
        }

        setNextAppointment(upcoming[0]);
      } catch (err) {
        console.error("❌ Lỗi lấy lịch hẹn bệnh nhân:", err);
        setAppointmentError('Không thể tải lịch hẹn sắp tới.');
        setNextAppointment(null);
      } finally {
        setLoadingAppointment(false);
      }
    };

    fetchNextAppointment();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 pt-10 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden rounded-b-[3rem] shadow-xl">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-white/5 blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <p className="text-blue-200 font-medium mb-1 text-lg">{greeting},</p>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                {user?.HoTen || 'Bệnh nhân thân mến'}
              </h1>
              <p className="text-blue-100 mt-2 max-w-xl text-lg">
                Hệ thống quản lý sức khỏe toàn diện. Đặt lịch khám, theo dõi hồ sơ và thanh toán trực tuyến dễ dàng.
              </p>
            </div>
            
            {/* Quick Stats / Next Appointment Preview */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-white min-w-[300px] shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-blue-200 uppercase tracking-wider">
                  Lịch hẹn sắp tới
                </span>
                {nextAppointment && (
                  <span className="bg-green-500/20 text-green-300 text-xs font-bold px-3 py-1 rounded-full border border-green-500/30">
                    {nextAppointment.trangThai === 'DA_THANH_TOAN'
                      ? 'ĐÃ XÁC NHẬN'
                      : nextAppointment.trangThai}
                  </span>
                )}
              </div>

              {loadingAppointment ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-5 bg-white/20 rounded w-1/2"></div>
                  <div className="h-4 bg-white/10 rounded w-3/4"></div>
                  <div className="h-4 bg-white/10 rounded w-2/3"></div>
                </div>
              ) : appointmentError ? (
                <p className="text-sm text-red-100">{appointmentError}</p>
              ) : !nextAppointment ? (
                <div>
                  <div className="font-semibold text-lg mb-1">Chưa có lịch khám nào</div>
                  <p className="text-sm text-blue-100 opacity-90">
                    Bạn có thể đặt lịch khám mới để được phục vụ nhanh chóng.
                  </p>
                  <button
                    onClick={() => navigate('/patient/lich')}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-primary-700 text-sm font-semibold hover:bg-blue-50 transition"
                  >
                    <Calendar size={16} /> Đặt lịch ngay
                  </button>
                </div>
              ) : (
                <>
                  <div className="font-bold text-2xl mb-1">
                    {nextAppointment.gioKham || 'Chưa có giờ'} -{' '}
                    {nextAppointment.datetime.toLocaleDateString('vi-VN', {
                      weekday: 'short',
                      day: '2-digit',
                      month: '2-digit',
                    })}
                  </div>
                  <div className="text-base text-blue-100 opacity-90">
                    {nextAppointment.BacSi?.hoTen
                      ? `BS. ${nextAppointment.BacSi.hoTen}`
                      : 'Bác sĩ sẽ được phân công'}
                  </div>
                  <div className="text-sm text-blue-100 opacity-80 mt-1">
                    Phòng: {nextAppointment.phong || 'Đang sắp xếp'}
                  </div>
                  <button
                    onClick={() => navigate('/patient/lich')}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-primary-700 text-sm font-semibold hover:bg-blue-50 transition"
                  >
                    Xem chi tiết lịch khám <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 border-t border-white/10 pt-8">
            <InfoItem icon={Phone} text="1900 1234" subText="Hotline Cấp cứu 24/7" />
            <InfoItem icon={Clock} text="07:00 - 17:00" subText="Thứ 2 - Thứ 7" />
            <InfoItem icon={MapPin} text="123 Đường Sức Khỏe" subText="Quận 1, TP.HCM" />
          </div>
        </div>
      </div>

      {/* Main Content Container - Pull up overlapping Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        
        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <FeatureCard 
            icon={Calendar} 
            title="Đặt Lịch Khám" 
            desc="Chọn bác sĩ và thời gian phù hợp với bạn." 
            onClick={() => navigate('/patient/lich')}
            colorClass="bg-blue-100 text-blue-600"
          />
          <FeatureCard 
            icon={Activity} 
            title="Đặt Xét Nghiệm" 
            desc="Đặt lịch xét nghiệm tại nhà hoặc tại viện." 
            onClick={() => navigate('/patient/xetnghiem')}
            colorClass="bg-teal-100 text-teal-600"
          />
          <FeatureCard 
            icon={FileText} 
            title="Hồ Sơ Sức Khỏe" 
            desc="Xem lịch sử khám, đơn thuốc và kết quả." 
            onClick={() => navigate('/patient/hoso')}
            colorClass="bg-purple-100 text-purple-600"
          />
          <FeatureCard 
            icon={CreditCard} 
            title="Thanh Toán" 
            desc="Thanh toán viện phí trực tuyến an toàn." 
            onClick={() => navigate('/patient/hoadon')}
            colorClass="bg-orange-100 text-orange-600"
          />
        </div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Promotion / Banner */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg transform transition hover:scale-[1.01] duration-300">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-3">Gói Khám Tổng Quát</h2>
                <p className="mb-6 text-emerald-50 text-lg">Ưu đãi giảm 20% cho người cao tuổi trong tháng này. Chăm sóc sức khỏe toàn diện ngay hôm nay.</p>
                <button className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition shadow-md">
                  Xem chi tiết
                </button>
              </div>
              <Activity className="absolute right-0 bottom-0 -mr-12 -mb-12 text-white/10 w-64 h-64 rotate-12" />
            </div>

            {/* Quick Actions List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                <Search size={20} className="text-primary-500" /> Tra cứu nhanh
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <button className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary-500 hover:bg-primary-50 transition text-left group bg-gray-50/50">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg group-hover:scale-110 transition-transform">1</div>
                    <div>
                      <span className="block font-bold text-gray-800">Tra cứu thuốc</span>
                      <span className="text-sm text-gray-500">Thông tin & hướng dẫn sử dụng</span>
                    </div>
                 </button>
                 <button className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary-500 hover:bg-primary-50 transition text-left group bg-gray-50/50">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg group-hover:scale-110 transition-transform">2</div>
                    <div>
                      <span className="block font-bold text-gray-800">Bảng giá dịch vụ</span>
                      <span className="text-sm text-gray-500">Cập nhật chi phí mới nhất</span>
                    </div>
                 </button>
              </div>
            </div>

          </div>

          {/* Right Column - Updates/Timeline */}
          <div className="lg:col-span-1">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
                <h3 className="text-lg font-bold mb-6 text-gray-800 border-b pb-4">Thông báo mới</h3>
                <div className="space-y-6 flex-1">
                  {[1, 2, 3].map((_, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-red-100"></div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">Lịch nghỉ lễ 30/4 - 1/5</p>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">Bệnh viện sẽ nghỉ làm việc 2 ngày và chỉ tiếp nhận cấp cứu...</p>
                        <span className="text-xs font-medium text-gray-400 mt-2 block">2 giờ trước</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-2.5 text-center text-sm text-primary-600 font-bold bg-primary-50 rounded-lg hover:bg-primary-100 transition">
                  Xem tất cả thông báo
                </button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientHome;
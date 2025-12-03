import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Phone, Calendar, Clock, MapPin, Search, Menu, X, 
  ChevronRight, ArrowRight, Star, ShieldCheck, Activity, 
  Heart, User, Stethoscope, Mail, Facebook, Youtube, Instagram 
} from 'lucide-react';

// --- Components Con (Local) ---

const SectionTitle = ({ title, subtitle, align = "center" }) => (
  <div className={`mb-12 ${align === "center" ? "text-center" : "text-left"}`}>
    <span className="text-primary-600 font-bold tracking-wider uppercase text-sm mb-2 block">
      {subtitle}
    </span>
    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
      {title}
    </h2>
    <div className={`h-1 w-20 bg-primary-500 mt-4 ${align === "center" ? "mx-auto" : ""}`}></div>
  </div>
);

const ServiceCard = ({ icon: Icon, title, desc }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
    <div className="w-14 h-14 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors">
      <Icon size={30} />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed mb-4">{desc}</p>
    <div className="flex items-center text-primary-600 font-semibold text-sm group-hover:gap-1 transition-all">
      Xem chi tiết <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
    </div>
  </div>
);

const DoctorCard = ({ img, name, specialty }) => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all group">
    <div className="relative overflow-hidden h-64 bg-gray-100">
      <img src={img} alt={name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=Doctor'; }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
        <Link to="/login" className="bg-white text-primary-700 px-4 py-2 rounded-full font-semibold text-sm hover:bg-primary-50 transition-colors">
          Đặt lịch ngay
        </Link>
      </div>
    </div>
    <div className="p-4 text-center">
      <h3 className="text-lg font-bold text-slate-900">{name}</h3>
      <p className="text-primary-600 text-sm font-medium mb-2">{specialty}</p>
      <div className="flex justify-center gap-1 text-yellow-400 text-xs">
        {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" />)}
      </div>
    </div>
  </div>
);

const NewsCard = ({ img, title, date, desc }) => (
  <Link to="/patient/tintuc" className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer block">
    <div className="h-48 overflow-hidden">
      <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=News'; }} />
    </div>
    <div className="p-5">
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
        <Calendar size={14} /> {date}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
        {title}
      </h3>
      <p className="text-gray-500 text-sm line-clamp-2 mb-4">
        {desc}
      </p>
      <span className="text-primary-600 font-medium text-sm group-hover:underline inline-flex items-center gap-1">
        Đọc tiếp <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </span>
    </div>
  </Link>
);

// --- Main Page Component ---

const HomePage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Smooth scroll for anchor links
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a');
      if (target && target.getAttribute('href')?.startsWith('#')) {
        const href = target.getAttribute('href');
        if (href && href !== '#') {
          e.preventDefault();
          const element = document.querySelector(href);
          if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
            setMobileMenuOpen(false);
          }
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div className="font-sans text-slate-800 bg-white">
      
      {/* 1. Top Bar (Contact Info) */}
      <div className="bg-primary-900 text-blue-100 py-2 px-4 text-xs md:text-sm hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <span className="flex items-center gap-2"><Phone size={14} /> Hotline: 1900 1234 (24/7)</span>
            <span className="flex items-center gap-2"><Mail size={14} /> contact@smarthospital.vn</span>
            <span className="flex items-center gap-2"><Clock size={14} /> Giờ làm việc: 7:00 - 17:00 (T2-T7)</span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition">Tuyển dụng</a>
            <a href="#" className="hover:text-white transition">Hỏi đáp</a>
            <div className="flex gap-3 border-l border-blue-800 pl-4">
               <Facebook size={14} className="cursor-pointer hover:text-white"/>
               <Youtube size={14} className="cursor-pointer hover:text-white"/>
               <Instagram size={14} className="cursor-pointer hover:text-white"/>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navbar */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur-sm py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform">
              +
            </div>
            <div className="leading-tight">
              <h1 className="text-xl font-bold text-primary-900 tracking-tight">SmartHospital</h1>
              <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">Chăm sóc từ trái tim</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-8 font-medium text-gray-600">
            <Link to="/" className="text-primary-600">Trang chủ</Link>
            <a href="#about" className="hover:text-primary-600 transition">Giới thiệu</a>
            <a href="#services" className="hover:text-primary-600 transition">Chuyên khoa</a>
            <a href="#doctors" className="hover:text-primary-600 transition">Bác sĩ</a>
            <a href="#news" className="hover:text-primary-600 transition">Tin tức</a>
            <Link to="/contact" className="hover:text-primary-600 transition">Liên hệ</Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-primary-700 font-semibold hover:bg-primary-50 rounded-lg transition">
              Đăng nhập
            </Link>
            <Link to="/login" className="px-5 py-2 bg-primary-600 text-white rounded-full font-bold shadow-md hover:bg-primary-700 hover:shadow-lg transition-all flex items-center gap-2">
              <Calendar size={18} />
              Đặt lịch khám
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t p-4 shadow-lg absolute w-full left-0 top-full animate-fade-in">
            <nav className="flex flex-col gap-4 font-medium text-lg">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>Trang chủ</Link>
              <a href="#services" onClick={() => setMobileMenuOpen(false)}>Dịch vụ</a>
              <a href="#doctors" onClick={() => setMobileMenuOpen(false)}>Bác sĩ</a>
              <a href="#news" onClick={() => setMobileMenuOpen(false)}>Tin tức</a>
              <Link to="/login" className="text-primary-600" onClick={() => setMobileMenuOpen(false)}>Đăng nhập</Link>
              <Link to="/login" className="bg-primary-600 text-white text-center py-2 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                Đặt lịch ngay
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* 3. Hero Section */}
      <section className="relative pt-10 pb-20 lg:pt-20 lg:pb-32 overflow-hidden bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-primary-700 text-sm font-semibold">
              <ShieldCheck size={16} /> Bệnh viện đạt chuẩn quốc tế JCI
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
              Chăm Sóc Sức Khỏe <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-teal-500">
                Toàn Diện & Tận Tâm
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
              Hệ thống y tế SmartHospital cung cấp dịch vụ khám chữa bệnh chất lượng cao với đội ngũ chuyên gia hàng đầu và trang thiết bị hiện đại.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link to="/login" className="btn btn-primary px-8 py-3 text-lg rounded-full shadow-xl shadow-primary-200">
                Đặt lịch khám ngay
              </Link>
              <Link to="/login" className="btn bg-white text-slate-700 border border-gray-200 hover:bg-gray-50 px-8 py-3 text-lg rounded-full flex items-center justify-center gap-2">
                <Activity size={20} /> Gói khám sức khỏe
              </Link>
            </div>
            
            {/* Quick Stats */}
            <div className="pt-8 flex justify-center lg:justify-start gap-8 border-t border-gray-200 mt-8">
              <div>
                <p className="text-3xl font-bold text-primary-700">15+</p>
                <p className="text-sm text-gray-500">Năm kinh nghiệm</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-700">50+</p>
                <p className="text-sm text-gray-500">Bác sĩ chuyên khoa</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-700">10k+</p>
                <p className="text-sm text-gray-500">Bệnh nhân / năm</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="lg:w-1/2 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-200/30 rounded-full blur-3xl -z-10"></div>
             <img 
               src="https://images.unsplash.com/photo-1538108149393-fbbd81897560?q=80&w=2668&auto=format&fit=crop" 
               alt="Hospital Team" 
               className="rounded-3xl shadow-2xl border-4 border-white object-cover w-full h-[500px]"
               onError={(e) => { e.target.src = 'https://via.placeholder.com/800x500?text=SmartHospital'; }}
             />
             
             {/* Floating Card */}
             <div className="absolute bottom-10 -left-6 bg-white p-4 rounded-xl shadow-lg animate-bounce-slow hidden md:block max-w-xs z-20">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <Phone size={20} />
                   </div>
                   <div>
                      <p className="text-xs text-gray-500">Cấp cứu 24/7</p>
                      <p className="font-bold text-slate-900">1900 1234</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 4. About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionTitle 
                title="Về SmartHospital" 
                subtitle="Giới thiệu" 
                align="left"
              />
              <p className="text-gray-600 mb-6 leading-relaxed">
                SmartHospital là hệ thống bệnh viện thông minh hàng đầu, được thành lập với sứ mệnh mang đến dịch vụ y tế chất lượng cao, hiện đại và tiện lợi cho mọi người dân.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Với đội ngũ bác sĩ giàu kinh nghiệm, trang thiết bị y tế hiện đại và quy trình làm việc chuyên nghiệp, chúng tôi cam kết cung cấp dịch vụ chăm sóc sức khỏe toàn diện, từ khám sức khỏe định kỳ đến điều trị các bệnh lý phức tạp.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="text-3xl font-bold text-primary-600 mb-2">15+</div>
                  <div className="text-sm text-gray-600">Năm kinh nghiệm</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
                  <div className="text-sm text-gray-600">Bác sĩ chuyên khoa</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="text-3xl font-bold text-primary-600 mb-2">10k+</div>
                  <div className="text-sm text-gray-600">Bệnh nhân/năm</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
                  <div className="text-sm text-gray-600">Hỗ trợ cấp cứu</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2653&auto=format&fit=crop" 
                alt="About SmartHospital" 
                className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/600x500?text=About+Us'; }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle 
            title="Chuyên Khoa Nổi Bật" 
            subtitle="Dịch vụ y tế toàn diện" 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard 
              icon={Heart} 
              title="Khoa Tim Mạch" 
              desc="Chẩn đoán và điều trị các bệnh lý tim mạch với công nghệ tiên tiến nhất."
            />
            <ServiceCard 
              icon={User} 
              title="Khoa Nhi" 
              desc="Chăm sóc sức khỏe toàn diện cho trẻ em với không gian thân thiện."
            />
            <ServiceCard 
              icon={Activity} 
              title="Xét Nghiệm" 
              desc="Hệ thống phòng Lab đạt chuẩn ISO, trả kết quả nhanh chóng và chính xác."
            />
            <ServiceCard 
              icon={Stethoscope} 
              title="Khám Tổng Quát" 
              desc="Các gói khám sức khỏe định kỳ cá nhân và doanh nghiệp linh hoạt."
            />
            <ServiceCard 
              icon={ShieldCheck} 
              title="Sản Phụ Khoa" 
              desc="Đồng hành cùng mẹ bầu trong suốt thai kỳ với sự tận tâm."
            />
            <ServiceCard 
              icon={MapPin} 
              title="Chẩn Đoán Hình Ảnh" 
              desc="Máy chụp MRI, CT Scanner thế hệ mới hỗ trợ chẩn đoán chính xác."
            />
          </div>

          <div className="text-center mt-12">
            <a href="#services" className="btn btn-secondary px-8 py-3 rounded-full inline-block">Xem tất cả chuyên khoa</a>
          </div>
        </div>
      </section>

      {/* 6. Doctors Section */}
      <section id="doctors" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle 
            title="Đội Ngũ Chuyên Gia" 
            subtitle="Bác sĩ đầu ngành" 
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <DoctorCard 
              img="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2670&auto=format&fit=crop" 
              name="BS.CKII Trần Văn A" 
              specialty="Trưởng khoa Tim Mạch" 
            />
            <DoctorCard 
              img="https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2574&auto=format&fit=crop" 
              name="ThS.BS Nguyễn Thị B" 
              specialty="Khoa Nhi" 
            />
            <DoctorCard 
              img="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2664&auto=format&fit=crop" 
              name="TS.BS Lê Văn C" 
              specialty="Khoa Thần Kinh" 
            />
            <DoctorCard 
              img="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2670&auto=format&fit=crop" 
              name="BS.CKI Phạm Thị D" 
              specialty="Sản Phụ Khoa" 
            />
          </div>
        </div>
      </section>

      {/* 7. Feature Banner */}
      <section className="py-16 bg-primary-600 text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')] opacity-10"></div>
         <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Bạn cần tư vấn sức khỏe?</h2>
              <p className="text-blue-100 max-w-xl text-lg">
                Đừng ngần ngại liên hệ với chúng tôi. Đội ngũ bác sĩ sẵn sàng hỗ trợ bạn 24/7 qua hệ thống Chatbot và Tổng đài.
              </p>
            </div>
            <div className="flex gap-4">
               <a href="tel:19001234" className="bg-white text-primary-700 px-6 py-3 rounded-full font-bold hover:bg-blue-50 transition shadow-lg">
                 Gọi 1900 1234
               </a>
               <Link to="/login" className="bg-transparent border-2 border-white px-6 py-3 rounded-full font-bold hover:bg-white/10 transition">
                 Chat với Bác sĩ
               </Link>
            </div>
         </div>
      </section>

      {/* 8. News Section */}
      <section id="news" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-end mb-12">
             <div className="text-left">
                <span className="text-primary-600 font-bold tracking-wider uppercase text-sm mb-2 block">Cẩm nang y tế</span>
                <h2 className="text-3xl font-bold text-slate-900">Tin Tức Mới Nhất</h2>
             </div>
             <Link to="/patient/tintuc" className="hidden md:flex items-center gap-1 text-primary-600 font-semibold hover:gap-2 transition-all">
               Xem tất cả <ArrowRight size={18}/>
             </Link>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <NewsCard 
                img="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2670&auto=format&fit=crop"
                title="5 Cách phòng ngừa bệnh cúm mùa hiệu quả"
                date="25/11/2025"
                desc="Thời điểm giao mùa là lúc virus cúm hoạt động mạnh. Hãy cùng tìm hiểu các biện pháp bảo vệ sức khỏe cho gia đình..."
              />
              <NewsCard 
                img="https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?q=80&w=2574&auto=format&fit=crop"
                title="Khám sức khỏe định kỳ: Bao lâu một lần?"
                date="24/11/2025"
                desc="Khám sức khỏe tổng quát giúp phát hiện sớm các nguy cơ tiềm ẩn. Các chuyên gia khuyến cáo tần suất khám phù hợp..."
              />
              <NewsCard 
                img="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2653&auto=format&fit=crop"
                title="Chế độ dinh dưỡng cho người bệnh tiểu đường"
                date="22/11/2025"
                desc="Xây dựng thực đơn khoa học là chìa khóa vàng trong việc kiểm soát đường huyết và ngăn ngừa biến chứng..."
              />
           </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
           
           {/* Col 1: Brand */}
           <div>
             <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  +
                </div>
                <span className="text-2xl font-bold text-white">SmartHospital</span>
             </div>
             <p className="mb-6 leading-relaxed text-sm">
               Hệ thống quản lý bệnh viện thông minh, mang đến trải nghiệm khám chữa bệnh hiện đại, tiện lợi và an toàn cho mọi người.
             </p>
             <div className="flex gap-4">
                <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 transition text-white"><Facebook size={16}/></a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition text-white"><Youtube size={16}/></a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 transition text-white"><Instagram size={16}/></a>
             </div>
           </div>

           {/* Col 2: Quick Links */}
           <div>
             <h3 className="text-white font-bold text-lg mb-6">Liên Kết Nhanh</h3>
             <ul className="space-y-3 text-sm">
               <li><Link to="/" className="hover:text-primary-500 transition">Trang chủ</Link></li>
               <li><a href="#about" className="hover:text-primary-500 transition">Giới thiệu</a></li>
               <li><a href="#doctors" className="hover:text-primary-500 transition">Đội ngũ bác sĩ</a></li>
               <li><Link to="/login" className="hover:text-primary-500 transition">Đặt lịch khám</Link></li>
               <li><Link to="/login" className="hover:text-primary-500 transition">Tra cứu kết quả</Link></li>
             </ul>
           </div>

           {/* Col 3: Services */}
           <div>
             <h3 className="text-white font-bold text-lg mb-6">Dịch Vụ</h3>
             <ul className="space-y-3 text-sm">
               <li><a href="#" className="hover:text-primary-500 transition">Khám tổng quát</a></li>
               <li><a href="#" className="hover:text-primary-500 transition">Tầm soát ung thư</a></li>
               <li><a href="#" className="hover:text-primary-500 transition">Thai sản trọn gói</a></li>
               <li><a href="#" className="hover:text-primary-500 transition">Xét nghiệm tại nhà</a></li>
               <li><a href="#" className="hover:text-primary-500 transition">Bảo hiểm y tế</a></li>
             </ul>
           </div>

           {/* Col 4: Contact */}
           <div>
             <h3 className="text-white font-bold text-lg mb-6">Liên Hệ</h3>
             <ul className="space-y-4 text-sm">
               <li className="flex gap-3">
                 <MapPin className="text-primary-500 flex-shrink-0" size={20} />
                 <span>123 Đường Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh</span>
               </li>
               <li className="flex gap-3">
                 <Phone className="text-primary-500 flex-shrink-0" size={20} />
                 <span>1900 1234 - 028 3838 3838</span>
               </li>
               <li className="flex gap-3">
                 <Mail className="text-primary-500 flex-shrink-0" size={20} />
                 <span>info@smarthospital.vn</span>
               </li>
             </ul>
           </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>© 2025 SmartHospital. All rights reserved. Designed with ❤️.</p>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
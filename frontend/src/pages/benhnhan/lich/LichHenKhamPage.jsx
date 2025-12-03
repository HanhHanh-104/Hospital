import React, { useEffect, useMemo, useState } from "react";
import axios from "../../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/vi";

const GIO_OPTIONS = ["07", "08", "09", "10", "11", "13", "14", "15", "16", "17"];
const PHUT_OPTIONS = ["00", "15", "30", "45"];

// ✅ HÀM KIỂM TRA MÃ GIỚI THIỆU HỢP LỆ (Chỉ kiểm tra xem có phải là mã BS đang hoạt động không)
const isMaGioiThieuValid = (ma, allBacSiList) => {
    if (!ma || ma.trim().length < 6) return false; // Mã tối thiểu 6 ký tự (theo format của bạn)
    
    const maGioiThieuTrimmed = ma.trim();
    
    // Kiểm tra xem mã nhập vào có trùng với maBS của bất kỳ bác sĩ nào trong danh sách không
    const doctorExists = allBacSiList.some(bs => bs.maBS === maGioiThieuTrimmed);
    
    return doctorExists;
};


const LichHenKhamPage = () => {
  const [form, setForm] = useState({
    maKhoa: "",
    maBS: "",
    ngayKham: "",
    gioKhamGio: "08",
    gioKhamPhut: "00",
    ghiChu: "", // Dùng cho Triệu chứng
    maGioiThieu: "", // Mã giới thiệu
  });

  const [list, setList] = useState([]);
  const [khoaList, setKhoaList] = useState([]);
  const [bacSiList, setBacSiList] = useState([]); 
  const [allBacSiList, setAllBacSiList] = useState([]); 
  const [loadingList, setLoadingList] = useState(false);

  const navigate = useNavigate();
  dayjs.locale("vi");

  useEffect(() => {
    const maBN = localStorage.getItem("maBN");
    if (!maBN) {
      alert("⚠️ Vui lòng đăng nhập bằng tài khoản bệnh nhân.");
      navigate("/login");
      return;
    }
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoadingList(true);
      const maBN = localStorage.getItem("maBN");
      const [lich, khoa, tatCaBacSi] = await Promise.all([
        axios.get(`/lichkham/benhnhan/${maBN}`),
        axios.get("/khoa"),
        axios.get("/bacsi"),
      ]);
      setList(lich.data.data || []);
      setKhoaList(khoa.data.data || []);
      setAllBacSiList(tatCaBacSi.data.data || []);
    } catch (err) {
      console.error("❌ Lỗi tải dữ liệu:", err);
    } finally {
      setLoadingList(false);
    }
  };

  const sortedAppointments = useMemo(() => {
    return [...list].sort((a, b) => {
      const dateA = new Date(`${a.ngayKham}T${a.gioKham || "00:00"}`);
      const dateB = new Date(`${b.ngayKham}T${b.gioKham || "00:00"}`);
      return dateA - dateB;
    });
  }, [list]);

  const upcomingCount = useMemo(() => {
    const now = new Date();
    return list.filter((item) => {
      const dt = new Date(`${item.ngayKham}T${item.gioKham || "00:00"}`);
      return dt >= now && item.trangThai !== "DA_HUY";
    }).length;
  }, [list]);

  const statusConfig = (status) => {
    switch (status) {
      case "CHO_THANH_TOAN":
        return { label: "Chờ thanh toán", className: "bg-amber-100 text-amber-700", emoji: "⏳" };
      case "DA_THANH_TOAN":
        return { label: "Đã xác nhận", className: "bg-emerald-100 text-emerald-700", emoji: "✅" };
      case "DA_HUY":
        return { label: "Đã hủy", className: "bg-rose-100 text-rose-700", emoji: "✖" };
      default:
        return { label: status || "Đang xử lý", className: "bg-slate-100 text-slate-600", emoji: "ℹ️" };
    }
  };

  const handleKhoaChange = (e) => {
    const maKhoa = e.target.value;
    
    let resetMaBS = true;
    const maGioiThieuTrimmed = form.maGioiThieu.trim();

    if (isMaGioiThieuValid(form.maGioiThieu, allBacSiList)) {
        const selectedDoctor = allBacSiList.find(bs => bs.maBS === maGioiThieuTrimmed);
        
        // Nếu BS được giới thiệu thuộc khoa mới, giữ lại maBS
        if (selectedDoctor && selectedDoctor.maKhoa === maKhoa) {
             resetMaBS = false;
        }
    }
    
    // Nếu resetMaBS là true, maBS sẽ về rỗng
    setForm(prev => ({ 
        ...prev, 
        maKhoa: maKhoa, 
        maBS: resetMaBS ? "" : prev.maBS
    }));

    if (maKhoa) {
      const filteredBacSi = allBacSiList.filter(
        (bs) => bs.maKhoa === maKhoa 
      );
      setBacSiList(filteredBacSi);
    } else {
      setBacSiList([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'maGioiThieu') {
        const isValid = isMaGioiThieuValid(value, allBacSiList);
        
        // Nếu mã KHÔNG còn hợp lệ, reset maBS đã chọn để tránh lỗi logic
        if (!isValid) {
            setForm(prev => ({ ...prev, maGioiThieu: value, maBS: "" }));
        } else {
            // Khi mã hợp lệ, chỉ cần update value, logic lọc sẽ tự động làm việc
            setForm(prev => ({ ...prev, maGioiThieu: value })); 
        }
    } else {
        // Thay đổi các trường khác
        setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCreate = async () => {
    const maBN = localStorage.getItem("maBN"); 
    const gioKham = `${form.gioKhamGio}:${form.gioKhamPhut}`;
    let { maBS, ngayKham, ghiChu, maGioiThieu } = form;

    // --- XỬ LÝ MÃ GIỚI THIỆU & GHI CHÚ CUỐI CÙNG ---
    let finalGhiChu = ghiChu; 
    let maBSToSend = maBS;
    const maGioiThieuTrimmed = maGioiThieu.trim();
    
    // Kiểm tra Mã giới thiệu (Lấy Mã BS hợp lệ)
    if (isMaGioiThieuValid(maGioiThieu, allBacSiList)) { 
        
        // Bắt buộc phải là Mã BS
        const extractedMaBS = maGioiThieuTrimmed; 

        if (extractedMaBS) {
            finalGhiChu = (ghiChu ? ghiChu + ' ' : '') + `[GT: ${extractedMaBS}]`;
            
            // 1. Kiểm tra khớp khi đã chọn BS (đã xử lý trong handleChange, nhưng kiểm tra lại)
            if (maBS && maBS !== extractedMaBS) {
               alert(`❌ Mã giới thiệu không khớp với Bác sĩ đã chọn.`);
               return;
            }
            // 2. Nếu không chọn BS, dùng mã GT làm maBS
            if (!maBS) {
                maBSToSend = extractedMaBS;
            }
        }
    }
    // ----------------------------------------------------

    // Bắt buộc phải có Khoa, Ngày, Giờ.
    if (!maBN || !ngayKham || !gioKham || !form.maKhoa) {
      alert("❌ Vui lòng điền đủ thông tin (Khoa, Ngày, Giờ).");
      return;
    }
    
    // Nếu không có mã GT hợp lệ VÀ không chọn BS, ta để maBS rỗng ("")
    if (!isMaGioiThieuValid(maGioiThieu, allBacSiList) && !maBS) {
        maBSToSend = ""; // Kích hoạt auto-assign ở Backend
    } 

    const maKhoaToSend = form.maKhoa; 

    try {
      // Check trùng chỉ chạy nếu maBS không rỗng 
      if (maBSToSend) {
          const check = await axios.get(`/lichkham/check?maBS=${maBSToSend}&ngay=${ngayKham}&gio=${gioKham}`);
          if (check.data.trung) {
            alert("⛔ Khung giờ này đã có người đặt. Vui lòng chọn khung khác.");
            return;
          }
      }
      
      // GỬI REQUEST
      const response = await axios.post("/lichkham", { 
        maBN, 
        tenKhoa: maKhoaToSend,
        maBS: maBSToSend, 
        ngayKham: form.ngayKham,
        ghiChu: finalGhiChu, // Gửi chuỗi ghi chú cuối cùng
        gioKham: gioKham,
        phong: "" // Gửi rỗng, để nhân viên tiếp nhận điền
      });
      
      // ✅ Kiểm tra nếu có hóa đơn, chuyển tới trang thanh toán
      if (response.data.data && response.data.data.maHD) {
        const confirmPayment = window.confirm(
          `✅ Đặt lịch thành công!\n\n` +
          `Bạn cần thanh toán ${parseInt(response.data.data.tongTien).toLocaleString()} VND trong 15 phút.\n\n` +
          `Bấm OK để chuyển tới trang thanh toán ngay.`
        );
        
        if (confirmPayment) {
          navigate("/patient/hoadon");
        }
      } else {
        alert("✅ Đặt lịch thành công! (Bác sĩ sẽ được sắp xếp nếu bạn không chọn)");
      }
      
      setForm({ 
        maKhoa: "", 
        maBS: "", 
        ngayKham: "", 
        gioKhamGio: "08", 
        gioKhamPhut: "00", 
        ghiChu: "",
        maGioiThieu: ""
      });
      loadAll();
    } catch (err) {
      console.error("❌ Lỗi đặt lịch:", err);
      // Cập nhật thông báo lỗi để hiển thị TÊN BÁC SĨ thay vì Mã BS
      let errorMessage = err.response?.data?.message || "❌ Không thể đặt lịch. Vui lòng thử lại.";
      
      // Lấy tên bác sĩ nếu có maBS và bác sĩList
      if (maBSToSend && maBSToSend !== "") {
        const selectedDoctor = allBacSiList.find(bs => bs.maBS === maBSToSend);
        if (selectedDoctor) {
            errorMessage = errorMessage.replace(maBSToSend, selectedDoctor.hoTen);
        }
      }

      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero */}
        <div className="bg-gradient-to-r from-sky-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-1/3 bg-white/10 blur-3xl"></div>
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-widest text-white/70 font-semibold">Bệnh nhân đặt lịch</p>
              <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Đặt lịch khám nhanh chóng</h1>
              <p className="text-white/90 max-w-2xl">
                Chọn khoa, nhập mã giới thiệu (nếu có) và mô tả triệu chứng để bệnh viện sắp xếp bác sĩ phù hợp cho bạn.
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-md min-w-[240px]">
              <p className="text-sm uppercase tracking-wider text-blue-100 font-semibold mb-2">Lịch tương lai</p>
              <div className="text-4xl font-extrabold">{upcomingCount}</div>
              <p className="text-sm text-white/80 mt-1">cuộc hẹn đang chờ phục vụ</p>
            </div>
          </div>
        </div>

        {/* Form & Tips */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-slate-100 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Thông tin đặt lịch</h2>
                <p className="text-sm text-slate-500 mt-1">Điền đầy đủ thông tin để chúng tôi phục vụ tốt nhất.</p>
              </div>
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 bg-sky-600 text-white font-semibold px-5 py-2 rounded-xl hover:bg-sky-700 transition"
              >
                ➕ Đặt lịch
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <label className="space-y-1 text-sm">
                <span className="font-semibold text-slate-700">Chọn khoa</span>
        <select 
          name="maKhoa" 
          value={form.maKhoa} 
          onChange={handleKhoaChange} 
                  className="border border-slate-200 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-sky-200 focus:outline-none"
          required 
        >
          <option value="">-- Chọn khoa --</option>
          {khoaList.map((k) => (
                    <option key={k.maKhoa} value={k.maKhoa}>
                      {k.tenKhoa}
                    </option>
          ))}
        </select>
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-semibold text-slate-700 flex items-center gap-2">
                  Chọn bác sĩ (qua mã giới thiệu)
                  {!isMaGioiThieuValid(form.maGioiThieu, allBacSiList) && (
                    <span className="text-xs text-rose-500 font-medium">Chưa nhập mã hợp lệ</span>
                  )}
                </span>
        <select 
          name="maBS" 
          value={form.maBS} 
          onChange={handleChange} 
                  className={`border border-slate-200 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-sky-200 focus:outline-none ${
                    !isMaGioiThieuValid(form.maGioiThieu, allBacSiList) ? "bg-slate-100 cursor-not-allowed" : ""
                  }`}
          disabled={!isMaGioiThieuValid(form.maGioiThieu, allBacSiList)} 
        >
          <option value="">
                    {isMaGioiThieuValid(form.maGioiThieu, allBacSiList)
                      ? "-- Chọn bác sĩ --"
                      : "Cần mã giới thiệu hợp lệ"}
          </option>
                  {bacSiList
                    .filter((bs) => {
                      const maTrim = form.maGioiThieu.trim();
              if (isMaGioiThieuValid(form.maGioiThieu, allBacSiList)) {
                        return bs.maBS === maTrim;
              }
              return false; 
                    })
                    .map((bs) => (
                      <option key={bs.maBS} value={bs.maBS}>
                        {bs.hoTen} ({bs.maBS})
                      </option>
          ))}
        </select>
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-semibold text-slate-700">Ngày khám</span>
                <input
                  type="date"
                  name="ngayKham"
                  value={form.ngayKham}
                  onChange={handleChange}
                  className="border border-slate-200 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-sky-200 focus:outline-none"
                  required
                />
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-semibold text-slate-700">Khung giờ</span>
                <div className="flex gap-2">
          <select 
            name="gioKhamGio" 
            value={form.gioKhamGio} 
            onChange={handleChange} 
                    className="border border-slate-200 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-sky-200 focus:outline-none"
          >
            {GIO_OPTIONS.map((gio) => (
                      <option key={`h-${gio}`} value={gio}>
                        {gio} giờ
                      </option>
            ))}
          </select>
          <select 
            name="gioKhamPhut" 
            value={form.gioKhamPhut} 
            onChange={handleChange} 
                    className="border border-slate-200 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-sky-200 focus:outline-none"
          >
            {PHUT_OPTIONS.map((phut) => (
                      <option key={`m-${phut}`} value={phut}>
                        {phut} phút
                      </option>
            ))}
          </select>
        </div>
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-semibold text-slate-700">Mã giới thiệu (Mã bác sĩ)</span>
        <input 
          name="maGioiThieu"
          value={form.maGioiThieu}
          onChange={handleChange}
                  placeholder="VD: BSABCD12"
                  className="border border-slate-200 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-sky-200 focus:outline-none"
                />
              </label>

              <label className="space-y-1 text-sm md:col-span-2">
                <span className="font-semibold text-slate-700">Triệu chứng / Ghi chú</span>
        <textarea
          name="ghiChu"
          value={form.ghiChu}
          onChange={handleChange}
                  placeholder="Mô tả ngắn gọn tình trạng của bạn, dị ứng thuốc, yêu cầu đặc biệt..."
                  className="border border-slate-200 rounded-2xl px-4 py-3 w-full focus:ring-2 focus:ring-sky-200 focus:outline-none min-h-[110px]"
                />
              </label>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              💡 Mẹo đặt lịch nhanh
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex gap-3">
                <span className="text-sky-500 font-bold mt-1">1</span>
                Ưu tiên đặt lịch buổi sáng để giảm thời gian chờ và dễ dàng sắp xếp xét nghiệm nếu cần.
              </li>
              <li className="flex gap-3">
                <span className="text-sky-500 font-bold mt-1">2</span>
                Nếu không có mã giới thiệu, hệ thống sẽ tự động phân công bác sĩ cùng chuyên khoa vào ca trống.
              </li>
              <li className="flex gap-3">
                <span className="text-sky-500 font-bold mt-1">3</span>
                Điền triệu chứng càng rõ thì ekip đón tiếp càng chuẩn bị được tốt hơn.
              </li>
              <li className="flex gap-3">
                <span className="text-sky-500 font-bold mt-1">4</span>
                Với lịch yêu cầu thanh toán trước, bạn có 15 phút để hoàn tất ngay trên hệ thống.
              </li>
            </ul>
          </div>
        </div>

        {/* Appointment list */}
        <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Lịch khám của bạn</h3>
              <p className="text-sm text-slate-500">Kiểm tra trạng thái và thanh toán còn thiếu.</p>
            </div>
            <span className="text-sm font-medium text-slate-500">
              Tổng: <span className="text-slate-900 font-semibold">{list.length}</span> lịch
            </span>
          </div>

          {loadingList ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="animate-pulse bg-slate-100 h-24 rounded-2xl"></div>
              ))}
            </div>
          ) : sortedAppointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center mb-4 text-slate-400 text-2xl">
                📭
              </div>
              <p className="text-lg font-semibold text-slate-800">Chưa có lịch nào</p>
              <p className="text-sm text-slate-500 mt-1">Đặt lịch đầu tiên để trải nghiệm dịch vụ tại Hospital5.</p>
        <button
          onClick={handleCreate}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition"
        >
          ➕ Đặt lịch ngay
        </button>
      </div>
          ) : (
            <div className="space-y-4">
              {sortedAppointments.map((l) => {
                const meta = statusConfig(l.trangThai);
                return (
                  <div key={l.maLich} className="rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4 hover:border-sky-200 transition">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">Mã lịch #{l.maLich}</p>
                        <p className="text-lg font-semibold text-slate-900">
                          {dayjs(l.ngayKham).format("dddd, DD/MM/YYYY")} • {l.gioKham || "Chưa cập nhật"}
                        </p>
                        <p className="text-sm text-slate-500">
                          Bệnh nhân: <span className="font-medium text-slate-700">{l.BenhNhan?.hoTen || "Bạn"}</span>
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${meta.className}`}>
                        <span>{meta.emoji}</span> {meta.label}
                  </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-3 text-sm text-slate-600">
                      <div className="bg-slate-50 rounded-xl px-4 py-3">
                        <p className="text-xs uppercase tracking-wide text-slate-400">Bác sĩ</p>
                        <p className="font-semibold text-slate-900 mt-1">{l.BacSi?.hoTen || l.maBS || "Đang sắp xếp"}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl px-4 py-3">
                        <p className="text-xs uppercase tracking-wide text-slate-400">Phòng</p>
                        <p className="font-semibold text-slate-900 mt-1">{l.phong || "Đang cập nhật"}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl px-4 py-3">
                        <p className="text-xs uppercase tracking-wide text-slate-400">Ghi chú</p>
                        <p className="font-semibold text-slate-900 mt-1">{l.ghiChu || "Không có"}</p>
                      </div>
                    </div>

                    {l.trangThai === "CHO_THANH_TOAN" && l.maHD && (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <p className="text-sm text-amber-600 font-medium">
                          Lịch hẹn cần thanh toán trong vòng 15 phút để được giữ chỗ.
                        </p>
                    <button
                      onClick={() => navigate(`/patient/hoadon?maHD=${l.maHD}`)}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition"
                    >
                          💳 Thanh toán ngay
                    </button>
                      </div>
                  )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LichHenKhamPage;
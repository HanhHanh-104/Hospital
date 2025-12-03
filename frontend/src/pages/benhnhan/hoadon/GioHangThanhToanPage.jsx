import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  getGioHang,
  addToGioHang,
  confirmGioHang,
  getMyHoaDon,
  getThanhToan,
  deleteItemGioHang,
} from "../../../services/hoadon_BN/hoadonService";
import axios from "../../../api/axiosClient"; // Client đã config baseURL và Token

import {
  getAllThuoc,
  getAllXetNghiem,
  getAllPhieuKham,
} from "../../../services/hoadon_BN/dichVuService";

const GioHangThanhToanPage = () => {
  const maBN = localStorage.getItem("maBN");
  const maNS = localStorage.getItem("maTK");
  const [searchParams] = useSearchParams();

  const [gioHang, setGioHang] = useState([]);
  const [hoaDonList, setHoaDonList] = useState([]);
  const [chiTietThanhToan, setChiTietThanhToan] = useState([]);
  const [lichChoThanhToan, setLichChoThanhToan] = useState([]);
  const [lichDaHuy, setLichDaHuy] = useState([]); // Lịch đã hủy để hiển thị trong lịch sử
  
  // Form thêm dịch vụ vào giỏ
  const [form, setForm] = useState({
    loaiDichVu: "",
    maDichVu: "",
    soLuong: 1,
    donGia: 0,
  });
  const [danhSachDichVu, setDanhSachDichVu] = useState([]);

  // Form thanh toán Online
  const [formTT, setFormTT] = useState({
    maHD: "",
    soTien: "",
    phuongThuc: "VNPAY", // Mặc định
  });

  useEffect(() => {
    if (maBN) {
      loadGioHang();
      loadHoaDon();
      loadLichChoThanhToan();
      loadLichDaHuy();
    }
  }, [maBN]);
  
  // ✅ Load lịch đã hủy để hiển thị trong lịch sử
  const loadLichDaHuy = async () => {
    try {
      const res = await axios.get(`/lichkham/benhnhan/${maBN}`);
      const allLich = res.data.data || [];
      // Lọc lấy các lịch có trạng thái DA_HUY
      const daHuy = allLich.filter(l => l.trangThai === 'DA_HUY');
      setLichDaHuy(daHuy);
    } catch (err) {
      console.error("Lỗi tải lịch đã hủy:", err);
      setLichDaHuy([]);
    }
  };

  // ✅ Load lịch chờ thanh toán (bao gồm cả lịch đã hủy để hiển thị trong lịch sử)
  const loadLichChoThanhToan = async () => {
    try {
      const res = await axios.get(`/lichkham/benhnhan/${maBN}`);
      const allLich = res.data.data || [];
      // Lọc lấy các lịch có trạng thái CHO_THANH_TOAN (chỉ hiển thị phần chờ thanh toán)
      const choThanhToan = allLich.filter(l => l.trangThai === 'CHO_THANH_TOAN');
      setLichChoThanhToan(choThanhToan);
    } catch (err) {
      console.error("Lỗi tải lịch chờ thanh toán:", err);
      setLichChoThanhToan([]);
    }
  };

  const loadGioHang = async () => {
    try {
      const res = await getGioHang(maBN);
      setGioHang(res.data.data?.chiTiet || []);
    } catch {
      setGioHang([]);
    }
  };

  const loadHoaDon = async () => {
    const res = await getMyHoaDon(maBN);
    const hoaDonData = res.data.data || [];
    setHoaDonList(hoaDonData);
    
    // ✅ Tự động chọn hóa đơn nếu có maHD trong URL
    const maHDFromUrl = searchParams.get('maHD');
    if (maHDFromUrl) {
      const selectedHD = hoaDonData.find(hd => hd.maHD === maHDFromUrl);
      if (selectedHD) {
        setFormTT({ ...formTT, maHD: maHDFromUrl, soTien: selectedHD.tongTien });
        handleXemChiTiet(maHDFromUrl);
      }
    }
  };

  // Logic chọn dịch vụ để thêm vào giỏ (Giữ nguyên)
  const handleLoaiDichVuChange = async (e) => {
    const loai = e.target.value;
    setForm({ ...form, loaiDichVu: loai, maDichVu: "", donGia: 0 });

    if (loai === "XETNGHIEM") {
      const res = await getAllXetNghiem();
      setDanhSachDichVu(res.data.data || []);
    } else if (loai === "THUOC") {
      const res = await getAllThuoc();
      setDanhSachDichVu(res.data.data || []);
    } else if (loai === "KHAM") {
      const res = await getAllPhieuKham();
      setDanhSachDichVu(res.data.data || []);
    } else {
      setDanhSachDichVu([]);
    }
  };

  const handleMaDichVuChange = (e) => {
    const ma = e.target.value;
    const selected = danhSachDichVu.find(
      (d) => d.maThuoc === ma || d.maXN === ma || d.maPK === ma
    ) || {};
    setForm((f) => ({
      ...f,
      maDichVu: ma,
      donGia: selected.giaBanLe || selected.chiPhi || 0,
    }));
  };

  const handleAddToGio = async () => {
    const thanhTien = form.soLuong * form.donGia;
    await addToGioHang({ ...form, maBN, thanhTien });
    loadGioHang();
  };

  const handleXacNhan = async () => {
    if (!maNS) {
      alert("❌ Thiếu mã nhân sự (maNS). Đăng nhập lại.");
      return;
    }
    await confirmGioHang({ maBN, maNS });
    loadGioHang();
    loadHoaDon();
  };

  const handleXoaItem = async (id) => {
    if (window.confirm("Xoá dòng này khỏi giỏ hàng?")) {
      await deleteItemGioHang(id);
      loadGioHang();
    }
  };

  // === XỬ LÝ THANH TOÁN ONLINE ===

  const handleMaHDChange = (value) => {
    const selected = hoaDonList.find((hd) => hd.maHD === value);
    if (selected) {
      setFormTT({ ...formTT, maHD: value, soTien: selected.tongTien });
      // Tải lịch sử thanh toán của hóa đơn này
      handleXemChiTiet(value);
    } else {
      setFormTT({ ...formTT, maHD: value, soTien: "" });
      setChiTietThanhToan([]);
    }
  };

  const handleXemChiTiet = async (maHD) => {
    try {
        const res = await getThanhToan(maHD);
        setChiTietThanhToan(res.data.data || []);
    } catch(e) { console.error(e) }
  };

  const handlePaymentOnline = async () => {
    if (!formTT.maHD) return alert("Vui lòng chọn hóa đơn");
    
    // ✅ Kiểm tra hóa đơn đã bị hủy chưa
    const selectedHD = hoaDonList.find(hd => hd.maHD === formTT.maHD);
    if (selectedHD && selectedHD.trangThai === 'DA_HUY') {
      return alert("❌ Hóa đơn này đã bị hủy. Không thể thanh toán.");
    }
    
    if (formTT.soTien <= 0) return alert("Số tiền không hợp lệ");

    try {
      // Gọi API backend để lấy link thanh toán
      const res = await axios.post("/payment/create-url", {
        maHD: formTT.maHD,
        phuongThuc: formTT.phuongThuc,
      });

      if (res.data.success && res.data.paymentUrl) {
        // Chuyển hướng user đến trang thanh toán của VNPAY/MOMO
        window.location.href = res.data.paymentUrl;
      } else {
        alert("❌ Lỗi tạo link thanh toán: " + (res.data.message || "Lỗi không xác định"));
      }
    } catch (err) {
      console.error("Lỗi thanh toán:", err);
      alert("❌ Không thể kết nối đến cổng thanh toán.");
    }
  };

  // ✅ Xử lý thanh toán lịch khám
  const handleThanhToanLich = async (maHD) => {
    setFormTT({ ...formTT, maHD });
    // Scroll tới phần thanh toán
    setTimeout(() => {
      document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-blue-800 text-center">🛒 Dịch vụ & Thanh toán Viện phí</h2>

      {/* ✅ PHẦN MỚI: Lịch đặt hẹn chờ thanh toán */}
      {lichChoThanhToan.length > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-yellow-800 mb-4 flex items-center gap-2">
            ⏳ Lịch đặt hẹn đang chờ thanh toán ({lichChoThanhToan.length})
          </h3>
          <div className="space-y-3">
            {lichChoThanhToan.map((lich) => {
              // Tính thời gian còn lại
              const thoiGianTao = new Date(lich.thoiGianTao);
              const now = new Date();
              const diffMs = now - thoiGianTao;
              const diffMins = Math.floor(diffMs / 60000);
              const remainingMins = Math.max(0, 15 - diffMins);
              
              return (
                <div key={lich.maLich} className="bg-white p-4 rounded-lg border border-yellow-300">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">Mã lịch: {lich.maLich}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        📅 {lich.ngayKham} - ⏰ {lich.gioKham} | 
                        👨‍⚕️ {lich.BacSi?.hoTen || lich.maBS}
                      </div>
                      <div className="text-xs text-red-600 font-bold mt-2">
                        ⚠️ Còn {remainingMins} phút để thanh toán
                      </div>
                    </div>
                    {lich.maHD && (
                      <button
                        onClick={() => handleThanhToanLich(lich.maHD)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-4 py-2 rounded-lg transition"
                      >
                        💳 Thanh toán ngay
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ✅ PHẦN MỚI: Lịch sử lịch đã hủy */}
      {lichDaHuy.length > 0 && (
        <div className="bg-red-50 border-2 border-red-400 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
            ❌ Lịch đặt hẹn đã bị hủy ({lichDaHuy.length})
          </h3>
          <div className="space-y-3">
            {lichDaHuy.map((lich) => (
              <div key={lich.maLich} className="bg-white p-4 rounded-lg border border-red-300">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">Mã lịch: {lich.maLich}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      📅 {lich.ngayKham} - ⏰ {lich.gioKham} | 
                      👨‍⚕️ {lich.BacSi?.hoTen || lich.maBS}
                    </div>
                    <div className="text-xs text-red-600 font-bold mt-2">
                      ⚠️ Đã quá hạn thanh toán (15 phút) - Lịch đã bị hủy
                    </div>
                    {lich.HoaDon && (
                      <div className="text-xs text-gray-500 mt-1">
                        Mã hóa đơn: {lich.HoaDon.maHD} - Trạng thái: <span className="text-red-600 font-bold">Đã hủy</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 1. Thêm dịch vụ (Giả lập quy trình bác sĩ kê đơn -> vào giỏ) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">1️⃣ Thêm dịch vụ vào giỏ</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <select onChange={handleLoaiDichVuChange} value={form.loaiDichVu} className="input">
            <option value="">-- Loại dịch vụ --</option>
            <option value="KHAM">Khám bệnh</option>
            <option value="XETNGHIEM">Xét nghiệm</option>
            <option value="THUOC">Thuốc</option>
          </select>
          <select onChange={handleMaDichVuChange} value={form.maDichVu} className="input col-span-2">
            <option value="">-- Chọn tên dịch vụ --</option>
            {danhSachDichVu.map((d) => (
                <option key={d.maThuoc || d.maXN || d.maPK} value={d.maThuoc || d.maXN || d.maPK}>
                    {d.tenThuoc || d.tenXN || d.maPK} - {parseInt(d.giaBanLe || d.chiPhi || 0).toLocaleString()}đ
                </option>
            ))}
          </select>
          <input type="number" value={form.soLuong} onChange={(e)=>setForm({...form, soLuong: e.target.value})} className="input" placeholder="SL" />
          <button onClick={handleAddToGio} className="bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition">➕ Thêm</button>
        </div>
      </div>

      {/* 2. Giỏ hàng & Tạo hóa đơn */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-700 mb-4">2️⃣ Giỏ hàng hiện tại</h3>
            <div className="overflow-auto max-h-64">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 sticky top-0">
                        <tr><th className="p-2">Dịch vụ</th><th className="p-2">SL</th><th className="p-2">Thành tiền</th><th className="p-2"></th></tr>
                    </thead>
                    <tbody>
                        {gioHang.map((item, i) => (
                            <tr key={i} className="border-t">
                                <td className="p-2">{item.maDichVu} <span className="text-xs text-gray-500">({item.loaiDichVu})</span></td>
                                <td className="p-2">{item.soLuong}</td>
                                <td className="p-2 font-medium">{parseInt(item.thanhTien).toLocaleString()}</td>
                                <td className="p-2"><button onClick={()=>handleXoaItem(item.maCTGH)} className="text-red-500 hover:underline">Xóa</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {gioHang.length > 0 && (
                <button onClick={handleXacNhan} className="w-full mt-4 bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">
                    ✅ Xác nhận & Tạo hóa đơn
                </button>
            )}
        </div>

        {/* 3. Danh sách hóa đơn */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-700 mb-4">3️⃣ Hóa đơn của bạn</h3>
            <div className="overflow-auto max-h-64">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 sticky top-0">
                        <tr><th className="p-2">Mã HD</th><th className="p-2">Tổng tiền</th><th className="p-2">Trạng thái</th></tr>
                    </thead>
                    <tbody>
                        {hoaDonList.map(hd => (
                            <tr key={hd.maHD} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => handleMaHDChange(hd.maHD)}>
                                <td className="p-2 font-medium text-blue-600">{hd.maHD}</td>
                                <td className="p-2 text-red-600 font-bold">{parseInt(hd.tongTien).toLocaleString()}đ</td>
                                <td className="p-2">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        hd.trangThai === 'DA_THANH_TOAN' 
                                          ? 'bg-green-100 text-green-700' 
                                          : hd.trangThai === 'DA_HUY'
                                          ? 'bg-red-100 text-red-700'
                                          : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {hd.trangThai === 'DA_THANH_TOAN' 
                                          ? 'Đã thanh toán' 
                                          : hd.trangThai === 'DA_HUY'
                                          ? 'Đã hủy'
                                          : 'Chưa thanh toán'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>

      {/* 4. Khu vực thanh toán */}
      <div id="payment-section" className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            💳 Cổng Thanh Toán Trực Tuyến
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Chọn hóa đơn & Phương thức */}
            <div className="space-y-4 md:col-span-2">
                <div>
                    <label className="label">Hóa đơn cần thanh toán</label>
                    <select 
                        value={formTT.maHD} 
                        onChange={(e) => handleMaHDChange(e.target.value)} 
                        className="input"
                    >
                        <option value="">-- Vui lòng chọn hóa đơn --</option>
                        {hoaDonList.filter(h => h.trangThai !== 'DA_THANH_TOAN' && h.trangThai !== 'DA_HUY').map(h => (
                            <option key={h.maHD} value={h.maHD}>
                                {h.maHD} - {parseInt(h.tongTien).toLocaleString()} VND
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="label">Số tiền</label>
                        <input 
                            value={formTT.soTien ? parseInt(formTT.soTien).toLocaleString() + " đ" : ""} 
                            disabled 
                            className="input bg-gray-100 font-bold text-red-600" 
                        />
                    </div>
                    <div>
                        <label className="label">Phương thức</label>
                        <select 
                            value={formTT.phuongThuc} 
                            onChange={(e) => setFormTT({...formTT, phuongThuc: e.target.value})} 
                            className="input"
                        >
                            <option value="VNPAY">Ví VNPAY (Sandbox)</option>
                            <option value="MOMO">Ví MoMo (Sandbox)</option>
                        </select>
                    </div>
                </div>

                <button 
                    onClick={handlePaymentOnline}
                    disabled={formTT.maHD && hoaDonList.find(h => h.maHD === formTT.maHD)?.trangThai === 'DA_HUY'}
                    className={`w-full py-3 mt-2 font-bold rounded-lg shadow-md transition-all ${
                      formTT.maHD && hoaDonList.find(h => h.maHD === formTT.maHD)?.trangThai === 'DA_HUY'
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:scale-[1.02]'
                    }`}
                >
                    {formTT.maHD && hoaDonList.find(h => h.maHD === formTT.maHD)?.trangThai === 'DA_HUY'
                      ? '❌ Hóa đơn đã bị hủy'
                      : '🚀 THANH TOÁN NGAY'}
                </button>
            </div>

            {/* Lịch sử giao dịch của hóa đơn đang chọn */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-600 mb-2 text-sm">Lịch sử giao dịch của HD: {formTT.maHD || "..."}</h4>
                {chiTietThanhToan.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">Chưa có giao dịch nào.</p>
                ) : (
                    <ul className="space-y-2">
                        {chiTietThanhToan.map(tt => (
                            <li key={tt.maTT} className="text-sm border-b pb-1 last:border-0">
                                <div className="flex justify-between">
                                    <span className="font-semibold">{tt.phuongThuc}</span>
                                    <span className="text-green-600 font-bold">{parseInt(tt.soTien).toLocaleString()}đ</span>
                                </div>
                                <div className="text-xs text-gray-500">
                                    {dayjs(tt.ngayThanhToan).format("DD/MM/YYYY HH:mm")} - {tt.trangThai}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default GioHangThanhToanPage;
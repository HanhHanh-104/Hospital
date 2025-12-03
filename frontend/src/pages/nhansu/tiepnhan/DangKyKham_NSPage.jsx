// DangKyKham_NSPage.jsx (Đã sửa)
import React, { useEffect, useState } from "react";
import {
  getAllLichKham,
  createLichKham,
  deleteLichKham,
} from "../../../services/nhansu/tiepnhan/lichkhamService";
import axios from "../../../api/axiosClient";

const getTodayVN = () => {
  const now = new Date();
  now.setHours(now.getHours() + 7);
  return now.toISOString().slice(0, 10);
};

const getCurrentTimeVN = () => {
  const now = new Date();
  now.setHours(now.getHours() + 7);
  return now.toTimeString().slice(0, 5);
};

const DangKyKhamPage = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    maBN: "",
    maBS: "", // Mặc định là rỗng
    ngayKham: getTodayVN(),
    gioKham: getCurrentTimeVN(),
    phong: "", // Thêm trường phòng
    ghiChu: "",
  });

  const [benhNhanList, setBenhNhanList] = useState([]);
  const [bacSiList, setBacSiList] = useState([]);

  useEffect(() => {
    fetchData();
    fetchDropdowns();
  }, []);
  
  // ======================================================
  // ✅ LOGIC TỰ ĐỘNG GÁN PHÒNG KHI CHỌN BÁC SĨ VÀ NGÀY
  // ======================================================
  useEffect(() => {
    const { maBS, ngayKham } = form;
    
    if (maBS && ngayKham) {
      const doctor = bacSiList.find(bs => bs.maBS === maBS);
      
      if (doctor && doctor.maKhoa) {
        // *GIẢ LẬP GÁN PHÒNG: Dựa trên Mã khoa và một số ngẫu nhiên cho mục đích demo*
        // Trong hệ thống thực tế: Logic này cần gọi API LichLamViec để lấy phòng cố định
        const maKhoa = doctor.maKhoa;
        const hash = maBS.charCodeAt(maBS.length - 1); // Dùng ký tự cuối của mã BS
        const roomSuffix = (hash % 5) + 1; // Số phòng từ 1 đến 5
        const autoRoom = `P. ${maKhoa}-${roomSuffix}`; 
        
        setForm(prev => ({ ...prev, phong: autoRoom }));
        console.log(`[Auto-fill] Gán phòng: ${autoRoom} cho BS ${maBS}`);
      }
    } else if (!maBS) {
       // Xóa phòng nếu không có bác sĩ được chọn
       setForm(prev => ({ ...prev, phong: "" }));
    }
    
  }, [form.maBS, form.ngayKham, bacSiList]);


  const fetchData = async () => {
    const res = await getAllLichKham();
    setList(res.data.data || []);
  };

  const fetchDropdowns = async () => {
    const [bn, bs] = await Promise.all([
      axios.get("/benhnhan"),
      axios.get("/bacsi"),
    ]);
    // Lưu danh sách bác sĩ với đầy đủ thông tin (cần maKhoa)
    setBenhNhanList(bn.data.data || []);
    setBacSiList(bs.data.data || []);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async () => {
    // --- BẮT ĐẦU LOGIC SỬA ĐỔI ---
    let maBS_to_send = form.maBS; // Có thể là "" nếu không chọn
    const ghiChu = form.ghiChu;
    
    if (!form.maBN || !form.ngayKham || !form.gioKham) {
      alert("Vui lòng nhập đầy đủ thông tin (Bệnh nhân, Ngày, Giờ).");
      return;
    }
    
    // 1. Kiểm tra mã giới thiệu (nếu có)
    const maGioiThieuMatch = ghiChu ? ghiChu.match(/(BS\d{3,})/) : null;
    const maGioiThieu = maGioiThieuMatch ? maGioiThieuMatch[0].trim() : null;
    
    if (maGioiThieu) {
      if (maBS_to_send && maGioiThieu !== maBS_to_send) {
         alert(`❌ Mã giới thiệu ${maGioiThieu} trong Ghi chú không khớp với Bác sĩ đã chọn.`);
         return;
      } 
      // Nếu có mã giới thiệu và không chọn bác sĩ, ta để maBS_to_send là mã giới thiệu
      // để backend kiểm tra và chấp nhận.
      maBS_to_send = maGioiThieu; 
    } else if (!maBS_to_send) {
        // 2. Không có mã giới thiệu VÀ không chọn bác sĩ -> Cho maBS rỗng để Backend tự sắp xếp
        maBS_to_send = "";
    }
    
    // Lấy maKhoa của bác sĩ được chọn/chỉ định để gửi đi (cần cho logic sắp xếp tự động ở Backend)
    let maKhoaToSend = "";
    if (maBS_to_send) {
      const doc = bacSiList.find(bs => bs.maBS === maBS_to_send);
      maKhoaToSend = doc?.maKhoa || "";
    } else {
        // Nếu không có BS, không thể gửi maKhoa. Backend sẽ báo lỗi nếu không có
        maKhoaToSend = "";
    }

    // --- KẾT THÚC LOGIC SỬA ĐỔI ---

    try {
      // 3. Kiểm tra trùng lịch (Chỉ kiểm tra nếu có maBS được chọn/chỉ định)
      if (maBS_to_send) {
        const check = await axios.get(`/lichkham/check?maBS=${maBS_to_send}&ngay=${form.ngayKham}&gio=${form.gioKham}`);
        if (check.data.trung) {
          alert("⛔ Khung giờ này đã có người đặt. Vui lòng chọn khung khác.");
          return;
        }
      }

      await createLichKham({
        maBN: form.maBN,
        tenKhoa: maKhoaToSend, // Gửi maKhoa dưới tên tenKhoa cho Backend
        maBS: maBS_to_send, // Gửi maBS rỗng (nếu cần tự sắp xếp) hoặc maBS đã chọn
        ngayKham: form.ngayKham,
        gioKham: form.gioKham,
        phong: form.phong, // <-- SỬ DỤNG TRƯỜNG PHÒNG ĐÃ AUTO-FILL HOẶC TỰ NHẬP
        ghiChu: ghiChu 
      });
      
      fetchData();
      alert("✅ Đăng ký thành công!");
      
      setForm({
        maBN: "",
        maBS: "",
        ngayKham: getTodayVN(),
        gioKham: getCurrentTimeVN(),
        phong: "", // Reset
        ghiChu: "",
      });
      
    } catch (error) {
      alert("❌ Lỗi đăng ký: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xoá lịch này?")) {
      await deleteLichKham(id);
      fetchData();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold text-blue-700">📝 Đăng ký khám bệnh</h2>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-xl shadow-lg">
        <select
          name="maBN"
          value={form.maBN}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">-- Chọn bệnh nhân --</option>
          {benhNhanList.map((bn) => (
            <option key={bn.maBN} value={bn.maBN}>
              {bn.hoTen}
            </option>
          ))}
        </select>

        <select
          name="maBS"
          value={form.maBS}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">-- Chọn bác sĩ (để tự sắp xếp) --</option> 
          {bacSiList.map((bs) => (
            <option key={bs.maBS} value={bs.maBS}>
              {bs.hoTen}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="ngayKham"
          value={form.ngayKham}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2"
        />

        <input
          type="time"
          name="gioKham"
          value={form.gioKham}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2"
        />

        {/* PHÒNG KHÁM (Tự động điền nếu có bác sĩ được chọn) */}
        <input
          name="phong"
          value={form.phong}
          onChange={handleChange}
          placeholder="Phòng khám"
          // Vô hiệu hóa nếu đã có bác sĩ được chọn (đã auto-fill)
          disabled={!!form.maBS} 
          className="border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100"
        />

        <textarea
          name="ghiChu"
          value={form.ghiChu}
          onChange={handleChange}
          placeholder="Ghi chú (Ví dụ: Mã giới thiệu BSXXXX)"
          className="border border-gray-300 rounded px-3 py-2 col-span-1 md:col-span-2"
        />

        <div className="md:col-span-3">
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
          >
            ➕ Đăng ký
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="min-w-full text-sm bg-white shadow rounded">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Mã lịch</th>
              <th className="px-4 py-2 text-left">Bệnh nhân</th>
              <th className="px-4 py-2 text-left">Bác sĩ</th>
              <th className="px-4 py-2 text-left">Ngày</th>
              <th className="px-4 py-2 text-left">Giờ</th>
              <th className="px-4 py-2 text-left">Phòng</th>
              <th className="px-4 py-2 text-left">Ghi chú</th>
              <th className="px-4 py-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {list.map((l) => (
              <tr key={l.maLich} className="border-t">
                <td className="px-4 py-2">{l.maLich}</td>
                <td className="px-4 py-2">{l.BenhNhan?.hoTen}</td>
                <td className="px-4 py-2">{l.BacSi?.hoTen}</td>
                <td className="px-4 py-2">{l.ngayKham}</td>
                <td className="px-4 py-2">{l.gioKham}</td>
                <td className="px-4 py-2">{l.phong}</td>
                <td className="px-4 py-2">{l.ghiChu}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(l.maLich)}
                    className="text-red-600 hover:underline"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-gray-500 py-4">
                  Không có lịch hẹn nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DangKyKhamPage;
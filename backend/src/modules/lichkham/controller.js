const db = require("../../models"); // Import toàn bộ models object (bao gồm sequelize instance)
const { LichKham, BacSi, BenhNhan, LichLamViec, CaKham, HoaDon, ChiTietHoaDon } = db; // Destructuring models cần thiết
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize"); // Import Op

//  Lấy toàn bộ lịch khám
exports.getAll = async (req, res) => {
  try {
    const data = await LichKham.findAll({
      include: [
        { model: BacSi, attributes: ["hoTen"] },
        { model: BenhNhan, attributes: ["hoTen"] }
      ]
    });
    res.json({ message: "Lấy danh sách lịch khám", data });
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy lịch khám", error: err.message });
  }
};

//  Tạo lịch khám mới (ĐÃ HOÀN THIỆN LOGIC TỰ ĐỘNG SẮP XẾP VÀ KIỂM TRA CA LÀM VIỆC)
exports.create = async (req, res) => {
  try {
    let { maBN, maBS, ngayKham, gioKham, tenKhoa, phong, ghiChu } = req.body;
    let maBacSi = maBS; 

    const today = new Date();
    const inputDate = new Date(ngayKham);

    // ⚠️ 1-4. Kiểm tra ràng buộc Ngày/Giờ
    if (inputDate < today.setHours(0, 0, 0, 0)) {
      return res.status(400).json({ message: "❌ Không được chọn ngày trong quá khứ" });
    }
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    if (inputDate > maxDate) {
      return res.status(400).json({ message: "❌ Chỉ được đặt lịch trong vòng 30 ngày tới" });
    }
    const ngayKhamObj = new Date(ngayKham); // Re-create Date object after modifying 'today'
    if (ngayKhamObj.getDay() === 0) {
      return res.status(400).json({ message: "❌ Không thể đặt lịch vào Chủ nhật" });
    }
    const gioInt = parseInt(gioKham.split(":")[0], 10);
    if (gioInt < 7 || gioInt > 17) {
      return res.status(400).json({ message: "❌ Chỉ được đặt lịch trong giờ hành chính (7h-17h)" });
    }
    
    // ✅ KIỂM TRA BẮT BUỘC KHOA 
    if (!tenKhoa || tenKhoa === 'undefined') {
        return res.status(400).json({ message: "❌ Vui lòng chọn một Khoa khám bệnh hợp lệ." });
    }
    
    // --- LOGIC XÁC ĐỊNH BÁC SĨ (Ưu tiên lựa chọn/mã GT) ---
    
    // 1. Kiểm tra Mã giới thiệu trong Ghi chú
    const maGioiThieuMatch = ghiChu ? ghiChu.match(/(BS\d{3,})/) : null;
    const maGioiThieu = maGioiThieuMatch ? maGioiThieuMatch[0].trim() : null;
    
    if (maGioiThieu) {
      // 1a. Có mã giới thiệu: Ép buộc maBS phải khớp
      if (maGioiThieu !== maBS) {
        return res.status(400).json({ message: `❌ Mã giới thiệu ${maGioiThieu} không khớp với Bác sĩ đã chọn (${maBS}). Vui lòng chọn đúng bác sĩ được giới thiệu.` });
      }
      maBacSi = maGioiThieu; // Xác nhận maBS từ mã giới thiệu
      
    } else if (!maBS) {
      // 1b. KHÔNG có mã giới thiệu VÀ không chọn bác sĩ -> Tự động sắp xếp
        
        // Xác định CaKham dựa trên gioKham
        let tenCaKham = (gioInt < 12) ? 'Ca Sáng' : 'Ca Chiều';

        const caKham = await CaKham.findOne({
            where: { tenCa: tenCaKham }
        });

        if (!caKham) {
            return res.status(400).json({ message: `Không tìm thấy Ca Khám với tên "${tenCaKham}". Vui lòng kiểm tra dữ liệu CaKham.` });
        }

        // 2. Tìm tất cả Bác sĩ thuộc Khoa và có lịch làm việc trong CaKham đó
        const availableDoctors = await LichLamViec.findAll({
            attributes: ['maBS'],
            where: {
                ngayLamViec: ngayKham,
                maCa: caKham.maCa,
                maBS: { [Op.not]: null } 
            },
            include: [{
                model: BacSi,
                required: true,
                attributes: ['maBS'],
                where: {
                    maKhoa: tenKhoa, // Lọc theo maKhoa
                }
            }],
            raw: true,
            nest: true
        });

        if (availableDoctors.length === 0) {
            return res.status(400).json({ message: `Không có bác sĩ nào thuộc khoa "${tenKhoa}" có lịch làm việc trong ca ${tenCaKham} ngày ${ngayKham}.` });
        }

        const doctorList = availableDoctors.map(doc => doc.maBS); 

        // 3. Đếm số lượng Lịch khám đã có
        const existingAppointments = await LichKham.findAll({
            attributes: ['maBS', [db.sequelize.fn('COUNT', db.sequelize.col('maLich')), 'count']],
            where: {
                ngayKham: ngayKham,
                maBS: { [Op.in]: doctorList }
            },
            group: ['maBS'],
            raw: true
        });

        // 4. Tìm bác sĩ có số lượng lịch khám ít nhất (và dưới 10)
        const appointmentMap = {};
        doctorList.forEach(id => appointmentMap[id] = 0);
        existingAppointments.forEach(item => { appointmentMap[item.maBS] = parseInt(item.count, 10); });

        let minAppointments = Infinity;
        let bestDoctor = null;

        for (const docId of doctorList) {
            const count = appointmentMap[docId];
            if (count < 10) { 
                if (count < minAppointments) {
                    minAppointments = count;
                    bestDoctor = docId;
                }
            }
        }

        if (!bestDoctor) {
            return res.status(400).json({ message: 'Không thể sắp xếp bác sĩ tự động. Tất cả bác sĩ trong ca đã đủ 10 lượt khám.' });
        }
        
        maBacSi = bestDoctor;
        ghiChu = (ghiChu ? ghiChu + ' ' : '') + `[HT: Tự sắp xếp BS ${maBacSi} - ${tenCaKham}]`; 
      
    } else {
        maBacSi = maBS; // Bác sĩ đã được chọn (hoặc từ mã GT)
    }
    
    // ===============================================
    // ✅ KIỂM TRA BÁC SĨ ĐÃ CHỌN CÓ LỊCH LÀM VIỆC KHÔNG
    // ===============================================
    if (maBacSi) {
        const gioIntCheck = parseInt(gioKham.split(":")[0], 10);
        const tenCaKhamCheck = (gioIntCheck < 12) ? 'Ca Sáng' : 'Ca Chiều';
        
        const caKhamCheck = await CaKham.findOne({ where: { tenCa: tenCaKhamCheck } });
        if (!caKhamCheck) {
             return res.status(400).json({ message: "❌ Lỗi hệ thống: Không tìm thấy định nghĩa Ca làm việc." });
        }

        // Tìm LichLamViec cho bác sĩ này vào ngày này và ca này
        const lichLamViecCheck = await LichLamViec.findOne({
            where: {
                maBS: maBacSi,
                ngayLamViec: ngayKham,
                maCa: caKhamCheck.maCa
            }
        });

        if (!lichLamViecCheck) {
             return res.status(400).json({ message: `❌ Bác sĩ ${maBacSi} không có ca làm việc vào ngày ${ngayKham} trong ${tenCaKhamCheck}. Vui lòng chọn bác sĩ khác hoặc khung giờ khác.` });
        }
    }


    // ⚠️ 5. Kiểm tra trùng ca khám tuyệt đối
    if (!maBacSi) {
         return res.status(500).json({ message: "❌ Lỗi hệ thống: Không thể xác định Bác sĩ cho lịch khám." });
    }

    const exists = await LichKham.findOne({
      where: { maBS: maBacSi, ngayKham, gioKham }
    });
    if (exists) {
      return res.status(400).json({ message: `❌ Bác sĩ ${maBacSi} đã có lịch hẹn tại CHÍNH KHUNG GIỜ NÀY.` });
    }

    // ⚠️ 6. Mỗi bệnh nhân tối đa 2 lịch/ngày (Giữ nguyên)
    const daDat = await LichKham.count({ where: { maBN, ngayKham } });
    if (daDat >= 2) {
      return res.status(400).json({ message: "❌ Bạn không được đặt quá 2 lịch hẹn trong cùng một ngày" });
    }

    // ✅ OK – Tạo lịch mới với trạng thái CHO_THANH_TOAN
    const maLich = uuidv4().slice(0, 8).toUpperCase();
    
    // ✅ Tạo hóa đơn tự động cho lịch khám
    const maHD = uuidv4().slice(0, 8).toUpperCase();
    const giaKham = 100000; // Giá khám mặc định (có thể lấy từ bảng dịch vụ sau)
    
    // Tạo hóa đơn
    const hoaDon = await HoaDon.create({
      maHD,
      maBN,
      maNS: "SYSTEM",
      tongTien: giaKham,
      trangThai: "CHUA_THANH_TOAN"
    });
    
    // Tạo chi tiết hóa đơn (dịch vụ khám)
    const maCTHD = uuidv4().slice(0, 8).toUpperCase();
    await ChiTietHoaDon.create({
      maCTHD,
      maHD,
      loaiDichVu: "KHAM",
      maDichVu: maLich, // Dùng maLich làm maDichVu
      donGia: giaKham,
      soLuong: 1,
      thanhTien: giaKham
    });
    
    // Tạo lịch với trạng thái và liên kết hóa đơn
    const lich = await LichKham.create({ 
      maLich, 
      maBN, 
      maBS: maBacSi, 
      ngayKham, 
      gioKham, 
      tenKhoa, 
      phong, 
      ghiChu,
      trangThai: "CHO_THANH_TOAN",
      thoiGianTao: new Date(),
      maHD: maHD
    });

    res.status(201).json({ 
      message: "✅ Đặt lịch thành công! Vui lòng thanh toán trong 15 phút.", 
      data: { ...lich.toJSON(), maHD, tongTien: giaKham }
    });

  } catch (err) {
    console.error("❌ Lỗi tạo lịch khám:", err);
    res.status(500).json({ message: "❌ Lỗi tạo lịch khám", error: err.message });
  }
};

// EXPORT CÁC HÀM CÒN THIẾU
exports.getByMaBN = async (req, res) => {
  try {
    const data = await LichKham.findAll({
      where: { maBN: req.params.maBN },
      include: [
        { model: BacSi, attributes: ["hoTen"] },
        { model: BenhNhan, attributes: ["hoTen"] }
      ],
      order: [["thoiGianTao", "DESC"]] // Sắp xếp theo thời gian tạo mới nhất
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy lịch theo maBN", error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { ngayKham, gioKham, phong, ghiChu } = req.body;
    const [updated] = await LichKham.update(
      { ngayKham, gioKham, phong, ghiChu },
      { where: { maLich: req.params.id } }
    );
    if (updated === 0)
      return res.status(404).json({ message: "Không tìm thấy lịch để cập nhật" });

    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật lịch khám", error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await LichKham.destroy({ where: { maLich: req.params.id } });
    if (deleted === 0)
      return res.status(404).json({ message: "Không tìm thấy lịch để xoá" });
    res.json({ message: "Xoá thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá lịch khám", error: err.message });
  }
};

exports.checkTrungLich = async (req, res) => {
  try {
    const { maBS, ngay, gio } = req.query;

    const exists = await LichKham.findOne({
      where: {
        maBS,
        ngayKham: ngay,
        gioKham: gio
      }
    });

    res.json({ trung: !!exists });
  } catch (err) {
    res.status(500).json({ message: "Lỗi kiểm tra lịch", error: err.message });
  }
};

exports.getByMaBS = async (req, res) => {
  try {
    const maBS = req.params.maBS; 
    
    if (!maBS) {
       return res.status(400).json({ success: false, message: "❌ Thiếu mã bác sĩ (maBS) trong tham số URL." });
    }

    const data = await LichKham.findAll({
      where: { maBS: maBS }, // Lọc theo maBS từ URL
      include: [
        { model: BacSi, attributes: ["hoTen"] },
        { model: BenhNhan, attributes: ["hoTen"] }
      ],
      order: [["ngayKham", "DESC"]] // Sắp xếp theo ngày mới nhất
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy lịch hẹn theo bác sĩ", error: err.message });
  }
};
import React, { useState, useEffect } from "react";
import axios from "../../api/axiosClient";
import toast from "react-hot-toast";
import { useParams, useNavigate, useLocation } from "react-router-dom";

function CreateUserForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const location = useLocation();
  const userFromState = location.state?.user;

  const [dsKhoa, setDsKhoa] = useState([]);
  
  // State chứa dữ liệu form
  const [form, setForm] = useState({
    tenDangNhap: "",
    matKhau: "",
    email: "",
    vaiTro: "", // maNhom
    maKhoa: "",
    loaiNS: "",
    capBac: "",
    chuyenMon: "",
    hoTen: "",
    trinhDo: "",
    chucVu: "",
    ngaySinh: "",
    gioiTinh: "Nam",
    diaChi: "",
    soDienThoai: "",
    bhyt: ""
  });

  // State chứa lỗi hiển thị (đỏ)
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Tải danh sách Khoa
  const fetchKhoa = async () => {
    try {
      const res = await axios.get("/khoa", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Xử lý an toàn cho dữ liệu trả về
      const data = res.data.data || res.data;
      setDsKhoa(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi tải khoa:", err);
      toast.error("Không thể tải danh sách khoa");
    }
  };

  useEffect(() => {
    fetchKhoa();
    if (isEdit) {
      if (userFromState) {
        fillForm(userFromState);
      } else {
        axios
          .get(`/tai-khoan/${id}`, { headers: { Authorization: `Bearer ${token}` } })
          .then((res) => fillForm(res.data))
          .catch(() => toast.error("Không tải được thông tin tài khoản"));
      }
    }
  }, [id]);

  const fillForm = (u) => {
    setForm({
      tenDangNhap: u.tenDangNhap || "",
      matKhau: "", // Không điền mật khẩu cũ
      email: u.email || "",
      vaiTro: u.maNhom || "",
      maKhoa: u.maKhoa || "",
      loaiNS: u.loaiNS || "",
      capBac: u.capBac || "",
      chuyenMon: u.chuyenMon || "",
      hoTen: u.hoTen || "",
      trinhDo: u.trinhDo || "",
      chucVu: u.chucVu || "",
      ngaySinh: u.ngaySinh ? u.ngaySinh.split('T')[0] : "",
      gioiTinh: u.gioiTinh || "Nam",
      diaChi: u.diaChi || "",
      soDienThoai: u.soDienThoai || "",
      bhyt: u.bhyt || ""
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Xóa lỗi của trường đang nhập
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // === HÀM VALIDATE CLIENT-SIDE ===
  const validateForm = () => {
    const newErrors = {};
    
    // 1. Tên đăng nhập
    if (!form.tenDangNhap.trim()) newErrors.tenDangNhap = "Tên đăng nhập là bắt buộc";
    else if (form.tenDangNhap.length < 4) newErrors.tenDangNhap = "Phải từ 4 ký tự trở lên";

    // 2. Email
    if (!form.email) newErrors.email = "Email là bắt buộc";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Email không đúng định dạng";

    // 3. Vai trò
    if (!form.vaiTro) newErrors.vaiTro = "Vui lòng chọn vai trò";

    // 4. Mật khẩu (Chỉ check khi tạo mới)
    if (!isEdit) {
      if (!form.matKhau) {
        newErrors.matKhau = "Mật khẩu là bắt buộc";
      } else {
        // Regex: 8 ký tự, 1 hoa, 1 thường, 1 số
        const strongPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
        if (!strongPass.test(form.matKhau)) {
          newErrors.matKhau = "Mật khẩu yếu: Cần 8+ ký tự, có Hoa, Thường, Số";
        }
      }
    }

    // 5. Các trường phụ theo vai trò
    if ((form.vaiTro === "BACSI" || form.vaiTro === "NHANSU") && !form.maKhoa) {
      newErrors.maKhoa = "Vui lòng chọn khoa";
    }
    if (form.vaiTro === "NHANSU" && !form.loaiNS) newErrors.loaiNS = "Vui lòng chọn loại nhân sự";
    if (form.vaiTro === "BENHNHAN" && !form.hoTen) newErrors.hoTen = "Họ tên là bắt buộc";

    setErrors(newErrors);
    // Trả về true nếu không có lỗi
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🛑 CHẶN NGAY NẾU SAI FORM (Client-side)
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin nhập vào!");
      return;
    }

    setLoading(true);

    const payload = {
      tenDangNhap: form.tenDangNhap,
      email: form.email,
      maNhom: form.vaiTro,
    };
    if (!isEdit) payload.matKhau = form.matKhau;
    
    // Gán các trường tùy chọn
    if (["BACSI", "NHANSU"].includes(form.vaiTro)) payload.maKhoa = form.maKhoa;
    
    if (form.vaiTro === "NHANSU") {
      Object.assign(payload, { hoTen: form.hoTen, loaiNS: form.loaiNS, capBac: form.capBac, chuyenMon: form.chuyenMon });
    }
    if (form.vaiTro === "BACSI") {
      Object.assign(payload, { hoTen: form.hoTen, chuyenMon: form.chuyenMon, trinhDo: form.trinhDo, chucVu: form.chucVu });
    }
    if (form.vaiTro === "BENHNHAN") {
      Object.assign(payload, { 
        hoTen: form.hoTen, ngaySinh: form.ngaySinh, gioiTinh: form.gioiTinh, 
        diaChi: form.diaChi, soDienThoai: form.soDienThoai, bhyt: form.bhyt 
      });
    }

    try {
      if (isEdit) {
        await axios.put(`/tai-khoan/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("Cập nhật tài khoản thành công");
      } else {
        await axios.post("/tai-khoan", payload, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("Tạo tài khoản thành công");
      }
      // Chuyển hướng về danh sách sau khi thành công
      navigate("/admin/taikhoan");
      
    } catch (err) {
      const errorData = err.response?.data;
      const message = errorData?.message || "Lỗi hệ thống";
      toast.error(`❌ ${message}`);

      // === QUAN TRỌNG: HIỂN THỊ LỖI TỪ BACKEND LÊN FORM ===
      if (errorData?.errors && Array.isArray(errorData.errors)) {
         const serverErrors = {};
         errorData.errors.forEach(e => {
             // Map tên trường từ backend về frontend state
             let fieldName = e.truong;
             if (fieldName === 'maNhom') fieldName = 'vaiTro'; // Map maNhom -> vaiTro
             
             // Chỉ lấy lỗi đầu tiên cho mỗi trường
             if (!serverErrors[fieldName]) {
                 serverErrors[fieldName] = e.thongDiep;
             }
         });
         setErrors(serverErrors); // Cập nhật state lỗi để hiện dòng đỏ
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper để hiển thị lỗi input
  const ErrorMsg = ({ field }) => (
    errors[field] ? <p className="text-red-500 text-xs mt-1 italic flex items-center gap-1">⚠️ {errors[field]}</p> : null
  );

  const inputClass = (field) => `border p-2 w-full rounded transition-colors ${errors[field] ? 'border-red-500 bg-red-50 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'} outline-none focus:ring-2`;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button onClick={() => navigate("/admin/taikhoan")} className="mb-4 text-gray-500 hover:text-gray-700 flex items-center gap-1">
        ⬅ Quay lại danh sách
      </button>
      
      <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-blue-800 border-b pb-2">
          {isEdit ? "✏️ Cập nhật tài khoản" : "➕ Tạo tài khoản mới"}
        </h2>

        {/* --- THÔNG TIN ĐĂNG NHẬP --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="tenDangNhap" 
              value={form.tenDangNhap} 
              onChange={handleChange} 
              className={inputClass('tenDangNhap')}
              disabled={isEdit} 
            />
            <ErrorMsg field="tenDangNhap" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
            <input 
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              className={inputClass('email')}
            />
            <ErrorMsg field="email" />
          </div>
        </div>

        {/* Mật khẩu */}
        {!isEdit && (
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu <span className="text-red-500">*</span></label>
            <input 
              type="password" 
              name="matKhau" 
              value={form.matKhau} 
              onChange={handleChange} 
              className={inputClass('matKhau')}
              placeholder="••••••••"
            />
            <ErrorMsg field="matKhau" />
            {!errors.matKhau && <p className="text-xs text-gray-500 mt-1">* Yêu cầu: 8+ ký tự, Hoa, Thường, Số.</p>}
          </div>
        )}

        {/* Vai trò */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò hệ thống <span className="text-red-500">*</span></label>
          <select name="vaiTro" value={form.vaiTro} onChange={handleChange} className={inputClass('vaiTro')}>
            <option value="">-- Chọn vai trò --</option>
            <option value="BACSI">Bác sĩ</option>
            <option value="NHANSU">Nhân viên y tế</option>
            <option value="BENHNHAN">Bệnh nhân</option>
            <option value="ADMIN">Quản trị viên</option>
          </select>
          <ErrorMsg field="vaiTro" />
        </div>

        {/* --- CÁC TRƯỜNG PHỤ THEO VAI TRÒ --- */}
        
        {/* Khoa (Cho Bác sĩ & Nhân sự) */}
        {(form.vaiTro === "BACSI" || form.vaiTro === "NHANSU") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Khoa / Phòng ban <span className="text-red-500">*</span></label>
            <select name="maKhoa" value={form.maKhoa} onChange={handleChange} className={inputClass('maKhoa')}>
              <option value="">-- Chọn khoa --</option>
              {dsKhoa.map((khoa) => (
                <option key={khoa.maKhoa} value={khoa.maKhoa}>
                  {khoa.tenKhoa} ({khoa.maKhoa})
                </option>
              ))}
            </select>
            <ErrorMsg field="maKhoa" />
          </div>
        )}

        {/* Form Nhân sự */}
        {form.vaiTro === "NHANSU" && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-200">
            <h3 className="font-semibold text-gray-700">Thông tin nhân viên</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input type="text" name="hoTen" value={form.hoTen} onChange={handleChange} placeholder="Họ tên" className={inputClass('hoTen')} />
                <ErrorMsg field="hoTen" />
              </div>
              <div>
                <select name="loaiNS" value={form.loaiNS} onChange={handleChange} className={inputClass('loaiNS')}>
                  <option value="">-- Loại nhân sự --</option>
                  <option value="YT">Y tá / Điều dưỡng</option>
                  <option value="XN">Kỹ thuật viên XN</option>
                  <option value="TN">Tiếp nhận</option>
                  <option value="HC">Hành chính</option>
                </select>
                <ErrorMsg field="loaiNS" />
              </div>
              <input type="text" name="capBac" value={form.capBac} onChange={handleChange} placeholder="Cấp bậc" className="border p-2 rounded" />
              <input type="text" name="chuyenMon" value={form.chuyenMon} onChange={handleChange} placeholder="Chuyên môn" className="border p-2 rounded" />
            </div>
          </div>
        )}

        {/* Form Bác sĩ */}
        {form.vaiTro === "BACSI" && (
          <div className="bg-blue-50 p-4 rounded-lg space-y-3 border border-blue-100">
            <h3 className="font-semibold text-blue-800">Thông tin bác sĩ</h3>
            <div className="grid grid-cols-2 gap-4">
               <div>
                <input type="text" name="hoTen" value={form.hoTen} onChange={handleChange} placeholder="Họ tên bác sĩ" className={inputClass('hoTen')} />
                <ErrorMsg field="hoTen" />
              </div>
              <input type="text" name="chuyenMon" value={form.chuyenMon} onChange={handleChange} placeholder="Chuyên môn" className="border p-2 rounded" />
              <input type="text" name="trinhDo" value={form.trinhDo} onChange={handleChange} placeholder="Trình độ (ThS, TS...)" className="border p-2 rounded" />
              <input type="text" name="chucVu" value={form.chucVu} onChange={handleChange} placeholder="Chức vụ" className="border p-2 rounded" />
            </div>
          </div>
        )}

        {/* Form Bệnh nhân */}
        {form.vaiTro === "BENHNHAN" && (
          <div className="bg-green-50 p-4 rounded-lg space-y-3 border border-green-100">
            <h3 className="font-semibold text-green-800">Thông tin bệnh nhân</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <input type="text" name="hoTen" value={form.hoTen} onChange={handleChange} placeholder="Họ và tên" className={inputClass('hoTen')} />
                <ErrorMsg field="hoTen" />
              </div>
              <input type="date" name="ngaySinh" value={form.ngaySinh} onChange={handleChange} className="border p-2 rounded" />
              <select name="gioiTinh" value={form.gioiTinh} onChange={handleChange} className="border p-2 rounded">
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
              <input type="text" name="soDienThoai" value={form.soDienThoai} onChange={handleChange} placeholder="Số điện thoại" className="border p-2 rounded" />
              <input type="text" name="bhyt" value={form.bhyt} onChange={handleChange} placeholder="Mã BHYT" className="border p-2 rounded" />
              <input type="text" name="diaChi" value={form.diaChi} onChange={handleChange} placeholder="Địa chỉ" className="border p-2 rounded md:col-span-2" />
            </div>
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg text-white font-bold shadow-md transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'}`}
        >
          {loading ? "⏳ Đang xử lý..." : (isEdit ? "💾 Cập nhật tài khoản" : "✅ Tạo tài khoản mới")}
        </button>
      </form>
    </div>
  );
}

export default CreateUserForm;
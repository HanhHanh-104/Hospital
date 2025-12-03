import React, { useEffect, useState } from "react";
import axios from "../../api/axiosClient";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Building2,
  Stethoscope,
  Briefcase,
  GraduationCap,
  Award,
  Save,
  Edit2,
  X,
  Info
} from "lucide-react";
import { getChuyenMonByCapBac, getMoTaChuyenMon } from "../../constants/chuyenMon";

// Component hiển thị cấp bậc
const CapBacBadge = ({ capBac }) => {
  const getBadgeStyle = (capBac) => {
    const styles = {
      "Bác sĩ thực tập": "bg-gray-100 text-gray-700 border-gray-300",
      "Bác sĩ sơ cấp": "bg-blue-100 text-blue-700 border-blue-300",
      "Bác sĩ điều trị": "bg-green-100 text-green-700 border-green-300",
      "Bác sĩ chuyên khoa I": "bg-purple-100 text-purple-700 border-purple-300",
      "Bác sĩ chuyên khoa II": "bg-indigo-100 text-indigo-700 border-indigo-300",
      "Thạc sĩ – Bác sĩ": "bg-orange-100 text-orange-700 border-orange-300",
      "Tiến sĩ – Bác sĩ": "bg-red-100 text-red-700 border-red-300",
      "Phó giáo sư – Bác sĩ": "bg-yellow-100 text-yellow-700 border-yellow-300",
      "Giáo sư – Bác sĩ": "bg-gradient-to-r from-amber-400 to-yellow-500 text-white border-amber-500"
    };
    return styles[capBac] || styles["Bác sĩ điều trị"];
  };

  return (
    <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getBadgeStyle(capBac)}`}>
      {capBac || "Bác sĩ điều trị"}
    </span>
  );
};

const ThongTinCaNhanPage = () => {
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [khoaList, setKhoaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    hoTen: "",
    chuyenMon: "",
    chucVu: "",
    trinhDo: "",
    capBac: "",
    maKhoa: ""
  });

  const capBacOptions = [
    "Bác sĩ thực tập",
    "Bác sĩ sơ cấp",
    "Bác sĩ điều trị",
    "Bác sĩ chuyên khoa I",
    "Bác sĩ chuyên khoa II",
    "Thạc sĩ – Bác sĩ",
    "Tiến sĩ – Bác sĩ",
    "Phó giáo sư – Bác sĩ",
    "Giáo sư – Bác sĩ"
  ];

  useEffect(() => {
    fetchDoctorInfo();
    fetchKhoaList();
  }, []);

  const fetchDoctorInfo = async () => {
    try {
      setLoading(true);
      const maTK = localStorage.getItem("maTK");
      if (!maTK) {
        toast.error("Không tìm thấy thông tin đăng nhập");
        return;
      }

      const res = await axios.get(`/bacsi/maTK/${maTK}`);
      const data = res.data.data || res.data;
      setDoctorInfo(data);
      
      setFormData({
        hoTen: data.hoTen || "",
        chuyenMon: data.chuyenMon || "",
        chucVu: data.chucVu || "",
        trinhDo: data.trinhDo || "",
        capBac: data.capBac || "Bác sĩ điều trị",
        maKhoa: data.maKhoa || ""
      });
    } catch (err) {
      console.error("Lỗi tải thông tin bác sĩ:", err);
      toast.error("Không thể tải thông tin bác sĩ");
    } finally {
      setLoading(false);
    }
  };

  const fetchKhoaList = async () => {
    try {
      const res = await axios.get("/khoa");
      setKhoaList(res.data.data || res.data || []);
    } catch (err) {
      console.error("Lỗi tải danh sách khoa:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const maBS = doctorInfo.maBS;
      
      await axios.put(`/bacsi/${maBS}`, formData);
      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
      await fetchDoctorInfo();
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      toast.error("Không thể cập nhật thông tin: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      hoTen: doctorInfo.hoTen || "",
      chuyenMon: doctorInfo.chuyenMon || "",
      chucVu: doctorInfo.chucVu || "",
      trinhDo: doctorInfo.trinhDo || "",
      capBac: doctorInfo.capBac || "Bác sĩ điều trị",
      maKhoa: doctorInfo.maKhoa || ""
    });
    setIsEditing(false);
  };

  if (loading && !doctorInfo) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!doctorInfo) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Không tìm thấy thông tin bác sĩ</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <User size={48} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{doctorInfo.hoTen}</h1>
              <div className="flex items-center gap-3">
                {doctorInfo.capBac && <CapBacBadge capBac={doctorInfo.capBac} />}
                {doctorInfo.KhoaPhong?.tenKhoa && (
                  <span className="text-blue-100 text-sm flex items-center gap-1">
                    <Building2 size={16} />
                    {doctorInfo.KhoaPhong.tenKhoa}
                  </span>
                )}
              </div>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Edit2 size={20} />
              Chỉnh sửa
            </button>
          )}
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <User className="text-blue-600" size={24} />
          Thông tin cá nhân
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Họ tên */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ tên
            </label>
            {isEditing ? (
              <input
                type="text"
                name="hoTen"
                value={formData.hoTen}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800 font-medium">{doctorInfo.hoTen}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Mail size={16} />
              Email
            </label>
            <p className="text-gray-800">{doctorInfo.TaiKhoan?.email || "Chưa có"}</p>
          </div>

          {/* Chuyên môn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Stethoscope size={16} />
              Chuyên môn
              {isEditing && formData.capBac && (
                <span className="text-xs text-gray-500 font-normal flex items-center gap-1">
                  <Info size={14} />
                  {getMoTaChuyenMon(formData.capBac)}
                </span>
              )}
            </label>
            {isEditing ? (
              <select
                name="chuyenMon"
                value={formData.chuyenMon}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={!formData.capBac}
              >
                <option value="">
                  {formData.capBac 
                    ? `-- Chọn chuyên môn (${getChuyenMonByCapBac(formData.capBac).length} lựa chọn) --` 
                    : "-- Vui lòng chọn cấp bậc trước --"}
                </option>
                {formData.capBac && getChuyenMonByCapBac(formData.capBac).map((cm) => (
                  <option key={cm} value={cm}>
                    {cm}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-gray-800">{doctorInfo.chuyenMon || "Chưa có"}</p>
            )}
            {isEditing && !formData.capBac ? (
              <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                <Info size={12} />
                Vui lòng chọn cấp bậc trước để hiển thị danh sách chuyên môn phù hợp
              </p>
            ) : isEditing && formData.capBac && (
              <p className="text-xs text-gray-500 mt-1">
                Có {getChuyenMonByCapBac(formData.capBac).length} chuyên môn phù hợp với cấp bậc này
              </p>
            )}
          </div>

          {/* Chức vụ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Briefcase size={16} />
              Chức vụ
            </label>
            {isEditing ? (
              <input
                type="text"
                name="chucVu"
                value={formData.chucVu}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ví dụ: Trưởng khoa, Phó khoa..."
              />
            ) : (
              <p className="text-gray-800">{doctorInfo.chucVu || "Chưa có"}</p>
            )}
          </div>

          {/* Trình độ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <GraduationCap size={16} />
              Trình độ
            </label>
            {isEditing ? (
              <input
                type="text"
                name="trinhDo"
                value={formData.trinhDo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ví dụ: Đại học, Thạc sĩ, Tiến sĩ..."
              />
            ) : (
              <p className="text-gray-800">{doctorInfo.trinhDo || "Chưa có"}</p>
            )}
          </div>

          {/* Cấp bậc */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Award size={16} />
              Cấp bậc
            </label>
            {isEditing ? (
              <select
                name="capBac"
                value={formData.capBac}
                onChange={(e) => {
                  handleChange(e);
                  // Reset chuyên môn khi thay đổi cấp bậc
                  setFormData(prev => ({ ...prev, capBac: e.target.value, chuyenMon: "" }));
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {capBacOptions.map((capBac) => (
                  <option key={capBac} value={capBac}>
                    {capBac}
                  </option>
                ))}
              </select>
            ) : (
              <div className="mt-1">
                <CapBacBadge capBac={doctorInfo.capBac || "Bác sĩ điều trị"} />
              </div>
            )}
          </div>

          {/* Khoa */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Building2 size={16} />
              Khoa
            </label>
            {isEditing ? (
              <select
                name="maKhoa"
                value={formData.maKhoa}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Chọn khoa --</option>
                {khoaList.map((khoa) => (
                  <option key={khoa.maKhoa} value={khoa.maKhoa}>
                    {khoa.tenKhoa}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-gray-800">
                {doctorInfo.KhoaPhong?.tenKhoa || doctorInfo.maKhoa || "Chưa có"}
              </p>
            )}
          </div>
        </div>

        {/* Nút lưu/hủy */}
        {isEditing && (
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <X size={18} />
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        )}
      </div>

      {/* Thông tin tài khoản */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin tài khoản</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên đăng nhập
            </label>
            <p className="text-gray-800">{doctorInfo.TaiKhoan?.tenDangNhap || "Chưa có"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã bác sĩ
            </label>
            <p className="text-gray-800 font-mono">{doctorInfo.maBS}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThongTinCaNhanPage;


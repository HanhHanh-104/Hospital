import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import axios from "../../../api/axiosClient";
import toast from "react-hot-toast";

const emptyProfile = {
  hoTen: "",
  gioiTinh: "Nam",
  ngaySinh: "",
  diaChi: "",
  soDienThoai: "",
  bhyt: "",
  email: "",
};

const ThongTinCaNhanPage = () => {
  const [profile, setProfile] = useState(emptyProfile);
  const [initialProfile, setInitialProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    dayjs.locale("vi");
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const maBN = localStorage.getItem("maBN");
      const benhNhanRes = await axios.get(`/benhnhan/${maBN}`);
      const benhNhanData = benhNhanRes.data.data || benhNhanRes.data;
      const userRes = await axios.get("/auth/me");
      const userData = userRes.data;

      const formatted = {
        hoTen: benhNhanData.hoTen || "",
        gioiTinh: benhNhanData.gioiTinh || "Nam",
        ngaySinh: benhNhanData.ngaySinh
          ? new Date(benhNhanData.ngaySinh).toISOString().split("T")[0]
          : "",
        diaChi: benhNhanData.diaChi || "",
        soDienThoai: benhNhanData.soDienThoai || "",
        bhyt: benhNhanData.bhyt || "",
        email: userData.email || "",
      };

      setProfile(formatted);
      setInitialProfile(formatted);
      setLastUpdated(benhNhanData.updatedAt || benhNhanData.ngayCapNhat || new Date().toISOString());

      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        user.HoTen = formatted.hoTen || user.HoTen;
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải thông tin cá nhân.");
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = () =>
    profile.hoTen !== initialProfile.hoTen ||
    profile.gioiTinh !== initialProfile.gioiTinh ||
    profile.ngaySinh !== initialProfile.ngaySinh ||
    profile.diaChi !== initialProfile.diaChi ||
    profile.soDienThoai !== initialProfile.soDienThoai ||
    profile.bhyt !== initialProfile.bhyt;

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!hasChanges()) return;
    try {
      setLoading(true);
      await axios.put(`/benhnhan/${localStorage.getItem("maBN")}`, {
        hoTen: profile.hoTen,
        gioiTinh: profile.gioiTinh,
        ngaySinh: profile.ngaySinh,
        diaChi: profile.diaChi,
        soDienThoai: profile.soDienThoai,
        bhyt: profile.bhyt,
      });
      toast.success("Cập nhật thông tin thành công!");
      await fetchProfile();
    } catch (err) {
      toast.error("Không thể cập nhật: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Hero */}
        <div className="bg-gradient-to-r from-sky-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-1/3 bg-white/10 blur-3xl"></div>
          <div className="relative z-10">
            <p className="text-sm uppercase tracking-widest text-white/70 font-semibold">
              Hồ sơ cá nhân
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-3">Thông tin bệnh nhân</h1>
            <p className="text-white/85 max-w-2xl">
              Cập nhật chính xác thông tin liên hệ và bảo hiểm để bệnh viện hỗ trợ bạn nhanh nhất.
            </p>
            <div className="mt-4 text-sm text-white/75">
              Lần cập nhật gần nhất:{" "}
              {lastUpdated ? dayjs(lastUpdated).format("DD/MM/YYYY HH:mm") : "Chưa xác định"}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Thông tin liên hệ</h2>
              <p className="text-sm text-slate-500">
                Những trường có dấu * là bắt buộc để hoàn thiện hồ sơ.
              </p>
            </div>
            <button
              onClick={fetchProfile}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              Tải lại dữ liệu
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleUpdateProfile}>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="text-sm font-medium text-slate-700 space-y-1">
                Họ và tên *
                <input
                  name="hoTen"
                  value={profile.hoTen}
                  onChange={handleProfileChange}
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-sky-100 focus:outline-none"
                  required
                />
              </label>
              <label className="text-sm font-medium text-slate-700 space-y-1">
                Số điện thoại *
                <input
                  name="soDienThoai"
                  value={profile.soDienThoai}
                  onChange={handleProfileChange}
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-sky-100 focus:outline-none"
                  required
                />
              </label>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <label className="text-sm font-medium text-slate-700 space-y-1">
                Ngày sinh
                <input
                  type="date"
                  name="ngaySinh"
                  value={profile.ngaySinh}
                  onChange={handleProfileChange}
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-sky-100 focus:outline-none"
                />
              </label>
              <label className="text-sm font-medium text-slate-700 space-y-1">
                Giới tính
                <select
                  name="gioiTinh"
                  value={profile.gioiTinh}
                  onChange={handleProfileChange}
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-sky-100 focus:outline-none"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700 space-y-1">
                Mã BHYT
                <input
                  name="bhyt"
                  value={profile.bhyt}
                  onChange={handleProfileChange}
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-sky-100 focus:outline-none"
                  placeholder="VD: DN-4-12-345678"
                />
              </label>
            </div>

            <label className="text-sm font-medium text-slate-700 space-y-1">
              Địa chỉ liên hệ
              <input
                name="diaChi"
                value={profile.diaChi}
                onChange={handleProfileChange}
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-sky-100 focus:outline-none"
                placeholder="Số nhà, đường, quận/huyện, tỉnh/thành"
              />
            </label>

            <label className="text-sm font-medium text-slate-700 space-y-1">
              Email đăng nhập
              <input
                value={profile.email}
                disabled
                className="w-full border border-dashed border-slate-300 bg-slate-50 rounded-2xl px-4 py-3 text-slate-500 cursor-not-allowed"
              />
              <span className="text-xs text-slate-400">
                *Để thay đổi email, vui lòng liên hệ bộ phận hỗ trợ.
              </span>
            </label>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Thông tin sẽ giúp bác sĩ liên hệ và xác minh bảo hiểm y tế của bạn.
              </p>
              <button
                type="submit"
                disabled={loading || !hasChanges()}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white transition ${
                  loading || !hasChanges()
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-sky-600 hover:bg-sky-700"
                }`}
              >
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ThongTinCaNhanPage;


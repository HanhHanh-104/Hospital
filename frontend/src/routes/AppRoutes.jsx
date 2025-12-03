import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";

import AdminLayout from "../layouts/AdminLayout";
import AdminHome from "../pages/AdminHome";
import DoctorHome from "../pages/DoctorHome";
import PatientHome from "../pages/PatientHome";
import DoctorLayout from "../layouts/DoctorLayout";
import PatientLayout from "../layouts/PatientLayout";
import YtaLayout from "../layouts/YtaLayout"; //  import layout cho điều dưỡng / y tá
import XetNghiemLayout from "../layouts/XetNghiemLayout"; //  import layout cho nhân viên xét nghiệm
import TiepNhanLayout from "../layouts/TiepNhanLayout"; //  import layout cho nhân viên tiếp nhận
import YTaHome from "../pages/YTaHome"; //  import giao diện nhân viên y tá
import TiepNhanHome from "../pages/TiepNhanHome"; //  import giao diện nhân viên tiếp nhận
import XetNghiemHome from "../pages/XetNghiemHome"; //  import giao diện nhân viên xét nghiệm
import ForgotPasswordPage from "../pages/ForgotPasswordPage.jsx";
//--------------------------------------------------------------------------------


import PrivateRoute from "../auth/PrivateRoute"; //  import route bảo vệ
//--------------------------------------------------------------------------------
import CreateUserForm from "../pages/admin/CreateUserForm";//  import form tạo tài khoản người dùng
import AdminUserList from "../pages/admin/AdminUserList";//  import danh sách người dùng
import AssignRole from "../pages/admin/AssignRole";//  import phân quyền người dùng
import ManageKhoa from "../pages/admin/ManageKhoa";//  import quản lý khoa
import ManageBacSi from "../pages/admin/ManageBacSi";//  import quản lý bác sĩ
import ManageNhanSu from "../pages/admin/ManageNhanSu";//  import quản lý nhân sự
import ManageBenhNhan from "../pages/admin/ManageBenhNhan";//  import quản lý bệnh nhân
import ManageLichKham from "../pages/admin/ManageLichKham";//  import quản lý lịch khám
import ManageXetNghiem from "../pages/admin/ManageXetNghiem";//  import quản lý xét nghiệm
import ManageLoaiXN from "../pages/admin/ManageLoaiXN";//  import quản lý loại xét nghiệm
import ManageHoSoBenhAn from "../pages/admin/ManageHoSoBenhAn";//  import quản lý hồ sơ bệnh án
import ChiTietHSBAPage from "../pages/admin/ChiTietHSBAPage";
import QuanLyThuocPage from "../pages/admin/thuoc/QuanLyThuocPage";//  import quản lý thuốc
import QuanLyNhomThuoc from "../pages/admin/thuoc/QuanLyNhomThuoc";//  import quản lý nhóm thuốc
import QuanLyDonViTinh from "../pages/admin/thuoc/QuanLyDonViTinh";//  import quản lý đơn vị tính thuốc
import TroLyBacSiPage from "../pages/admin/nhansu/TroLyBacSiPage";  //  import quản lý trợ lý bác sĩ
import ThongKeHoaDonPage from "../pages/admin/thongke/ThongKeHoaDonPage"; //  import quản lý thống kê hóa đơn
import ThongKeLichLamViecPage from "../pages/admin/thongke/ThongKeLichLamViecPage";//  import quản lý thống kê lịch làm việc
import ThongKeLichKhamPage from "../pages/admin/thongke/ThongKeLichKhamPage";//  import quản lý thống kê lịch khám bệnh
import LienHeYKienPage from "../pages/benhnhan/lienhe/LienHeYKienPage";//  import trang liên hệ & ý kiến bệnh nhân
import TinTucPage from "../pages/benhnhan/tintuc/TinTucPage";//  import trang tin tức bệnh nhân
import ManagePhanHoiPage from "../pages/admin/ManagePhanHoiPage";//  import quản lý phản hồi admin
import ManageTinTucPage from "../pages/admin/ManageTinTucPage";//  import quản lý tin tức admin

//--------------------------------------------------------------------------------
import QuanLyYeuCauXNPage from "../pages/bacsi/xetnghiem/QuanLyYeuCauXNPage";//  import quản lý yêu cầu xét nghiệm
import LichLamViecPage from "../pages/bacsi/lich/LichLamViecPage";  //  import quản lý lịch làm việc bác sĩ
import QuanLyCaTrucPage from "../pages/admin/nhansu/QuanLyCaTrucPage";//  import quản lý ca trực bác sĩ
import PhieuKhamPage from "../pages/bacsi/kham/PhieuKhamPage";//  import quản lý phiếu khám bệnh
import KeDonThuocPage from "../pages/bacsi/kham/KeDonThuocPage";//  import quản lý kê đơn thuốc
import LichHenKhamPage from "../pages/benhnhan/lich/LichHenKhamPage";//  import quản lý lịch hẹn khám bệnh
import LichHenKhamPage_BS from "../pages/bacsi/lichhen/LichHenKhamPage_BS";//  import quản lý lịch hẹn khám bệnh
import ThongTinCaNhanPage_BS from "../pages/bacsi/ThongTinCaNhanPage";//  import trang thông tin cá nhân bác sĩ
//--------------------------------------------------------------------------------

import KetQuaXetNghiemPage from "../pages/benhnhan/xetnghiem/KetQuaXetNghiemPage";//  import quản lý kết quả xét nghiệm
import HoSoBenhAnPage from "../pages/benhnhan/hoso/HoSoBenhAnPage";//  import quản lý hồ sơ bệnh án
import GioHangThanhToanPage from "../pages/benhnhan/hoadon/GioHangThanhToanPage";//  import quản lý giỏ hàng thanh toán
import ThongTinCaNhanPage from "../pages/benhnhan/taikhoan/ThongTinCaNhanPage";//  trang thông tin cá nhân bệnh nhân
import BaoMatTaiKhoanPage from "../pages/benhnhan/taikhoan/BaoMatTaiKhoanPage";//  trang bảo mật tài khoản
//--------------------------------------------------------------------------------

import DangKyBenhNhanPage from "../pages/nhansu/YTa/DangKyBenhNhanPage";//  import quản lý đăng ký bệnh nhân
import GhiNhanTinhTrangPage from "../pages/nhansu/YTa/GhiNhanTinhTrangPage";//  import quản lý ghi nhận tình trạng bệnh nhân
import LichLamViecBacSiPage from "../pages/nhansu/YTa/LichLamViecBacSiPage";//  import quản lý lịch làm việc bác sĩ
import YeuCauXNTruocPage from "../pages/nhansu/xetnghiem/YeuCauXNTruocPage";//  import quản lý yêu cầu xét nghiệm trước
import PhieuXetNghiem_NSPage from "../pages/nhansu/xetnghiem/PhieuXetNghiem_NSPage";//  import quản lý phiếu xét nghiệm
import DangKyKham_NSPage from "../pages/nhansu/tiepnhan/DangKyKham_NSPage";//  import quản lý đăng ký khám bệnh
import LichHenPage from "../pages/nhansu/tiepnhan/LichHenPage";//  import quản lý lịch hẹn khám bệnh
import TiepNhanHoSoPage from "../pages/nhansu/tiepnhan/TiepNhanHoSoPage";//  import quản lý hồ sơ bệnh án
//--------------------------------------------------------------------------------





function AppRoutes() {
  return (
    <Routes>
      {/* Trang công khai */}
      <Route path="/" element={<HomePage />} /> 
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      {/*  Route cần đăng nhập */}
      <Route path="/admin" element={<PrivateRoute />}>
        <Route element={<AdminLayout />}>
        <Route index element={<AdminHome />} />
          <Route path="taikhoan" element={<AdminUserList />} />
          <Route path="taikhoan/tao-moi" element={<CreateUserForm />} />
          <Route path="taikhoan/sua/:id" element={<CreateUserForm />} />
          <Route path="taikhoan/phan-quyen" element={<AssignRole />} />
          <Route path="khoa" element={<ManageKhoa />} />
          <Route path="bacsi" element={<ManageBacSi />} />
          <Route path="nhansu" element={<ManageNhanSu />} />
          <Route path="benhnhan" element={<ManageBenhNhan />} />
          <Route path="lichkham" element={<ManageLichKham />} />
          <Route path="xetnghiem" element={<ManageXetNghiem />} />
          <Route path="loaixetnghiem" element={<ManageLoaiXN />} />
          <Route path="hosobenhan" element={<ManageHoSoBenhAn />} />
          <Route path="hosobenhan/:maHSBA" element={<ChiTietHSBAPage />} /> 
          <Route path="thuoc" element={<QuanLyThuocPage />} />
           <Route path="nhomthuoc" element={<QuanLyNhomThuoc />} />
          <Route path="donvitinh" element={<QuanLyDonViTinh />} />
          <Route path="thongke" element={<ThongKeHoaDonPage />} />
          <Route path="nhansu/troly" element={<TroLyBacSiPage />} />
          <Route path="nhansu/catruc" element={<QuanLyCaTrucPage />} />
          <Route path="thongke/lichlamviec" element={<ThongKeLichLamViecPage />} />
          <Route path="thongke/lickham" element={<ThongKeLichKhamPage />} />
          <Route path="phanhoi" element={<ManagePhanHoiPage />} />
          <Route path="tintuc" element={<ManageTinTucPage />} />


          {/* Thêm các route khác nếu cần */}         
        </Route>
      </Route>

      <Route path="/doctor" element={<PrivateRoute />}>
          <Route element={<DoctorLayout />}>
            <Route index element={<DoctorHome />} />
            <Route path="xetnghiem" element={<QuanLyYeuCauXNPage />} />   
            <Route path="lich" element={<LichLamViecPage />} />
            <Route path="kham" element={<PhieuKhamPage />} />
            <Route path="kham/donthuoc" element={<KeDonThuocPage />} />
            <Route path="lichhen" element={<LichHenKhamPage_BS />} />
            <Route path="taikhoan" element={<ThongTinCaNhanPage_BS />} />
          </Route>
      </Route>

      {/* Các route layout khác  */}
    

      <Route path="/patient" element={<PrivateRoute />}>
        <Route element={<PatientLayout />}>
          <Route index element={<PatientHome />} />
          <Route path="lich" element={<LichHenKhamPage />} />
          <Route path="xetnghiem" element={<KetQuaXetNghiemPage />} />
          <Route path="hoso" element={<HoSoBenhAnPage />} />
          <Route path="hoadon" element={<GioHangThanhToanPage />} />
          <Route path="taikhoan" element={<ThongTinCaNhanPage />} />
          <Route path="taikhoan/bao-mat" element={<BaoMatTaiKhoanPage />} />
          <Route path="lienhe" element={<LienHeYKienPage />} />
          <Route path="tintuc" element={<TinTucPage />} />


          {/* Các route khác của bệnh nhân */}
        </Route>
      </Route>

      <Route path="/yta" element={<PrivateRoute />}>
        <Route element={<YtaLayout />}>
          <Route index element={<YTaHome />} />
          <Route path="benhnhan/dangky" element={<DangKyBenhNhanPage />} />
          <Route path="benhnhan/ghinhantinhtrang" element={<GhiNhanTinhTrangPage />} />
          <Route path="lichlamviec" element={<LichLamViecBacSiPage />} />
          

        </Route>
      </Route>



      <Route path="/xetnghiem" element={<PrivateRoute />}>
        <Route element={<XetNghiemLayout />}>
          <Route index element={<XetNghiemHome />} />
          <Route path="xetnghiem/yeucau" element={<YeuCauXNTruocPage />} />
          <Route path="xetnghiem/phieu" element={<PhieuXetNghiem_NSPage />} />



        </Route>
      </Route>


      <Route path="/tiepnhan" element={<PrivateRoute />}>
        <Route element={<TiepNhanLayout />}>
          <Route index element={<TiepNhanHome />} />
          <Route path="lichkham" element={<DangKyKham_NSPage />} />
          <Route path="lichHen" element={<LichHenPage />} />
          <Route path="hsba" element={<TiepNhanHoSoPage />} />

          {/* Các route khác của nhân viên tiếp nhận */}

        </Route>
      </Route>


      {/* Điều hướng mặc định và 404 */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;

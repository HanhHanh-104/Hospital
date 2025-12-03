import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");      // maNhom: ADMIN, BACSI, BENHNHAN, NHANSU
  const loaiNS = localStorage.getItem("loaiNS");  // chỉ với NHANSU
  const location = useLocation();

  if (!token) return <Navigate to="/login" />;

  const path = location.pathname;

  // Quy định phân quyền truy cập
  if (role === "ADMIN" && !path.startsWith("/admin")) return <Navigate to="/404" />;
  if (role === "BACSI" && !path.startsWith("/doctor")) return <Navigate to="/404" />;
  if (role === "BENHNHAN" && !path.startsWith("/patient")) return <Navigate to="/404" />;

  if (role === "NHANSU") {
    if (loaiNS === "YT" && !path.startsWith("/yta")) return <Navigate to="/404" />;
    if (loaiNS === "XN" && !path.startsWith("/xetnghiem")) return <Navigate to="/404" />;
    if (loaiNS === "TN" && !path.startsWith("/tiepnhan")) return <Navigate to="/404" />;
  }

  return <Outlet />;
};

export default PrivateRoute;

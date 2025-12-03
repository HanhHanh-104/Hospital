import axios from "../../api/axiosClient";

// Gọi API lấy thông tin bác sĩ từ mã tài khoản
export const getBacSiByTK = (maTK) => axios.get(`/bacsi/maTK/${maTK}`);

import axios from "../../api/axiosClient";

export const getTaiKhoanById = (id) => axios.get(`/taikhoan/${id}`);
export const getAllBenhNhan = () => axios.get("/benhnhan");
export const updateBenhNhan = (id, data) => axios.put(`/benhnhan/${id}`, data);
export const getBenhNhanByMaTK = (maTK) => axios.get(`/benhnhan/findByMaTK/${maTK}`);


import axios from "../../api/axiosClient";

//  Lấy lịch làm việc theo mã BÁC SĨ (maBS)
export const getLichByBS = (maBS) => axios.get(`/lichlamviec/bacsi/${maBS}`);

//  Tạo mới lịch làm việc
export const createLich = (data) => axios.post("/lichlamviec", data);

//  Cập nhật lịch làm việc
export const updateLich = (id, data) => axios.put(`/lichlamviec/${id}`, data);

//  Xóa lịch làm việc
export const deleteLich = (id) => axios.delete(`/lichlamviec/${id}`);

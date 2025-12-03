// Tệp: frontend/src/services/lichkham_BS/lichkhamService.js
// NỘI DUNG SỬA ĐỔI HOÀN CHỈNH

import axios from "../../api/axiosClient";

// === THÊM HÀM MỚI NÀY ===
export const getLichHenByBacSi = (maBS) => axios.get(`/lichkham/bacsi/${maBS}`);
// === KẾT THÚC THÊM ===

export const getAllLichHen = () => axios.get("/lichkham");
export const createLichHen = (data) => axios.post("/lichkham", data);
export const updateLichHen = (id, data) => axios.put(`/lichkham/${id}`, data);
export const deleteLichHen = (id) => axios.delete(`/lichkham/${id}`);
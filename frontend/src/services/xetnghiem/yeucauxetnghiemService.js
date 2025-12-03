import axios from "../../api/axiosClient";

export const getAllYeuCau = () => axios.get("/yeucauxetnghiem");
export const createYeuCau = (data) => axios.post("/yeucauxetnghiem", data);
export const updateTrangThai = (id, data) => axios.put(`/yeucauxetnghiem/${id}`, data);
export const deleteYeuCau = (id) => axios.delete(`/yeucauxetnghiem/${id}`);

import axios from "../../../api/axiosClient";

export const getAllYeuCau = () => axios.get("/yeucauxetnghiem");
export const updateTrangThai = (id, data) => axios.put(`/yeucauxetnghiem/${id}`, data);

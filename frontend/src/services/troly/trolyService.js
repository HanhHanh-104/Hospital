import axios from "../../api/axiosClient";

// Sửa thành đúng route backend đang dùng:
export const getTroLyList = () => axios.get("/tro-ly");
export const createTroLy = (data) => axios.post("/tro-ly", data);
export const updateTroLy = (id, data) => axios.put(`/tro-ly/${id}`, data);
export const deleteTroLy = (id) => axios.delete(`/tro-ly/${id}`);

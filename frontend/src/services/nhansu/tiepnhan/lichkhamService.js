import axios from "../../../api/axiosClient";

export const getAllLichKham = () => axios.get("/lichkham");
export const createLichKham = (data) => axios.post("/lichkham", data);
export const updateLichKham = (id, data) => axios.put(`/lichkham/${id}`, data);
export const deleteLichKham = (id) => axios.delete(`/lichkham/${id}`);

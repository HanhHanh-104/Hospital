import axios from "../../api/axiosClient";

export const getPhieuByBacSi = (maBS) => axios.get(`/phieukham/bacsi/${maBS}`);
export const getAllPhieuKham = () => axios.get("/phieukham");
export const createPhieuKham = (data) => axios.post("/phieukham", data);
export const updatePhieuKham = (id, data) => axios.put(`/phieukham/${id}`, data);
export const deletePhieuKham = (id) => axios.delete(`/phieukham/${id}`);

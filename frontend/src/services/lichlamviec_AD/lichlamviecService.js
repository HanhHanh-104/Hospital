import axios from "../../api/axiosClient";

export const getAllLichLamViec = () => axios.get("/lichlamviec");

export const deleteLichLamViec = (id) => axios.delete(`/lichlamviec/${id}`);

export const updateLichLamViec = (id, data) => axios.put(`/lichlamviec/${id}`, data);

export const createLichLamViec = (data) => axios.post("/lichlamviec", data);

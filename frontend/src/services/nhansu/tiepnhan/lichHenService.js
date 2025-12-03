import axios from "../../../api/axiosClient";

export const getAllLichHen = () => axios.get("/lichkham");
export const createLichHen = (data) => axios.post("/lichkham", data);
export const updateLichHen = (id, data) => axios.put(`/lichkham/${id}`, data);
export const deleteLichHen = (id) => axios.delete(`/lichkham/${id}`);

import axios from "../../api/axiosClient";

export const getAllPhieu = () => axios.get("/phieuxetnghiem");
export const createPhieu = (data) => axios.post("/phieuxetnghiem", data);
export const updatePhieu = (id, data) => axios.put(`/phieuxetnghiem/${id}`, data);
export const deletePhieu = (id) => axios.delete(`/phieuxetnghiem/${id}`);

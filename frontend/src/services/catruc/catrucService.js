import axios from "../../api/axiosClient";

export const getAllCaTruc = () => axios.get("/catruc");
export const createCaTruc = (data) => axios.post("/catruc", data);
export const updateCaTruc = (id, data) => axios.put(`/catruc/${id}`, data);
export const deleteCaTruc = (id) => axios.delete(`/catruc/${id}`);

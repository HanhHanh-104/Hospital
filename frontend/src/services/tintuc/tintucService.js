import axios from "../../api/axiosClient";

export const getAllTinTuc = (params) => axios.get("/tintuc", { params });
export const getOneTinTuc = (maTin) => axios.get(`/tintuc/${maTin}`);
export const createTinTuc = (data) => axios.post("/tintuc", data);
export const updateTinTuc = (maTin, data) => axios.put(`/tintuc/${maTin}`, data);
export const deleteTinTuc = (maTin) => axios.delete(`/tintuc/${maTin}`);


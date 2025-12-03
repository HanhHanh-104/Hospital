import axios from "../../api/axiosClient";

export const createPhanHoi = (data) => axios.post("/phanhoi", data);
export const getPhanHoiByBenhNhan = (maBN) => axios.get(`/phanhoi/benhnhan/${maBN}`);
export const getAllPhanHoi = (params) => axios.get("/phanhoi", { params });
export const updatePhanHoi = (maPH, data) => axios.put(`/phanhoi/${maPH}`, data);
export const deletePhanHoi = (maPH) => axios.delete(`/phanhoi/${maPH}`);
export const getPhanHoiStats = () => axios.get("/phanhoi/stats");


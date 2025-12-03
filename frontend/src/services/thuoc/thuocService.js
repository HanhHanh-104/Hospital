// 📁 src/services/thuoc/thuocService.js
 import axios from "../../api/axiosClient";

export const getAllThuoc = async () => {
  const res = await axios.get("/thuoc");
  return res.data.data;
};

export const getOneThuoc = async (id) => {
  const res = await axios.get(`/thuoc/${id}`);
  return res.data?.data;
};

export const createThuoc = (data) => axios.post("/thuoc", data);
export const updateThuoc = (id, data) => axios.put(`/thuoc/${id}`, data);
export const deleteThuoc = (id) => axios.delete(`/thuoc/${id}`);

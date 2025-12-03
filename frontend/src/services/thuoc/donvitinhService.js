import axios from "../../api/axiosClient";

// Lấy toàn bộ đơn vị tính
export const getAllDonViTinh = async () => {
  const res = await axios.get("/thuoc/donvitinh");
  return res.data.data;
};

// Lấy 1 đơn vị tính theo mã
export const getOneDonViTinh = async (id) => {
  const res = await axios.get(`/thuoc/donvitinh/${id}`);
  return res.data.data;
};

// Tạo mới đơn vị tính
export const createDonViTinh = (data) => {
  return axios.post("/thuoc/donvitinh", data);
};

// Cập nhật đơn vị tính
export const updateDonViTinh = (id, data) => {
  return axios.put(`/thuoc/donvitinh/${id}`, data);
};

// Xoá đơn vị tính
export const deleteDonViTinh = (id) => {
  return axios.delete(`/thuoc/donvitinh/${id}`);
};

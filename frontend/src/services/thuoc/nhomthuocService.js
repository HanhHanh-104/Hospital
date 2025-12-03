import axios from "../../api/axiosClient";

// Lấy toàn bộ nhóm thuốc
export const getAllNhomThuoc = async () => {
  const res = await axios.get("/thuoc/nhomthuoc");
  return res.data.data;
};

// Lấy 1 nhóm thuốc theo mã
export const getOneNhomThuoc = async (id) => {
  const res = await axios.get(`/thuoc/nhomthuoc/${id}`);
  return res.data.data;
};

// Tạo mới nhóm thuốc
export const createNhomThuoc = (data) => {
  return axios.post("/thuoc/nhomthuoc", data);
};

// Cập nhật nhóm thuốc
export const updateNhomThuoc = (id, data) => {
  return axios.put(`/thuoc/nhomthuoc/${id}`, data);
};

// Xoá nhóm thuốc
export const deleteNhomThuoc = (id) => {
  return axios.delete(`/thuoc/nhomthuoc/${id}`);
};

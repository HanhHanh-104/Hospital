import axios from "../../api/axiosClient";

export const getAllThuoc = () => axios.get("/thuoc");
export const getDonViTinh = () => axios.get("/thuoc/donvitinh");
// src/services/hoadon_BN/dichVuService.js
import axios from "../../api/axiosClient";

export const getAllXetNghiem = () => axios.get("/xetnghiem");
export const getAllThuoc = () => axios.get("/thuoc");
export const getAllPhieuKham = () => axios.get("/phieukham"); // hoặc tùy API

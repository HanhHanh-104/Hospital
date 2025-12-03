// src/services/donthuoc/donthuocService.js
import axios from "../../api/axiosClient";

// ✅ HÀM MỚI (HOẶC ĐÃ ĐỔI TÊN)
// Gửi toàn bộ đơn thuốc (gồm cả chi tiết) lên 1 API duy nhất
export const createDonThuocVoiChiTiet = (data) => axios.post("/donthuoc", data);

// ❌ XÓA CÁC HÀM CŨ NÀY
// export const createDonThuoc = (data) => axios.post("/donthuoc", data);
// export const addThuocToDon = (data) => axios.post("/donthuoc/chitiet", data);
// export const getChiTietDonThuoc = (maDT) => axios.get(`/donthuoc/chitiet/${maDT}`);

// HÀM NÀY VẪN CẦN ĐỂ LẤY DANH SÁCH THUỐC
export const getAllThuoc = () => axios.get("/thuoc");
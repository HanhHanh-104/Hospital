import axios from "../../api/axiosClient";

export const getHoSoByBenhNhan = (maBN) => axios.get(`/hsba/benhnhan/${maBN}`);

export const getChiTietHoSo = (maHSBA) => axios.get(`/hsba/chitiet/${maHSBA}`);

// ✅ HÀM NÀY ĐÃ ĐÚNG (gửi `ngayKiemTra` qua params)
export const verifyChain = (maHSBA, ngayKiemTra) => {
  return axios.get(`/hsba/verify/${maHSBA}`, {
    params: {
      ngay: ngayKiemTra // ví dụ: ngay: "2025-11-14"
    }
  });
};
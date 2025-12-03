import axios from "../../../../api/axiosClient";

export const getAllHoSo = () => axios.get("/hsba");
export const ghiNhanTinhTrang = (id, data) => axios.put(`/hsba/ghinhan/${id}`, data);

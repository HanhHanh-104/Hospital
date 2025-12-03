import axios from "../../../api/axiosClient";

export const getAllHoSo = () => axios.get("/hsba");
export const createHoSo = (data) => axios.post("/hsba", data);
export const deleteHoSo = (id) => axios.delete(`/hsba/${id}`);

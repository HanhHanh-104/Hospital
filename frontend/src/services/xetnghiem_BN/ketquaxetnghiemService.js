import axios from "../../api/axiosClient";

export const getAllKetQua = () => axios.get("/phieuxetnghiem");

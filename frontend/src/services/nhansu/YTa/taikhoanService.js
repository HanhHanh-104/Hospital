import axios from "../../../api/axiosClient";

export const dangKyBenhNhan = (data) =>
  axios.post("/tai-khoan/dangky-benhnhan", data);

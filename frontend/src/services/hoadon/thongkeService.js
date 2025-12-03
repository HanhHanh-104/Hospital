import axios from "../../api/axiosClient";

export const thongKeHoaDon = (from, to) =>
  axios.get("/hoadon/thongke", {
    params: { from, to },
  });

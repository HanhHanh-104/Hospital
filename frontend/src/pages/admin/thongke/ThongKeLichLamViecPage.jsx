import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import {
  getAllLichLamViec,
  deleteLichLamViec,
  updateLichLamViec,
} from "../../../services/lichlamviec_AD/lichlamviecService";
import { Calendar, Clock, Users, Stethoscope, Edit, Trash2, X, Save } from 'lucide-react';

dayjs.extend(isoWeek);

const ThongKeLichLamViecPage = () => {
  const [lichList, setLichList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [filteredList, setFilteredList] = useState([]);
  const [thongKe, setThongKe] = useState({ bacSi: 0, nhanSu: 0 });
  const [editItem, setEditItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterByWeek();
  }, [selectedDate, lichList]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllLichLamViec();
      setLichList(res.data.data || []);
    } catch {
      toast.error("Lỗi khi tải lịch làm việc");
    } finally {
      setLoading(false);
    }
  };

  const filterByWeek = () => {
    const startOfWeek = dayjs(selectedDate).startOf("isoWeek");
    const endOfWeek = dayjs(selectedDate).endOf("isoWeek");

    const filtered = lichList.filter((item) => {
      const ngay = dayjs(item.ngayLamViec);
      return ngay.isAfter(startOfWeek.subtract(1, "day")) && ngay.isBefore(endOfWeek.add(1, "day"));
    });

    setFilteredList(filtered);

    const maBSSet = new Set(filtered.map((i) => i.maBS).filter(Boolean));
    const maNSSet = new Set(filtered.map((i) => i.maNS).filter(Boolean));
    setThongKe({ bacSi: maBSSet.size, nhanSu: maNSSet.size });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xác nhận xoá lịch này?")) return;
    try {
      await deleteLichLamViec(id);
      toast.success("Đã xoá");
      fetchData();
    } catch {
      toast.error("Xoá thất bại");
    }
  };

  const handleUpdate = async () => {
    try {
      const data = {
        maCa: editItem.maCa,
        ngayLamViec: editItem.ngayLamViec,
      };
      await updateLichLamViec(editItem.maLichLV, data);
      toast.success("Cập nhật thành công");
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error("Cập nhật thất bại");
    }
  };

  const weekDays = [...Array(7)].map((_, i) =>
    dayjs(selectedDate).startOf("isoWeek").add(i, "day")
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-xl shadow-lg">
            <Calendar size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Thống kê lịch làm việc</h1>
            <p className="text-gray-600">Xem lịch làm việc theo tuần</p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-gray-500" />
              <span className="font-semibold text-gray-700">Chọn ngày trong tuần:</span>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="text-gray-600 font-medium">
              Tuần: {dayjs(selectedDate).startOf("isoWeek").format("DD/MM")} -{" "}
              {dayjs(selectedDate).endOf("isoWeek").format("DD/MM/YYYY")}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-100">
                <Stethoscope className="text-green-600" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{thongKe.bacSi}</h3>
            <p className="text-sm text-gray-500">Số bác sĩ làm việc</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{thongKe.nhanSu}</h3>
            <p className="text-sm text-gray-500">Số nhân sự y tế</p>
          </div>
        </div>
      </div>

      {/* Calendar Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Clock size={24} className="text-blue-600" />
            Lịch làm việc tuần ({weekDays[0].format("DD/MM")} - {weekDays[6].format("DD/MM")})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <tr>
                {weekDays.map((day, i) => (
                  <th key={i} className="px-4 py-4 whitespace-nowrap text-center font-semibold">
                    {day.format("ddd DD/MM")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {weekDays.map((day, i) => {
                  const items = filteredList.filter(
                    (item) =>
                      dayjs(item.ngayLamViec).format("YYYY-MM-DD") === day.format("YYYY-MM-DD")
                  );

                  return (
                    <td key={i} className="border px-4 py-4 align-top bg-gray-50 min-w-[200px]">
                      {items.length === 0 ? (
                        <p className="text-gray-400 italic text-center text-sm">Không có lịch</p>
                      ) : (
                        <div className="space-y-2">
                          {items.map((item) => (
                            <div
                              key={item.maLichLV}
                              className="p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                {item.maBS ? (
                                  <Stethoscope size={16} className="text-green-600" />
                                ) : (
                                  <Users size={16} className="text-blue-600" />
                                )}
                                <span className="font-semibold text-sm">
                                  {item.maBS ? "Bác sĩ" : "Nhân sự"}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mb-1">
                                <span className="font-medium">Mã:</span> {item.maBS || item.maNS}
                              </p>
                              <p className="text-xs text-gray-600 mb-1">
                                <span className="font-medium">Ca:</span> {item.maCa}
                              </p>
                              <div className="flex justify-end gap-2 pt-2 border-t mt-2">
                                <button
                                  className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                  onClick={() => {
                                    setEditItem(item);
                                    setIsModalOpen(true);
                                  }}
                                  title="Sửa"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() => handleDelete(item.maLichLV)}
                                  className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                                  title="Xóa"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-center justify-between rounded-t-xl">
              <h2 className="text-xl font-bold text-white">Sửa lịch làm việc</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày làm việc</label>
                <input
                  type="date"
                  value={dayjs(editItem.ngayLamViec).format("YYYY-MM-DD")}
                  onChange={(e) =>
                    setEditItem({ ...editItem, ngayLamViec: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ca trực</label>
                <input
                  type="text"
                  value={editItem.maCa || ""}
                  onChange={(e) => setEditItem({ ...editItem, maCa: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy
                </button>
                <button
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md flex items-center gap-2"
                  onClick={handleUpdate}
                >
                  <Save size={18} />
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThongKeLichLamViecPage;

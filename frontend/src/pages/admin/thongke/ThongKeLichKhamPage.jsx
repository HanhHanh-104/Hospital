import React, { useEffect, useState, useMemo } from "react";
import axios from "../../../api/axiosClient";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { Calendar, Search, Users, Stethoscope, FileText, TrendingUp } from 'lucide-react';

const ThongKeLichKhamPage = () => {
  const [lichList, setLichList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [thongKe, setThongKe] = useState({
    tongLich: 0,
    soBacSi: 0,
    soBenhNhan: 0,
  });
  const [loading, setLoading] = useState(false);
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      handleFilter();
    }
  }, [selectedDate, lichList]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/lichkham");
      setLichList(res.data.data || []);
    } catch (err) {
      toast.error("Lỗi khi tải dữ liệu lịch khám");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    if (!selectedDate) return;

    const filtered = lichList.filter(
      (item) => item.ngayKham?.slice(0, 10) === selectedDate
    );

    setFilteredList(filtered);

    const uniqueBS = new Set(filtered.map((item) => item.maBS).filter(Boolean));
    const uniqueBN = new Set(filtered.map((item) => item.maBN).filter(Boolean));

    setThongKe({
      tongLich: filtered.length,
      soBacSi: uniqueBS.size,
      soBenhNhan: uniqueBN.size,
    });
  };

  const getStatusBadge = (trangThai) => {
    const statusMap = {
      'CHO_THANH_TOAN': { label: 'Chờ thanh toán', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'DA_THANH_TOAN': { label: 'Đã thanh toán', color: 'bg-green-100 text-green-800 border-green-200' },
      'DA_HUY': { label: 'Đã hủy', color: 'bg-red-100 text-red-800 border-red-200' },
    };
    const status = statusMap[trangThai] || { label: trangThai, color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
        {status.label}
      </span>
    );
  };

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
          <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4 rounded-xl shadow-lg">
            <Calendar size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Thống kê lịch khám bệnh</h1>
            <p className="text-gray-600">Phân tích lịch khám theo ngày</p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Search size={20} className="text-gray-500" />
              <span className="font-semibold text-gray-700">Chọn ngày:</span>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <div className="text-gray-600 font-medium">
              {selectedDate ? dayjs(selectedDate).format("DD/MM/YYYY") : "Chưa chọn"}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <FileText className="text-blue-600" size={24} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">{thongKe.tongLich}</h3>
          <p className="text-sm text-gray-500">Tổng số lịch khám</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-100">
              <Stethoscope className="text-green-600" size={24} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">{thongKe.soBacSi}</h3>
          <p className="text-sm text-gray-500">Số bác sĩ tham gia</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">{thongKe.soBenhNhan}</h3>
          <p className="text-sm text-gray-500">Số bệnh nhân</p>
        </div>
      </div>

      {/* List */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Không có lịch khám nào</h3>
          <p className="text-gray-500">Không có lịch khám trong ngày {selectedDate ? dayjs(selectedDate).format("DD/MM/YYYY") : "đã chọn"}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp size={24} className="text-orange-600" />
              Danh sách lịch khám ({filteredList.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Mã lịch</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Bác sĩ</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Bệnh nhân</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Giờ khám</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Phòng</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredList.map((lich) => (
                  <tr key={lich.maLich} className="hover:bg-orange-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{lich.maLich}</td>
                    <td className="px-6 py-4 text-gray-700 font-semibold">
                      {lich.BacSi?.hoTen || lich.hoTenBS || lich.maBS}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {lich.BenhNhan?.hoTen || lich.hoTenBN || lich.maBN}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{lich.gioKham || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {lich.phong || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(lich.trangThai)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThongKeLichKhamPage;

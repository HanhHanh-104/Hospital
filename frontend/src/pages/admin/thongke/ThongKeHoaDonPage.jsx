import React, { useEffect, useState } from "react";
import { thongKeHoaDon } from "../../../services/hoadon/thongkeService";
import dayjs from "dayjs";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { BarChart3, DollarSign, FileText, CheckCircle, XCircle, Calendar, Filter } from 'lucide-react';
import toast from "react-hot-toast";

const ThongKeHoaDonPage = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [chon, setChon] = useState("homnay");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleFilter("homnay");
  }, []);

  const formatDate = (date) => dayjs(date).format("YYYY-MM-DD");

  const handleFilter = async (type) => {
    setLoading(true);
    try {
      const today = dayjs();
      let start = today;
      let end = today;

      if (type === "homnay") {
        start = end = today;
      } else if (type === "thangnay") {
        start = today.startOf("month");
        end = today.endOf("month");
      } else if (type === "tuychon" && from && to) {
        start = dayjs(from);
        end = dayjs(to);
      } else if (type === "tuychon") {
        toast.error("Vui lòng chọn khoảng thời gian");
        setLoading(false);
        return;
      }

      const res = await thongKeHoaDon(formatDate(start), formatDate(end));
      setData(res.data.data);
      setChon(type);
    } catch (err) {
      toast.error("Lỗi khi tải thống kê");
    } finally {
      setLoading(false);
    }
  };

  const pieData = data ? [
    { name: "Đã thanh toán", value: data.daThanhToan, color: "#10b981" },
    { name: "Chưa thanh toán", value: data.chuaThanhToan, color: "#ef4444" },
  ] : [];

  const COLORS = ["#10b981", "#ef4444"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 rounded-xl shadow-lg">
            <BarChart3 size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Thống kê hóa đơn</h1>
            <p className="text-gray-600">Phân tích doanh thu và tình trạng thanh toán</p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-500" />
              <span className="font-semibold text-gray-700">Bộ lọc:</span>
            </div>
            <select
              value={chon}
              onChange={(e) => setChon(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="homnay">Hôm nay</option>
              <option value="thangnay">Tháng này</option>
              <option value="tuychon">Tùy chọn</option>
            </select>
            {chon === "tuychon" && (
              <>
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Từ ngày"
                />
                <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Đến ngày"
                />
              </>
            )}
            <button
              onClick={() => handleFilter(chon)}
              disabled={loading}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              <Calendar size={18} />
              {loading ? "Đang tải..." : "Lọc"}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-100">
                  <FileText className="text-blue-600" size={24} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{data.tongSo || 0}</h3>
              <p className="text-sm text-gray-500">Tổng số hóa đơn</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-emerald-100">
                  <DollarSign className="text-emerald-600" size={24} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {data.tongTien ? `${parseFloat(data.tongTien).toLocaleString('vi-VN')} VNĐ` : "0 VNĐ"}
              </h3>
              <p className="text-sm text-gray-500">Tổng doanh thu</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-green-100">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{data.daThanhToan || 0}</h3>
              <p className="text-sm text-gray-500">Đã thanh toán</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-red-100">
                  <XCircle className="text-red-600" size={24} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{data.chuaThanhToan || 0}</h3>
              <p className="text-sm text-gray-500">Chưa thanh toán</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Pie Chart */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 size={20} className="text-emerald-600" />
                Tỷ lệ hóa đơn theo trạng thái
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 size={20} className="text-emerald-600" />
                So sánh thanh toán
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pieData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {!data && !loading && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <BarChart3 size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có dữ liệu</h3>
          <p className="text-gray-500">Vui lòng chọn bộ lọc và nhấn "Lọc" để xem thống kê</p>
        </div>
      )}
    </div>
  );
};

export default ThongKeHoaDonPage;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// SỬA LỖI: Dùng named import (có dấu ngoặc nhọn) thay vì default import
import {getChiTietHoSo, verifyChain } from "../../services/hoso_BN/hsbaService";
import { format } from 'date-fns'; 

// Component hiển thị từng khối (Block)
const BlockCard = ({ block }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    try {
      if (block.data_json) {
        setData(JSON.parse(block.data_json));
      }
    } catch (e) {
      console.error("Lỗi parse JSON:", e);
      setData({ error: "Dữ liệu block bị lỗi" });
    }
  }, [block]);

  const renderData = () => {
    if (!data) return <p className="text-gray-500">Đang tải dữ liệu...</p>;
    
    switch (block.block_type) {
      case 'TAO_MOI':
        return (
          <div className="space-y-1">
            <p><span className="font-semibold">Bệnh nhân:</span> {data.hoTen}</p>
            <p><span className="font-semibold">Ngày lập:</span> {data.ngayLap ? format(new Date(data.ngayLap), 'dd/MM/yyyy') : 'N/A'}</p>
          </div>
        );
      case 'PHIEU_KHAM':
        return (
          <div className="space-y-1">
            <p><span className="font-semibold">Triệu chứng:</span> {data.trieuChung}</p>
            <p><span className="font-semibold">Chẩn đoán:</span> {data.chuanDoan}</p>
            <p><span className="font-semibold">Lời dặn:</span> {data.loiDan}</p>
            <p><span className="font-semibold">Bác sĩ:</span> {data.maBS}</p>
          </div>
        );
      case 'DON_THUOC_HOAN_CHINH':
        return (
            <div className="space-y-1">
                <p><span className="font-semibold">Mã đơn:</span> {data.maDT}</p>
                <div className="mt-2">
                    <p className="font-semibold underline">Chi tiết thuốc:</p>
                    <ul className="list-disc pl-5">
                        {data.chiTietList && data.chiTietList.map((t, idx) => (
                            <li key={idx}>
                                {t.tenThuoc} - SL: {t.soLuong} - {t.lieuDung}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
        case 'XET_NGHIEM_HOAN_CHINH':
        return (
            <div className="space-y-1">
                <p><span className="font-semibold">Mã phiếu:</span> {data.maPhieuXN}</p>
                <p><span className="font-semibold">Kết quả:</span> {data.ketQua}</p>
                 <p><span className="font-semibold">Ghi chú:</span> {data.ghiChu}</p>
            </div>
        );

      default:
        return <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>;
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-3 border-b pb-2">
        <h3 className="text-lg font-bold text-blue-600 flex items-center gap-2">
            {block.block_type === 'TAO_MOI' && '🆕 Tạo Mới'}
            {block.block_type === 'PHIEU_KHAM' && '🩺 Phiếu Khám'}
            {block.block_type === 'DON_THUOC_HOAN_CHINH' && '💊 Đơn Thuốc'}
            {block.block_type === 'XET_NGHIEM_HOAN_CHINH' && '🧪 Xét Nghiệm'}
            {!['TAO_MOI', 'PHIEU_KHAM', 'DON_THUOC_HOAN_CHINH', 'XET_NGHIEM_HOAN_CHINH'].includes(block.block_type) && block.block_type}
        </h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {block.timestamp ? format(new Date(block.timestamp), 'dd/MM/yyyy HH:mm') : ''}
        </span>
      </div>
      <div className="text-gray-700 text-sm">
        {renderData()}
      </div>
      <div className="mt-3 pt-2 border-t border-dashed border-gray-200 text-xs text-gray-400 flex flex-col gap-1">
        <p><span className="font-semibold">Người tạo (ID):</span> {block.maNguoiTao}</p>
        <p className="truncate" title={block.current_hash}><span className="font-semibold">Hash:</span> {block.current_hash}</p>
      </div>
    </div>
  );
};

const ChiTietHSBAPage = () => {
  const { maHSBA } = useParams();
  const [hoSo, setHoSo] = useState(null);
  const [chain, setChain] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const fetchChiTiet = async () => {
      if (!maHSBA) return;
      try {
        setLoading(true);
        // Gọi API lấy chi tiết
        const res = await getChiTietHoSo(maHSBA);
        
        if (res.data && res.data.data) {
           const data = res.data.data; 
           setHoSo(data.hoSo);
           setChain(data.chain || []);
        } else {
           setHoSo(res.data.hoSo);
           setChain(res.data.chain || []);
        }

      } catch (err) {
        console.error("Lỗi tải chi tiết:", err);
        setError(err.response?.data?.message || "Không thể tải dữ liệu hồ sơ.");
      } finally {
        setLoading(false);
      }
    };

    fetchChiTiet();
  }, [maHSBA]);

  const handleVerifyChain = async () => {
    try {
      setVerifying(true);
      const res = await verifyChain(maHSBA); 
      setVerifyResult(res.data); 
    } catch (err) {
      setVerifyResult(err.response?.data || { valid: false, message: "Lỗi kết nối khi xác thực." });
    } finally {
        setVerifying(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">⏳ Đang tải chi tiết hồ sơ...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-semibold">❌ Lỗi: {error}</div>;
  if (!hoSo) return <div className="p-8 text-center text-gray-500">📭 Không tìm thấy hồ sơ bệnh án.</div>;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 flex items-center gap-2">
        📋 Chi tiết Hồ sơ Bệnh án
      </h1>
      
      {/* Thông tin chung */}
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-xl font-bold text-blue-700 mb-4 border-b border-blue-200 pb-2">Thông tin hành chính</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <p><span className="font-semibold">Mã HSBA:</span> {hoSo.maHSBA}</p>
            <p><span className="font-semibold">Mã Bệnh nhân:</span> {hoSo.maBN}</p>
            <p><span className="font-semibold">Ngày lập hồ sơ:</span> {hoSo.ngayLap ? format(new Date(hoSo.ngayLap), 'dd/MM/yyyy') : 'N/A'}</p>
            <p><span className="font-semibold">Đợt khám:</span> {hoSo.dotKhamBenh ? format(new Date(hoSo.dotKhamBenh), 'dd/MM/yyyy') : 'N/A'}</p>
        </div>
      </div>

      {/* Nút kiểm tra & Kết quả */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">🔗 Chuỗi khối (Lịch sử y tế)</h2>
            <button
            onClick={handleVerifyChain}
            disabled={verifying}
            className={`px-4 py-2 rounded-lg font-semibold text-white shadow transition-all ${
                verifying ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
            >
            {verifying ? "🔄 Đang kiểm tra..." : "🛡️ Kiểm tra tính toàn vẹn"}
            </button>
        </div>

        {verifyResult && (
            <div 
            className={`p-4 rounded-lg border-l-4 shadow-sm animate-fade-in ${
                verifyResult.valid 
                ? 'bg-green-50 border-green-500 text-green-800' 
                : 'bg-red-50 border-red-500 text-red-800'
            }`}
            >
            <h3 className="font-bold text-lg flex items-center gap-2">
                {verifyResult.valid ? "✅ HỢP LỆ" : "🚨 CẢNH BÁO GIẢ MẠO"}
            </h3>
            <p className="mt-1">{verifyResult.message}</p>
            {verifyResult.errors && verifyResult.errors.length > 0 && (
                <ul className="list-disc pl-5 mt-2 text-sm">
                    {verifyResult.errors.map((err, idx) => (
                        <li key={idx}>{err.error} (Block Type: {err.type})</li>
                    ))}
                </ul>
            )}
            </div>
        )}
      </div>

      {/* Danh sách Block */}
      <div className="space-y-4">
        {chain.length > 0 ? (
          chain.map((block) => (
            <BlockCard key={block.id} block={block} />
          ))
        ) : (
          <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500">
            Chưa có dữ liệu y tế nào được ghi nhận trong chuỗi khối.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChiTietHSBAPage;
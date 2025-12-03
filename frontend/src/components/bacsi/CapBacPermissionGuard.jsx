import React from "react";
import { AlertCircle, Lock } from "lucide-react";

/**
 * Component kiểm tra và hiển thị cảnh báo nếu bác sĩ không đủ quyền
 * @param {string} capBac - Cấp bậc hiện tại của bác sĩ
 * @param {string[]} allowedCapBacs - Danh sách cấp bậc được phép
 * @param {string} actionName - Tên thao tác (ví dụ: "Tạo phiếu khám", "Kê đơn thuốc")
 * @param {ReactNode} children - Nội dung hiển thị nếu có quyền
 */
const CapBacPermissionGuard = ({ capBac, allowedCapBacs, actionName, children }) => {
  const hasPermission = allowedCapBacs.includes(capBac);

  if (!hasPermission) {
    const getMessage = () => {
      if (capBac === "Bác sĩ thực tập") {
        return `Bác sĩ thực tập không được phép ${actionName}. Bạn cần có sự giám sát của bác sĩ hướng dẫn.`;
      }
      if (capBac === "Bác sĩ sơ cấp") {
        return `Bác sĩ sơ cấp cần có sự giám sát khi ${actionName}. Vui lòng liên hệ bác sĩ hướng dẫn.`;
      }
      return `Cấp bậc "${capBac}" không có quyền ${actionName}. Yêu cầu cấp bậc: ${allowedCapBacs.join(", ")}`;
    };

    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <Lock className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 mb-1">Không đủ quyền truy cập</h3>
            <p className="text-sm text-amber-800">{getMessage()}</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default CapBacPermissionGuard;


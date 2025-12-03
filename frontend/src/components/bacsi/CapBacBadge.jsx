import React from "react";

/**
 * Component hiển thị badge cấp bậc bác sĩ với màu sắc tương ứng
 */
const CapBacBadge = ({ capBac, size = "default" }) => {
  const getBadgeStyle = (capBac) => {
    const styles = {
      "Bác sĩ thực tập": "bg-gray-100 text-gray-700 border-gray-300",
      "Bác sĩ sơ cấp": "bg-blue-100 text-blue-700 border-blue-300",
      "Bác sĩ điều trị": "bg-green-100 text-green-700 border-green-300",
      "Bác sĩ chuyên khoa I": "bg-purple-100 text-purple-700 border-purple-300",
      "Bác sĩ chuyên khoa II": "bg-indigo-100 text-indigo-700 border-indigo-300",
      "Thạc sĩ – Bác sĩ": "bg-orange-100 text-orange-700 border-orange-300",
      "Tiến sĩ – Bác sĩ": "bg-red-100 text-red-700 border-red-300",
      "Phó giáo sư – Bác sĩ": "bg-yellow-100 text-yellow-700 border-yellow-300",
      "Giáo sư – Bác sĩ": "bg-gradient-to-r from-amber-400 to-yellow-500 text-white border-amber-500"
    };
    return styles[capBac] || styles["Bác sĩ điều trị"];
  };

  const sizeClasses = {
    small: "px-2 py-0.5 text-xs",
    default: "px-3 py-1 text-xs",
    large: "px-4 py-2 text-sm"
  };

  if (!capBac) {
    return (
      <span className={`${sizeClasses[size]} rounded-full bg-gray-100 text-gray-500 border border-gray-300 font-semibold`}>
        Chưa có cấp bậc
      </span>
    );
  }

  return (
    <span className={`${sizeClasses[size]} rounded-full border font-semibold ${getBadgeStyle(capBac)}`}>
      {capBac}
    </span>
  );
};

export default CapBacBadge;


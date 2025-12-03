import React from "react";

const FilterBar = ({ filter, bacSiList, onChange }) => {
  return (
    <div className="bg-white shadow p-4 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4">
      <input
        name="tuNgay"
        type="date"
        value={filter.tuNgay}
        onChange={onChange}
        className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        name="denNgay"
        type="date"
        value={filter.denNgay}
        onChange={onChange}
        className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        name="maBS"
        value={filter.maBS}
        onChange={onChange}
        className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Tất cả bác sĩ --</option>
        {bacSiList.map((bs) => (
          <option key={bs.maBS} value={bs.maBS}>
            {bs.hoTen}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar;

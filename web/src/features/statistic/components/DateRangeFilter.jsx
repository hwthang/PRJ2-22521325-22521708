// src/features/statistic/components/DateRangeFilter.jsx
import React, { useState } from "react";

export default function DateRangeFilter({ onFilter }) {
  const [period, setPeriod] = useState("month"); // week | month | quarter | year
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleApply = () => {
    onFilter({ period, startDate, endDate });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-lg shadow-sm border">
      <label className="font-medium text-gray-700">Khoảng thời gian:</label>

      <select
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
        className="border rounded-md px-2 py-1 text-sm"
      >
        <option value="week">Tuần</option>
        <option value="month">Tháng</option>
        <option value="quarter">Quý</option>
        <option value="year">Năm</option>
        <option value="custom">Tùy chọn</option>
      </select>

      {period === "custom" && (
        <>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm"
          />
          <span>-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm"
          />
        </>
      )}

      <button
        onClick={handleApply}
        className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
      >
        Áp dụng
      </button>
    </div>
  );
}

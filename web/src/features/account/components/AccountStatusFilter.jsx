import React, { useEffect, useState } from "react";

function AccountStatusFilter({ onStatusFilter, status }) {
  const [filter, setFilter] = useState([]);

  const handleChange = (e) => {
    const { checked, value } = e.target;

    if (checked) {
      // Nếu checkbox được check → thêm vào filter
      setFilter((prev) => [...prev, value]);
    } else {
      // Nếu checkbox bị bỏ check → xoá khỏi filter
      setFilter((prev) => prev.filter((item) => item !== value));
    }
  };

  useEffect(() => {
    setFilter(status);
  }, []);

  useEffect(() => {
    onStatusFilter(filter);
  }, [filter]);

  return (
    <div className="shadow-md flex flex-col gap-2 p-4 rounded-md">
      <p className="font-semibold">Trạng thái</p>

      <div className="inline-flex gap-2 flex-wrap text-sm">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="hidden peer"
            value="active"
            onChange={handleChange}
            checked={status.includes("active")}
          />
          <span className="border-2 p-2 rounded-md bg-gray-100 border-gray-300 text-gray-400 peer-checked:bg-green-100 peer-checked:border-green-300 peer-checked:text-green-500 font-semibold transition">
            Hoạt động
          </span>
        </label>
        <label className="inline-flex items-center  cursor-pointer">
          <input
            type="checkbox"
            className="hidden peer"
            value="locked"
            onChange={handleChange}
            checked={status.includes("locked")}
          />
          <span className="border-2 p-2 rounded-md bg-gray-100 border-gray-300 text-gray-400 peer-checked:bg-red-100 peer-checked:border-red-300 peer-checked:text-red-500 font-semibold transition">
            Khóa
          </span>
        </label>
        <label className="inline-flex items-center  cursor-pointer">
          <input
            type="checkbox"
            className="hidden peer"
            value="pending"
            onChange={handleChange}
            checked={status.includes("pending")}
          />
          <span className="border-2 p-2 rounded-md bg-gray-100 border-gray-300 text-gray-400 peer-checked:bg-yellow-100 peer-checked:border-yellow-300 peer-checked:text-yellow-500 font-semibold transition">
            Chờ duyệt
          </span>
        </label>
      </div>
    </div>
  );
}

export default AccountStatusFilter;

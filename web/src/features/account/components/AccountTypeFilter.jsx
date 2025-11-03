import React, { useEffect, useState } from "react";

function AccountTypeFilter({ onTypeFilter, type }) {
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
    setFilter(type);
  }, []);

  useEffect(() => {
    onTypeFilter(filter);
  }, [filter]);

  return (
    <div className="shadow flex flex-col gap-2 p-4 rounded-md">
      <p className="font-semibold">Loại tài khoản</p>

      <div className="inline-flex gap-2 flex-wrap text-sm">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="hidden peer"
            value="admin"
            onChange={handleChange}
            checked={type.includes("admin")}
          />
          <span className="border-2 p-2 rounded-md bg-gray-100 border-gray-300 text-gray-400 peer-checked:bg-violet-100 peer-checked:border-violet-300 peer-checked:text-violet-500 font-semibold transition">
            Quản trị viên
          </span>
        </label>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="hidden peer"
            value="chapter"
            onChange={handleChange}
            checked={type.includes("chapter")}
          />
          <span className="border-2 p-2 rounded-md bg-gray-100 border-gray-300 text-gray-400 peer-checked:bg-pink-100 peer-checked:border-pink-300 peer-checked:text-pink-500 font-semibold transition">
            Chi đoàn
          </span>
        </label>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="hidden peer"
            value="member"
            onChange={handleChange}
            checked={type.includes("member")}
          />
          <span className="border-2 p-2 rounded-md bg-gray-100 border-gray-300 text-gray-400 peer-checked:bg-blue-100 peer-checked:border-blue-300 peer-checked:text-blue-500 font-semibold transition">
            Đoàn viên
          </span>
        </label>
      </div>
    </div>
  );
}

export default AccountTypeFilter;

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import defAvatar from "../../../core/assets/images/avatar.png";

// Định nghĩa meta cho header table (có thêm style)
const META_DATA = [
  { key: "stt", label: "STT", style: "min-w-16 text-center text-nowrap" },
  { key: "fullname", label: "Họ và tên", style: "min-w-48 flex-1 text-nowrap" },
  { key: "username", label: "Tên người dùng", style: "min-w-48 text-nowrap" },
  { key: "role", label: "Vai trò", style: "min-w-40 text-center text-nowrap" },
  {
    key: "status",
    label: "Trạng thái",
    style: "min-w-40 text-center text-nowrap",
  },
];

function UserTable({ data }) {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col overflow-auto">
      {/* Header */}
      <div className="min-w-fit w-full">
        <ul className="flex font-semibold bg-blue-100 rounded-sm py-2">
          {META_DATA.map((col) => (
            <li key={col.key} className={`p-2 ${col.style}`}>
              {col.label}
            </li>
          ))}
        </ul>
      </div>

      {/* Rows */}
      <div className="min-w-fit w-full">
        {data?.map((acc, index) => (
          <ul
            key={index}
            className="flex hover:bg-gray-50 transition py-2 cursor-pointer items-center"
            onClick={() => navigate(`${acc.username}`, { state: acc.id })}
          >
            {META_DATA.map((col) => (
              <li
                key={col.key}
                className={`p-2 last:border-r-0 text-sm ${col.style}`}
              >
                {col.key === "stt" ? (
                  index + 1
                ) : col.key === "fullname" ? (
                  <div className="flex items-center">
                    <img
                      src={acc.avatar || defAvatar}
                      alt={acc.fullname}
                      className="w-8 h-8 rounded-full object-cover mr-2"
                    />

                    <span>{acc.fullname || "Cấp quản lý"}</span>
                  </div>
                ) : (
                  acc[col.key]
                )}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export default UserTable;

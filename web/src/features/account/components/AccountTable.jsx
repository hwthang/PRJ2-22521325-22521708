import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Clock, UserCircle2 } from "lucide-react";
import defAvatar from "../../../core/assets/images/avatar.png";

// ================= Meta =================
const META_DATA = [
  { key: "stt", label: "#", style: "min-w-16 text-center" },
  { key: "name", label: "Người dùng", style: "min-w-60 flex-1" },
  { key: "username", label: "Tên đăng nhập", style: "min-w-48" },
  { key: "type", label: "Loại tài khoản", style: "min-w-40 text-center" },
  { key: "status", label: "Trạng thái", style: "min-w-40 text-center" },
];

// ================= Helper components =================
const StatusBadge = ({ status }) => {
  const STATUS_MAP = {
    active: { icon: <CheckCircle size={16} className="text-green-600" />, label: "Hoạt động", style: "bg-green-50 text-green-700 border-green-200" },
    locked: { icon: <XCircle size={16} className="text-red-600" />, label: "Bị khóa", style: "bg-red-50 text-red-700 border-red-200" },
    pending: { icon: <Clock size={16} className="text-yellow-600" />, label: "Chờ xác nhận", style: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  };

  const data = STATUS_MAP[status] || STATUS_MAP.pending;

  return (
    <div className={`inline-flex items-center gap-1 px-3 py-1 border rounded-full text-xs font-medium ${data.style}`}>
      {data.icon} {data.label}
    </div>
  );
};

const TypeBadge = ({ type }) => {
  const TYPE_MAP = {
    member: "bg-blue-50 text-blue-700 border-blue-200",
    chapter: "bg-purple-50 text-purple-700 border-purple-200",
    admin: "bg-gray-100 text-gray-700 border-gray-300",
  };
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${TYPE_MAP[type] || TYPE_MAP.member}`}>
      {type === "member" ? "Đoàn viên" : type === "chapter" ? "Chi đoàn" : "Quản trị"}
    </span>
  );
};

// ================= Main Table =================
function AccountTable({ data, pageSize = 10 }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data?.length / pageSize || 1);

  // Lấy dữ liệu theo trang
  const paginatedData = data?.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="w-full flex flex-col overflow-auto rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-blue-50">
        <ul className="flex font-semibold text-md border-b border-gray-200">
          {META_DATA.map((col) => (
            <li key={col.key} className={`p-3 ${col.style}`}>{col.label}</li>
          ))}
        </ul>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-100 bg-white">
        {paginatedData?.length > 0 ? (
          paginatedData.map((acc, index) => (
            <ul
              key={index}
              className="flex items-center hover:bg-gray-50 transition-all cursor-pointer"
              onClick={() => navigate(`${acc.username}`, { state: {id: acc.id, type:acc.type} })}
            >
              {META_DATA.map((col) => (
                <li key={col.key} className={`p-3 text-sm ${col.style}`}>
                  {col.key === "stt" ? ((currentPage - 1) * pageSize + index + 1) :
                   col.key === "name" ? (
                    <div className="flex items-center gap-3">
                      <img src={acc.avatar?.path || defAvatar} alt={acc.name} className="w-9 h-9 rounded-full object-cover border" />
                      <div className="flex flex-col">
                        <span className="font-medium">{acc.name || "Cấp quản lý"}</span>
                        <span className="text-xs flex items-center gap-1">
                          <UserCircle2 size={12} /> {acc.email || "—"}
                        </span>
                      </div>
                    </div>
                  ) : col.key === "status" ? (
                    <StatusBadge status={acc.status} />
                  ) : col.key === "type" ? (
                    <TypeBadge type={acc.type} />
                  ) : acc[col.key] || "—"}
                </li>
              ))}
            </ul>
          ))
        ) : (
          <div className="py-10 text-center text-sm">
            Không có tài khoản nào phù hợp 🫤
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 p-3 border-t border-gray-200">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Trước
          </button>
          <span className="px-2">{currentPage} / {totalPages}</span>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}

export default AccountTable;

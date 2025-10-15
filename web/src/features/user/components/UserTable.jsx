import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import defAvatar from "../../../core/assets/images/avatar.png";

// ================== Cấu hình cột ==================
const META_DATA = [
  { key: "stt", label: "STT", style: "min-w-16 text-center text-nowrap" },
  { key: "fullname", label: "Họ và tên", style: "min-w-48 flex-1 text-nowrap" },
  { key: "username", label: "Tên người dùng", style: "min-w-48 text-nowrap" },
  { key: "role", label: "Vai trò", style: "min-w-40 text-center text-nowrap" },
  { key: "status", label: "Trạng thái", style: "min-w-40 text-center text-nowrap" },
];

// ================== Component Pagination ==================
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const maxButtons = 7;

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const start = Math.max(2, currentPage - 2);
      const end = Math.min(totalPages - 1, currentPage + 2);

      pages.push(1);
      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <div className="flex items-center gap-2 justify-center">
        {/* Nút Trước */}
        <button
          className={`px-3 py-1 rounded-lg border transition ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "hover:bg-blue-100 border-gray-300"
          }`}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Trước
        </button>

        {/* Danh sách số trang */}
        {pages.map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-2 text-gray-400 select-none">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-lg border transition ${
                currentPage === page
                  ? "bg-blue-900 text-white border-blue-900"
                  : "border-gray-300 hover:bg-blue-100"
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* Nút Sau */}
        <button
          className={`px-3 py-1 rounded-lg border transition ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "hover:bg-blue-100 border-gray-300"
          }`}
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Sau →
        </button>
      </div>

      <p className="text-sm text-gray-600">
        Trang <span className="font-semibold">{currentPage}</span> / {totalPages}
      </p>
    </div>
  );
}

// ================== Component chính ==================
function UserTable({ data = [] }) {
  const navigate = useNavigate();

  // ---- State phân trang ----
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // ---- Tính toán dữ liệu hiển thị ----
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedData = data.slice(startIndex, startIndex + pageSize);

  // ---- Khi đổi số bản ghi / trang ----
  const handleChangePageSize = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="w-full flex flex-col overflow-auto">
      {/* Header */}
      <div className="min-w-fit w-full">
        <ul className="flex font-semibold bg-blue-100 rounded-sm py-2 border-b border-gray-200">
          {META_DATA.map((col) => (
            <li key={col.key} className={`p-2 ${col.style}`}>
              {col.label}
            </li>
          ))}
        </ul>
      </div>

      {/* Rows */}
      <div className="min-w-fit w-full">
        {pagedData.length > 0 ? (
          pagedData.map((acc, index) => (
            <ul
              key={acc.id || index}
              className="flex hover:bg-gray-50 transition py-2 cursor-pointer items-center border-b border-gray-100"
              onClick={() => navigate(`${acc.username}`, { state: acc.id })}
            >
              {META_DATA.map((col) => (
                <li key={col.key} className={`p-2 text-sm ${col.style}`}>
                  {col.key === "stt" ? (
                    startIndex + index + 1
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
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">Không có dữ liệu</div>
        )}
      </div>

      {/* Footer (Pagination + Page size) */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm text-gray-600">
            Hiển thị:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handleChangePageSize}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={8}>8</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
          <span className="text-sm text-gray-600">bản ghi / trang</span>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default UserTable;

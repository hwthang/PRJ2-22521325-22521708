import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ================== Cấu hình cột ==================
const META_DATA = [
  { key: "stt", label: "STT", style: "min-w-16 text-center text-nowrap" },
  { key: "eventName", label: "Tên sự kiện", style: "min-w-72 flex-1 text-nowrap" },
  { key: "status", label: "Tình trạng", style: "min-w-40 text-center text-nowrap" },
  { key: "date", label: "Thời gian tổ chức", style: "min-w-48 text-center text-nowrap" },
  { key: "location", label: "Địa điểm tổ chức", style: "min-w-72 text-nowrap" },
  { key: "attendance", label: "Điểm danh", style: "min-w-40 text-center text-nowrap" },
];

// ================== Dữ liệu mẫu ==================
const EVENT_LIST = [
  {
    key: "event1",
    eventName: "Hội trại truyền thống 2024",
    status: "Hoạt động",
    date: "2024-04-15",
    location: "Công viên Văn hóa Đầm Sen",
    attendance: "Đã điểm danh",
  },
  {
    key: "event2",
    eventName: "Ngày hội Thanh niên khỏe",
    status: "Tạm ngưng",
    date: "2024-07-10",
    location: "Sân vận động Quận 10",
    attendance: "Chưa điểm danh",
  },
  {
    key: "event3",
    eventName: "Cuộc thi lập trình sinh viên",
    status: "Hoạt động",
    date: "2024-09-01",
    location: "Trường Đại học A - Cơ sở 1",
    attendance: "Đã điểm danh",
  },
  {
    key: "event4",
    eventName: "Hiến máu nhân đạo 2024",
    status: "Hoạt động",
    date: "2024-11-25",
    location: "Trường Đại học A - Hội trường lớn",
    attendance: "Chưa điểm danh",
  },
  {
    key: "event5",
    eventName: "Gala tổng kết năm học 2024",
    status: "Tạm ngưng",
    date: "2024-12-20",
    location: "Nhà văn hóa Thanh niên TP.HCM",
    attendance: "Chưa điểm danh",
  },
  ...Array.from({ length: 20 }, (_, i) => ({
    key: `extra${i + 6}`,
    eventName: `Sự kiện ${i + 6}`,
    status: i % 2 === 0 ? "Hoạt động" : "Tạm ngưng",
    date: "2025-01-01",
    location: `Cơ sở ${i + 6}, TP. Hồ Chí Minh`,
    attendance: i % 2 === 0 ? "Đã điểm danh" : "Chưa điểm danh",
  })),
];

// ================== Pagination Component ==================
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) pages.push(1, 2, 3, "...", totalPages);
      else if (currentPage >= totalPages - 2)
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      else
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <div className="flex items-center gap-2 justify-center">
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

        {pages.map((page, i) =>
          page === "..." ? (
            <span key={i} className="px-2 text-gray-400 select-none">
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
function EventTable() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const totalPages = Math.ceil(EVENT_LIST.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedData = EVENT_LIST.slice(startIndex, startIndex + pageSize);

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
        {pagedData.map((event, index) => (
          <ul
            key={event.key}
            className="flex hover:bg-gray-50 transition py-2 items-center border-b border-gray-100 cursor-pointer"
            onClick={() => navigate(`${event.key}`, { state: event })}
          >
            {META_DATA.map((col) => (
              <li key={col.key} className={`p-2 text-sm ${col.style}`}>
                {col.key === "stt" && startIndex + index + 1}
                {col.key === "status" ? (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      event.status === "Hoạt động"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {event.status}
                  </span>
                ) : col.key === "date" ? (
                  new Date(event.date).toLocaleDateString("vi-VN")
                ) : (
                  event[col.key]
                )}
              </li>
            ))}
          </ul>
        ))}
      </div>

      {/* Footer */}
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

export default EventTable;

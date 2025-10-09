import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ================== Cấu hình cột ==================
const META_DATA = [
  { key: "stt", label: "STT", style: "min-w-16 text-center text-nowrap" },
  { key: "name", label: "Tên khảo sát", style: "min-w-72 flex-1 text-nowrap" },
  { key: "status", label: "Trạng thái", style: "min-w-40 text-center text-nowrap" },
  { key: "startDate", label: "Thời gian bắt đầu", style: "min-w-48 text-center text-nowrap" },
  { key: "endDate", label: "Thời gian kết thúc", style: "min-w-48 text-center text-nowrap" },
];

// ================== Dữ liệu mẫu ==================
const SURVEY_LIST = [
  {
    key: "survey1",
    name: "Khảo sát mức độ hài lòng của đoàn viên",
    status: "published",
    startDate: "2025-09-01",
    endDate: "2025-09-15",
  },
  {
    key: "survey2",
    name: "Khảo sát ý kiến về hoạt động Mùa hè xanh 2025",
    status: "closed",
    startDate: "2025-07-20",
    endDate: "2025-08-05",
  },
  {
    key: "survey3",
    name: "Khảo sát nhu cầu học kỹ năng mềm",
    status: "draft",
    startDate: "2025-10-10",
    endDate: "2025-10-25",
  },
  {
    key: "survey4",
    name: "Khảo sát góp ý cho trang web chi đoàn",
    status: "published",
    startDate: "2025-10-01",
    endDate: "2025-10-20",
  },
  {
    key: "survey5",
    name: "Khảo sát ý tưởng tổ chức hội trại 2026",
    status: "draft",
    startDate: "2025-11-01",
    endDate: "2025-11-30",
  },
  ...Array.from({ length: 15 }, (_, i) => ({
    key: `extra${i + 6}`,
    name: `Khảo sát số ${i + 6}`,
    status: i % 3 === 0 ? "draft" : i % 3 === 1 ? "published" : "closed",
    startDate: "2025-09-10",
    endDate: "2025-09-25",
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
function SurveyTable() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const totalPages = Math.ceil(SURVEY_LIST.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedData = SURVEY_LIST.slice(startIndex, startIndex + pageSize);

  const handleChangePageSize = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "draft":
        return "bg-yellow-100 text-yellow-700";
      case "published":
        return "bg-green-100 text-green-700";
      case "closed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
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
        {pagedData.map((survey, index) => (
          <ul
            key={survey.key}
            className="flex hover:bg-gray-50 transition py-2 items-center border-b border-gray-100 cursor-pointer"
            onClick={() => navigate(`${survey.key}`, { state: survey })}
          >
            {META_DATA.map((col) => (
              <li key={col.key} className={`p-2 text-sm ${col.style}`}>
                {col.key === "stt" && startIndex + index + 1}
                {col.key === "status" ? (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      survey.status
                    )}`}
                  >
                    {survey.status === "draft"
                      ? "Nháp"
                      : survey.status === "published"
                      ? "Đang phát hành"
                      : "Đã đóng"}
                  </span>
                ) : col.key === "startDate" || col.key === "endDate" ? (
                  new Date(survey[col.key]).toLocaleDateString("vi-VN")
                ) : (
                  survey[col.key]
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

export default SurveyTable;

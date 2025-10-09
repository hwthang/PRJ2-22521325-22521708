import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import defAvatar from "../../../core/assets/images/avatar.png";

// ================== Cấu hình cột ==================
const META_DATA = [
  { key: "stt", label: "STT", style: "min-w-16 text-center text-nowrap" },
  { key: "chapterName", label: "Tên chi đoàn", style: "min-w-64 flex-1 text-nowrap" },
  { key: "establishedDate", label: "Ngày thành lập", style: "min-w-40 text-center text-nowrap" },
  { key: "parentUnion", label: "Đoàn trực thuộc", style: "min-w-64 text-nowrap" },
  { key: "address", label: "Địa chỉ", style: "min-w-72 text-nowrap" },
  { key: "status", label: "Tình trạng", style: "min-w-32 text-center text-nowrap" },
];

// ================== Dữ liệu mẫu ==================
const CHAPTER_LIST = [
  {
    key: "chapter1",
    avatar: "https://i.pravatar.cc/150?img=11",
    chapterName: "Chi đoàn Kỹ thuật phần mềm 1",
    establishedDate: "2015-03-20",
    parentUnion: "Đoàn Khoa Công nghệ thông tin",
    address: "Trường Đại học A, Quận 1, TP. Hồ Chí Minh",
    status: "Hoạt động",
  },
  {
    key: "chapter2",
    avatar: "https://i.pravatar.cc/150?img=12",
    chapterName: "Chi đoàn Kỹ thuật phần mềm 2",
    establishedDate: "2016-06-15",
    parentUnion: "Đoàn Khoa Công nghệ thông tin",
    address: "Trường Đại học A, Quận 1, TP. Hồ Chí Minh",
    status: "Tạm ngưng",
  },
  {
    key: "chapter3",
    avatar: "https://i.pravatar.cc/150?img=13",
    chapterName: "Chi đoàn Mạng máy tính",
    establishedDate: "2014-09-12",
    parentUnion: "Đoàn Khoa Công nghệ thông tin",
    address: "Trường Đại học A, Quận 1, TP. Hồ Chí Minh",
    status: "Hoạt động",
  },
  {
    key: "chapter4",
    avatar: "https://i.pravatar.cc/150?img=14",
    chapterName: "Chi đoàn Hệ thống thông tin",
    establishedDate: "2017-11-05",
    parentUnion: "Đoàn Khoa Công nghệ thông tin",
    address: "Trường Đại học A, Quận 1, TP. Hồ Chí Minh",
    status: "Hoạt động",
  },
  {
    key: "chapter5",
    avatar: "https://i.pravatar.cc/150?img=15",
    chapterName: "Chi đoàn Khoa học máy tính",
    establishedDate: "2018-02-10",
    parentUnion: "Đoàn Khoa Công nghệ thông tin",
    address: "Trường Đại học A, Quận 1, TP. Hồ Chí Minh",
    status: "Tạm ngưng",
  },
  // ✅ thêm nhiều bản ghi giả để test phân trang
  ...Array.from({ length: 20 }, (_, i) => ({
    key: `extra${i + 6}`,
    avatar: `https://i.pravatar.cc/150?img=${i + 20}`,
    chapterName: `Chi đoàn CNTT ${i + 6}`,
    establishedDate: "2020-01-01",
    parentUnion: "Đoàn Khoa Công nghệ thông tin",
    address: `Cơ sở ${i + 6}, TP. Hồ Chí Minh`,
    status: i % 2 === 0 ? "Hoạt động" : "Tạm ngưng",
  })),
];

// ================== Component Pagination ==================
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <div className="flex items-center gap-2 justify-center">
        <button
          className={`px-3 py-1 rounded-lg border transition ${
            currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-blue-100 border-gray-300"
          }`}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Trước
        </button>

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
                currentPage === page ? "bg-blue-900 text-white border-blue-900" : "border-gray-300 hover:bg-blue-100"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          className={`px-3 py-1 rounded-lg border transition ${
            currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-blue-100 border-gray-300"
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
function ChapterTable() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const totalPages = Math.ceil(CHAPTER_LIST.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedData = CHAPTER_LIST.slice(startIndex, startIndex + pageSize);

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
        {pagedData.map((chapter, index) => (
          <ul
            key={chapter.key}
            className="flex hover:bg-gray-50 transition py-2 items-center border-b border-gray-100 cursor-pointer"
            onClick={() => navigate(`${chapter.key}`, { state: chapter })}
          >
            {META_DATA.map((col) => (
              <li key={col.key} className={`p-2 text-sm ${col.style}`}>
                {col.key === "stt" && startIndex + index + 1}
                {col.key === "chapterName" ? (
                  <div className="flex items-center">
                    <img
                      src={chapter.avatar || defAvatar}
                      alt={chapter.chapterName}
                      className="w-8 h-8 rounded-full object-cover mr-2"
                    />
                    <span>{chapter.chapterName}</span>
                  </div>
                ) : col.key === "establishedDate" ? (
                  new Date(chapter.establishedDate).toLocaleDateString("vi-VN")
                ) : (
                  chapter[col.key]
                )}
              </li>
            ))}
          </ul>
        ))}
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

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}

export default ChapterTable;

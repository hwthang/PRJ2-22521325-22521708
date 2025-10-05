// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Download } from "lucide-react"; // ✅ icon tải xuống

// // ================== Cấu hình cột ==================
// const META_DATA = [
//   { key: "stt", label: "STT", style: "min-w-16 text-center text-nowrap" },
//   { key: "name", label: "Tên tài liệu", style: "min-w-64 flex-1 text-nowrap" },
//   { key: "type", label: "Loại tài liệu", style: "min-w-40 text-center text-nowrap" },
//   { key: "issueDate", label: "Ngày ban hành", style: "min-w-40 text-center text-nowrap" },
//   { key: "issuedBy", label: "Nơi ban hành", style: "min-w-64 text-nowrap" },
//   { key: "download", label: "Tải về", style: "min-w-32 text-center text-nowrap" }, // ✅ cột mới
// ];

// // ================== Dữ liệu mẫu ==================
// const DOCUMENT_LIST = [
//   {
//     key: "doc1",
//     name: "Quy định quản lý hồ sơ",
//     type: "Quy định",
//     issueDate: "2023-01-15",
//     issuedBy: "Sở Nội vụ",
//     fileUrl: "/files/quydinh.pdf",
//   },
//   {
//     key: "doc2",
//     name: "Hướng dẫn sử dụng hệ thống lưu trữ",
//     type: "Hướng dẫn",
//     issueDate: "2023-03-10",
//     issuedBy: "Cục Văn thư Lưu trữ Nhà nước",
//     fileUrl: "/files/huongdan.pdf",
//   },
//   {
//     key: "doc3",
//     name: "Báo cáo thống kê tài liệu năm 2022",
//     type: "Báo cáo",
//     issueDate: "2023-02-01",
//     issuedBy: "Phòng Hành chính",
//     fileUrl: "/files/baocao.pdf",
//   },
//   {
//     key: "doc4",
//     name: "Quyết định thành lập Ban Lưu trữ",
//     type: "Quyết định",
//     issueDate: "2022-12-20",
//     issuedBy: "Ủy ban Nhân dân Tỉnh",
//     fileUrl: "/files/quyetdinh.pdf",
//   },
//   {
//     key: "doc5",
//     name: "Thông tư hướng dẫn lưu trữ điện tử",
//     type: "Thông tư",
//     issueDate: "2023-04-05",
//     issuedBy: "Bộ Thông tin và Truyền thông",
//     fileUrl: "/files/thongtu.pdf",
//   },
//     {
//     key: "doc5",
//     name: "Thông tư hướng dẫn lưu trữ điện tử",
//     type: "Thông tư",
//     issueDate: "2023-04-05",
//     issuedBy: "Bộ Thông tin và Truyền thông",
//     fileUrl: "/files/thongtu.pdf",
//   },
//     {
//     key: "doc5",
//     name: "Thông tư hướng dẫn lưu trữ điện tử",
//     type: "Thông tư",
//     issueDate: "2023-04-05",
//     issuedBy: "Bộ Thông tin và Truyền thông",
//     fileUrl: "/files/thongtu.pdf",
//   },
//     {
//     key: "doc5",
//     name: "Thông tư hướng dẫn lưu trữ điện tử",
//     type: "Thông tư",
//     issueDate: "2023-04-05",
//     issuedBy: "Bộ Thông tin và Truyền thông",
//     fileUrl: "/files/thongtu.pdf",
//   },
//     {
//     key: "doc5",
//     name: "Thông tư hướng dẫn lưu trữ điện tử",
//     type: "Thông tư",
//     issueDate: "2023-04-05",
//     issuedBy: "Bộ Thông tin và Truyền thông",
//     fileUrl: "/files/thongtu.pdf",
//   },
//     {
//     key: "doc5",
//     name: "Thông tư hướng dẫn lưu trữ điện tử",
//     type: "Thông tư",
//     issueDate: "2023-04-05",
//     issuedBy: "Bộ Thông tin và Truyền thông",
//     fileUrl: "/files/thongtu.pdf",
//   },
//     {
//     key: "doc5",
//     name: "Thông tư hướng dẫn lưu trữ điện tử",
//     type: "Thông tư",
//     issueDate: "2023-04-05",
//     issuedBy: "Bộ Thông tin và Truyền thông",
//     fileUrl: "/files/thongtu.pdf",
//   },
//     {
//     key: "doc5",
//     name: "Thông tư hướng dẫn lưu trữ điện tử",
//     type: "Thông tư",
//     issueDate: "2023-04-05",
//     issuedBy: "Bộ Thông tin và Truyền thông",
//     fileUrl: "/files/thongtu.pdf",
//   },
//     {
//     key: "doc5",
//     name: "Thông tư hướng dẫn lưu trữ điện tử",
//     type: "Thông tư",
//     issueDate: "2023-04-05",
//     issuedBy: "Bộ Thông tin và Truyền thông",
//     fileUrl: "/files/thongtu.pdf",
//   },
// ];

// // ================== Component ==================
// function DocumentTable() {
//   const navigate = useNavigate();

//   return (
//     <div className="w-full flex flex-col overflow-auto">
//       {/* Header */}
//       <div className="min-w-fit w-full">
//         <ul className="flex font-semibold bg-blue-100 rounded-sm py-2 border-b border-gray-200">
//           {META_DATA.map((col) => (
//             <li key={col.key} className={`p-2 ${col.style}`}>
//               {col.label}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Rows */}
//       <div className="min-w-fit w-full">
//         {DOCUMENT_LIST.map((doc, index) => (
//           <ul
//   key={index}
//   className="flex hover:bg-gray-50 transition py-2 items-center border-b border-gray-100 cursor-pointer"
//   onClick={() => navigate(`${doc.key}`, { state: doc })}
// >
//   {META_DATA.map((col) => (
//     <li key={col.key} className={`p-2 text-sm ${col.style}`}>
//       {/* STT */}
//       {col.key === "stt" && index + 1}

//       {/* Ngày ban hành */}
//       {col.key === "issueDate" &&
//         new Date(doc.issueDate).toLocaleDateString("vi-VN")}

//       {/* Nút tải về */}
//       {col.key === "download" && (
//         <div className="flex justify-center">
//           <a
//             href={doc.fileUrl}
//             download
//             title="Tải tài liệu"
//             onClick={(e) => e.stopPropagation()} // tránh trigger navigate
//             className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition"
//           >
//             <Download size={16} />
//             <span className="hidden md:inline">Tải</span>
//           </a>
//         </div>
//       )}

//       {/* Các cột khác */}
//       {col.key !== "stt" &&
//         col.key !== "issueDate" &&
//         col.key !== "download" &&
//         doc[col.key]}
//     </li>
//   ))}
// </ul>

//         ))}
//       </div>
//     </div>
//   );
// }

// export default DocumentTable;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download } from "lucide-react";

// ================== Cấu hình cột ==================
const META_DATA = [
  { key: "stt", label: "STT", style: "min-w-16 text-center text-nowrap" },
  { key: "name", label: "Tên tài liệu", style: "min-w-64 flex-1 text-nowrap" },
  { key: "type", label: "Loại tài liệu", style: "min-w-40 text-center text-nowrap" },
  { key: "issueDate", label: "Ngày ban hành", style: "min-w-40 text-center text-nowrap" },
  { key: "issuedBy", label: "Nơi ban hành", style: "min-w-64 text-nowrap" },
  { key: "download", label: "Tải về", style: "min-w-32 text-center text-nowrap" },
];

// ================== Dữ liệu mẫu ==================
const DOCUMENT_LIST = [
  {
    key: "doc1",
    name: "Quy định quản lý hồ sơ",
    type: "Quy định",
    issueDate: "2023-01-15",
    issuedBy: "Sở Nội vụ",
    fileUrl: "/files/quydinh.pdf",
  },
  {
    key: "doc2",
    name: "Hướng dẫn sử dụng hệ thống lưu trữ",
    type: "Hướng dẫn",
    issueDate: "2023-03-10",
    issuedBy: "Cục Văn thư Lưu trữ Nhà nước",
    fileUrl: "/files/huongdan.pdf",
  },
  {
    key: "doc3",
    name: "Báo cáo thống kê tài liệu năm 2022",
    type: "Báo cáo",
    issueDate: "2023-02-01",
    issuedBy: "Phòng Hành chính",
    fileUrl: "/files/baocao.pdf",
  },
  {
    key: "doc4",
    name: "Quyết định thành lập Ban Lưu trữ",
    type: "Quyết định",
    issueDate: "2022-12-20",
    issuedBy: "Ủy ban Nhân dân Tỉnh",
    fileUrl: "/files/quyetdinh.pdf",
  },
  {
    key: "doc5",
    name: "Thông tư hướng dẫn lưu trữ điện tử",
    type: "Thông tư",
    issueDate: "2023-04-05",
    issuedBy: "Bộ Thông tin và Truyền thông",
    fileUrl: "/files/thongtu.pdf",
  },
  // ✅ Thêm nhiều bản ghi để kiểm tra phân trang
  ...Array.from({ length: 25 }, (_, i) => ({
    key: `extra${i + 6}`,
    name: `Tài liệu mẫu ${i + 6}`,
    type: "Mẫu",
    issueDate: "2024-01-01",
    issuedBy: "Phòng Lưu trữ",
    fileUrl: "/files/sample.pdf",
  })),
];

// ================== Pagination Component ==================
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // ✅ Logic phân trang mới — không duplication
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
        {/* Nút Previous */}
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

        {/* Số trang */}
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

        {/* Nút Next */}
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

      {/* Hiển thị Trang X / Y */}
      <p className="text-sm text-gray-600">
        Trang <span className="font-semibold">{currentPage}</span> / {totalPages}
      </p>
    </div>
  );
}

// ================== Component chính ==================
function DocumentTable() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(DOCUMENT_LIST.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedData = DOCUMENT_LIST.slice(startIndex, startIndex + pageSize);

  const handleChangePageSize = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
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
        {pagedData.map((doc, index) => (
          <ul
            key={doc.key}
            className="flex hover:bg-gray-50 transition py-2 items-center border-b border-gray-100 cursor-pointer"
            onClick={() => navigate(`${doc.key}`, { state: doc })}
          >
            {META_DATA.map((col) => (
              <li key={col.key} className={`p-2 text-sm ${col.style}`}>
                {col.key === "stt" && (startIndex + index + 1)}

                {col.key === "issueDate" &&
                  new Date(doc.issueDate).toLocaleDateString("vi-VN")}

                {col.key === "download" && (
                  <div className="flex justify-center">
                    <a
                      href={doc.fileUrl}
                      download
                      title="Tải tài liệu"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition"
                    >
                      <Download size={16} />
                      <span className="hidden md:inline">Tải</span>
                    </a>
                  </div>
                )}

                {col.key !== "stt" &&
                  col.key !== "issueDate" &&
                  col.key !== "download" &&
                  doc[col.key]}
              </li>
            ))}
          </ul>
        ))}
      </div>

      {/* Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
        {/* Chọn số bản ghi */}
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
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
          <span className="text-sm text-gray-600">bản ghi / trang</span>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default DocumentTable;


// import React from "react";
// import { useNavigate } from "react-router-dom";

// // Định nghĩa meta cho header table
// const META_DATA = [
//   { key: "stt", label: "STT", style: "min-w-16 text-center text-nowrap" },
//   { key: "name", label: "Tên tài liệu", style: "min-w-64 flex-1 text-nowrap" },
//   { key: "type", label: "Loại tài liệu", style: "min-w-40 text-center text-nowrap" },
//   { key: "issueDate", label: "Ngày ban hành", style: "min-w-40 text-center text-nowrap" },
//   { key: "issuedBy", label: "Nơi ban hành", style: "min-w-64 text-nowrap" },
// ];

// // Dữ liệu mẫu (documents)
// const DOCUMENT_LIST = [
//   {
//     key: "doc1",
//     name: "Quy định quản lý hồ sơ",
//     type: "Quy định",
//     issueDate: "2023-01-15",
//     issuedBy: "Sở Nội vụ",
//   },
//   {
//     key: "doc2",
//     name: "Hướng dẫn sử dụng hệ thống lưu trữ",
//     type: "Hướng dẫn",
//     issueDate: "2023-03-10",
//     issuedBy: "Cục Văn thư Lưu trữ Nhà nước",
//   },
//   {
//     key: "doc3",
//     name: "Báo cáo thống kê tài liệu năm 2022",
//     type: "Báo cáo",
//     issueDate: "2023-02-01",
//     issuedBy: "Phòng Hành chính",
//   },
//   {
//     key: "doc4",
//     name: "Quyết định thành lập Ban Lưu trữ",
//     type: "Quyết định",
//     issueDate: "2022-12-20",
//     issuedBy: "Ủy ban Nhân dân Tỉnh",
//   },
//   {
//     key: "doc5",
//     name: "Thông tư hướng dẫn lưu trữ điện tử",
//     type: "Thông tư",
//     issueDate: "2023-04-05",
//     issuedBy: "Bộ Thông tin và Truyền thông",
//   },
// ];

// function DocumentTable() {
//   const navigate = useNavigate();

//   return (
//     <div className="w-full flex flex-col overflow-auto">
//       {/* Header */}
//       <div className="min-w-fit w-full">
//         <ul className="flex font-semibold bg-blue-100 rounded-sm py-2">
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
//             key={index}
//             className="flex hover:bg-gray-50 transition py-2 cursor-pointer items-center border-b"
//             onClick={() => navigate(`${doc.key}`, { state: doc })}
//           >
//             {META_DATA.map((col) => (
//               <li key={col.key} className={`p-2 text-sm ${col.style}`}>
//                 {col.key === "stt"
//                   ? index + 1
//                   : col.key === "issueDate"
//                   ? new Date(doc.issueDate).toLocaleDateString("vi-VN")
//                   : doc[col.key]}
//               </li>
//             ))}
//           </ul>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default DocumentTable;
import React from "react";
import { useNavigate } from "react-router-dom";
import { Download } from "lucide-react"; // ✅ icon tải xuống

// ================== Cấu hình cột ==================
const META_DATA = [
  { key: "stt", label: "STT", style: "min-w-16 text-center text-nowrap" },
  { key: "name", label: "Tên tài liệu", style: "min-w-64 flex-1 text-nowrap" },
  { key: "type", label: "Loại tài liệu", style: "min-w-40 text-center text-nowrap" },
  { key: "issueDate", label: "Ngày ban hành", style: "min-w-40 text-center text-nowrap" },
  { key: "issuedBy", label: "Nơi ban hành", style: "min-w-64 text-nowrap" },
  { key: "download", label: "Tải về", style: "min-w-32 text-center text-nowrap" }, // ✅ cột mới
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
];

// ================== Component ==================
function DocumentTable() {
  const navigate = useNavigate();

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
        {DOCUMENT_LIST.map((doc, index) => (
          <ul
  key={index}
  className="flex hover:bg-gray-50 transition py-2 items-center border-b border-gray-100 cursor-pointer"
  onClick={() => navigate(`${doc.key}`, { state: doc })}
>
  {META_DATA.map((col) => (
    <li key={col.key} className={`p-2 text-sm ${col.style}`}>
      {/* STT */}
      {col.key === "stt" && index + 1}

      {/* Ngày ban hành */}
      {col.key === "issueDate" &&
        new Date(doc.issueDate).toLocaleDateString("vi-VN")}

      {/* Nút tải về */}
      {col.key === "download" && (
        <div className="flex justify-center">
          <a
            href={doc.fileUrl}
            download
            title="Tải tài liệu"
            onClick={(e) => e.stopPropagation()} // tránh trigger navigate
            className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition"
          >
            <Download size={16} />
            <span className="hidden md:inline">Tải</span>
          </a>
        </div>
      )}

      {/* Các cột khác */}
      {col.key !== "stt" &&
        col.key !== "issueDate" &&
        col.key !== "download" &&
        doc[col.key]}
    </li>
  ))}
</ul>

        ))}
      </div>
    </div>
  );
}

export default DocumentTable;

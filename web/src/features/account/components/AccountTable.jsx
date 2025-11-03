// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { CheckCircle, XCircle, Clock, UserCircle2 } from "lucide-react";
// import defAvatar from "../../../core/assets/images/avatar.png";

// // ================= Meta =================
// const META_DATA = [
//   { key: "stt", label: "#", style: "min-w-16 text-center" },
//   { key: "name", label: "Người dùng", style: "min-w-60 flex-1" },
//   { key: "username", label: "Tên đăng nhập", style: "min-w-48" },
//   { key: "type", label: "Loại tài khoản", style: "min-w-40 text-center" },
//   { key: "status", label: "Trạng thái", style: "min-w-40 text-center" },
// ];

// // ================= Helper components =================
// const StatusBadge = ({ status }) => {
//   const STATUS_MAP = {
//     active: { icon: <CheckCircle size={16} className="text-green-600" />, label: "Hoạt động", style: "bg-green-50 text-green-700 border-green-200" },
//     locked: { icon: <XCircle size={16} className="text-red-600" />, label: "Bị khóa", style: "bg-red-50 text-red-700 border-red-200" },
//     pending: { icon: <Clock size={16} className="text-yellow-600" />, label: "Chờ xác nhận", style: "bg-yellow-50 text-yellow-700 border-yellow-200" },
//   };

//   const data = STATUS_MAP[status] || STATUS_MAP.pending;

//   return (
//     <div className={`inline-flex items-center gap-1 px-3 py-1 border rounded-full text-xs font-medium ${data.style}`}>
//       {data.icon} {data.label}
//     </div>
//   );
// };

// const TypeBadge = ({ type }) => {
//   const TYPE_MAP = {
//     member: "bg-blue-50 text-blue-700 border-blue-200",
//     chapter: "bg-purple-50 text-purple-700 border-purple-200",
//     admin: "bg-gray-100 text-gray-700 border-gray-300",
//   };
//   return (
//     <span className={`px-3 py-1 text-xs font-medium rounded-full border ${TYPE_MAP[type] || TYPE_MAP.member}`}>
//       {type === "member" ? "Đoàn viên" : type === "chapter" ? "Chi đoàn" : "Quản trị"}
//     </span>
//   );
// };

// // ================= Main Table =================
// function AccountTable({ data, pageSize = 10 }) {
//   const navigate = useNavigate();
//   const [currentPage, setCurrentPage] = useState(1);

//   const totalPages = Math.ceil(data?.length / pageSize || 1);

//   // Lấy dữ liệu theo trang
//   const paginatedData = data?.slice((currentPage - 1) * pageSize, currentPage * pageSize);

//   return (
//     <div className="w-full flex flex-col overflow-auto rounded-xl border border-gray-200 shadow-sm">
//       {/* Header */}
//       <div className="sticky top-0 z-10 bg-blue-50">
//         <ul className="flex font-semibold text-md border-b border-gray-200">
//           {META_DATA.map((col) => (
//             <li key={col.key} className={`p-3 ${col.style}`}>{col.label}</li>
//           ))}
//         </ul>
//       </div>

//       {/* Rows */}
//       <div className="divide-y divide-gray-100 bg-white">
//         {paginatedData?.length > 0 ? (
//           paginatedData.map((acc, index) => (
//             <ul
//               key={index}
//               className="flex items-center hover:bg-gray-50 transition-all cursor-pointer"
//               onClick={() => navigate(`${acc.username}`, { state: {id: acc.id, type:acc.type} })}
//             >
//               {META_DATA.map((col) => (
//                 <li key={col.key} className={`p-3 text-sm ${col.style}`}>
//                   {col.key === "stt" ? ((currentPage - 1) * pageSize + index + 1) :
//                    col.key === "name" ? (
//                     <div className="flex items-center gap-3">
//                       <img src={acc.avatar?.path || defAvatar} alt={acc.name} className="w-9 h-9 rounded-full object-cover border" />
//                       <div className="flex flex-col">
//                         <span className="font-medium">{acc.name || "Cấp quản lý"}</span>
//                         <span className="text-xs flex items-center gap-1">
//                           <UserCircle2 size={12} /> {acc.email || "—"}
//                         </span>
//                       </div>
//                     </div>
//                   ) : col.key === "status" ? (
//                     <StatusBadge status={acc.status} />
//                   ) : col.key === "type" ? (
//                     <TypeBadge type={acc.type} />
//                   ) : acc[col.key] || "—"}
//                 </li>
//               ))}
//             </ul>
//           ))
//         ) : (
//           <div className="py-10 text-center text-sm">
//             Không có tài khoản nào phù hợp 🫤
//           </div>
//         )}
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-end items-center gap-2 p-3 border-t border-gray-200">
//           <button
//             className="px-3 py-1 border rounded disabled:opacity-50"
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//           >
//             Trước
//           </button>
//           <span className="px-2">{currentPage} / {totalPages}</span>
//           <button
//             className="px-3 py-1 border rounded disabled:opacity-50"
//             onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages}
//           >
//             Sau
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AccountTable;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import ConfirmModal from "../../../core/components/ConfirmModal";
import defAvatar from '../../../core/assets/images/avatar.png'

function AccountTable({ accounts }) {
  const navigate = useNavigate();
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-300">
        <thead className="bg-blue-100 block rounded-md">
          <tr className="grid grid-cols-12 h-12 flex items-center">
            <th className="px-4 py-2 text-center">STT</th>
            <th className="px-4 py-2 text-center col-span-3">
              Tên người dùng
            </th>
            <th className=" px-4 py-2 text-center col-span-2">Email</th>
            <th className=" px-4 py-2 text-center col-span-2">Số điện thoại</th>
            <th className=" px-4 py-2 text-center text-nowrap col-span-2">
              Loại tài khoản
            </th>
            <th className=" px-4 py-2 text-center text-nowrap col-span-2">
              Trạng thái
            </th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc, index) => (
            <tr
              key={acc.id}
              className="border-b-1 border-gray-300 cursor-pointer hover:bg-gray-100 grid grid-cols-12 flex items-center h-12"
              onClick={() => navigate(`/accounts/${acc._id}`)}
            >
              <td className=" px-4 py-2 text-center">{index + 1}</td>

              <td className="px-4 py-2 col-span-3 text-center">
                <div className="flex gap-4 items-center">
                  <img src={acc.avatar.path || defAvatar} className="w-8 h-8 rounded-full" />
                  {acc.username}
                </div>
              </td>
              <td className=" px-4 py-2 col-span-2 text-center">{acc.email}</td>
               <td className=" px-4 py-2 col-span-2 text-center">{acc.phoneNumber}</td>
              <td className="text-center px-4 py-2 text-sm col-span-2">
                {acc.type === "admin" ? (
                  <span className="px-2 py-1 rounded-md bg-violet-100 border-violet-300 text-violet-500 font-semibold text-center">
                    Quản trị viên
                  </span>
                ) : acc.type === "chapter" ? (
                  <span className="px-2 py-1 rounded-md bg-pink-100 border-pink-300 text-pink-500 font-semibold text-center">
                    Chi đoàn
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-md bg-blue-100 border-blue-300 text-blue-500 font-semibold text-center">
                    Đoàn viên
                  </span>
                )}
              </td>
              <td className="text-center px-4 py-2 text-sm col-span-2">
                {acc.status === "active" ? (
                  <span className="px-2 py-1 rounded-md bg-green-100 border-green-300 text-green-500 font-semibold text-center">
                    Đang hoạt động
                  </span>
                ) : acc.status === "locked" ? (
                  <span className="px-2 py-1 rounded-md bg-red-100 border-red-300 text-red-500 font-semibold text-center">
                    Đã khóa
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-md bg-yellow-100 border-yellow-300 text-yellow-500 font-semibold text-center">
                    Chờ duyệt
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AccountTable;

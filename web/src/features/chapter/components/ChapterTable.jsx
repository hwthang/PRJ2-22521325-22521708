import React from "react";
import defAvatar from "../../../core/assets/images/avatar.png";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/date";

function ChapterTable({
  chapters = [
   
  ],
}) {
  const navigate = useNavigate();
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-200">
        <thead className="bg-blue-100 block rounded-md ">
          <tr className="grid grid-cols-12 h-12 flex items-center ">
            <th className="px-4 py-2 text-center ">STT</th>
            <th className="px-4 py-2 text-center col-span-3">Tên chi đoàn</th>
            <th className="px-4 py-2 text-center col-span-2">Ngày thành lập</th>
            <th className="px-4 py-2 text-center col-span-3">
              Đoàn trực thuộc
            </th>
            <th className="px-4 py-2 text-center col-span-3">Địa chỉ</th>
          </tr>
        </thead>

        <tbody>
          {chapters.length > 0 ? (
            chapters.map((chapter, index) => (
              <tr
                onClick={() => navigate(`/chapters/${chapter._id}`)}
                key={chapter._id}
                className="hover:bg-gray-50 grid grid-cols-12 cursor-pointer"
              >
                <td className="border-b-1 border-gray-300 px-4 py-2 text-center flex items-center justify-center">
                  {index + 1}
                </td>

                <td className="border-b-1 border-gray-300 px-4 py-2 col-span-3 flex items-center">
                  <div className="flex gap-3 items-center">
                    <img
                      src={chapter?.accountId?.avatar?.path || defAvatar}
                      alt={chapter.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span>{chapter.name}</span>
                  </div>
                </td>
                <td className="border-b-1 border-gray-300 px-4 py-2 text-center text-sm col-span-2 flex items-center justify-center">
                  {formatDate(chapter.establishedAt)}
                </td>
                <td className="border-b-1 border-gray-300 px-4 py-2 col-span-3 flex items-center justify-center">
                  {chapter.affiliated}
                </td>
                <td className="border-b-1 border-gray-300 px-4 py-2 col-span-3 flex items-center text-justify">
                  {chapter.address}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="text-center py-6 text-gray-500 text-sm"
              >
                Không có dữ liệu hiển thị 🫤
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ChapterTable;

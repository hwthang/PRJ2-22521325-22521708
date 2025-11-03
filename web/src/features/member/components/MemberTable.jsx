import React from "react";
import defAvatar from "../../../core/assets/images/avatar.png";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/date";

function MemberTable({ members = [] }) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-200">
        <thead className="bg-blue-100 block rounded-md">
          <tr className="grid grid-cols-12 h-12 flex items-center">
            <th className="px-4 py-2 text-center">STT</th>
            <th className="px-4 py-2 text-center col-span-3">Họ và tên</th>
            <th className="px-4 py-2 text-center col-span-2">Số thẻ đoàn</th>
            <th className="px-4 py-2 text-center col-span-3">Chức vụ</th>
            <th className="px-4 py-2 text-center col-span-3">Chi đoàn sinh hoạt</th>
          </tr>
        </thead>

        <tbody>
          {members.length > 0 ? (
            members.map((member, index) => (
              <tr
                onClick={() => navigate(`/members/${member._id}`)}
                key={member._id}
                className="hover:bg-gray-50 grid grid-cols-12 cursor-pointer"
              >
                <td className="border-b-1 border-gray-300 px-4 py-2 text-center flex items-center justify-center">
                  {index + 1}
                </td>

                <td className="border-b-1 border-gray-300 px-4 py-2 col-span-3 flex items-center">
                  <div className="flex gap-3 items-center">
                    <img
                      src={member?.accountId?.avatar?.path || defAvatar}
                      alt={member.fullName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span>{member.fullName}</span>
                  </div>
                </td>

                <td className="border-b-1 border-gray-300 px-4 py-2 text-center text-sm col-span-2 flex items-center justify-center">
                  {member.memberCode}
                </td>

                <td className="border-b-1 border-gray-300 px-4 py-2 col-span-3 flex items-center justify-center">
                  {member.position}
                </td>

                <td className="border-b-1 border-gray-300 px-4 py-2 col-span-3 flex items-center text-center justify-center">
                  {member?.chapterId?.name}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12" className="text-center py-6 text-gray-500 text-sm">
                Không có dữ liệu hiển thị 🫤
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MemberTable;

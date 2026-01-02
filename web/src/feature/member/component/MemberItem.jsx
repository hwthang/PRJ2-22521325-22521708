import React from "react";
import { defAvatar } from "../../../core/assets/images";

const MemberItem = ({ data }) => {
  return (
    <div className="cursor-pointer hover:bg-gray-50 rounded-md h-full flex flex-col md:grid md:grid-cols-12 gap-4 p-4 shadow-md border border-gray-200 md:items-center">
      
      {/* Avatar + Fullname */}
      <div className="flex gap-4 items-center md:col-span-3">
        <img
          src={data.avatar || defAvatar}
          alt={data.fullName}
          className="h-10 w-10 rounded-full object-cover"
        />
        <span className="font-medium">{data.fullName}</span>
      </div>

      {/* Chi đoàn sinh hoạt */}
      <div className="flex flex-col gap-1 md:col-span-3 border-l-2 pl-2 md:pl-0 md:border-none md:text-center">
        <span className="font-medium text-gray-500 text-sm md:hidden">CHI ĐOÀN</span>
        <span className="text-sm">{data.chapterName || "-"}</span>
      </div>

      {/* Chức vụ */}
      <div className="flex flex-col gap-1 md:col-span-2 border-l-2 pl-2 md:pl-0 md:border-none md:text-center">
        <span className="font-medium text-gray-500 text-sm md:hidden">CHỨC VỤ</span>
        <span className="text-sm">{data.position || "-"}</span>
      </div>

      {/* Số thẻ đoàn */}
      <div className="flex flex-col gap-1 md:col-span-2 border-l-2 pl-2 md:pl-0 md:border-none md:text-center">
        <span className="font-medium text-gray-500 text-sm md:hidden">SỐ THẺ ĐOÀN</span>
        <span className="text-sm">{data.memberCode || "-"}</span>
      </div>

      {/* Ngày vào đoàn */}
      <div className="flex flex-col gap-1 md:col-span-2 border-l-2 pl-2 md:pl-0 md:border-none md:text-center">
        <span className="font-medium text-gray-500 text-sm md:hidden">NGÀY VÀO ĐOÀN</span>
        <span className="text-sm">{data.joinedAt || "-"}</span>
      </div>
    </div>
  );
};

export default MemberItem;

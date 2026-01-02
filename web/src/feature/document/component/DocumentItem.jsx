import React from "react";
import { Link } from "react-router-dom"; 
import { CustomLabel } from "../../component/custom/CustomLabel";
import { documentTypes } from "../page/DocumentListPage";

export const DocumentItem = ({ data }) => {
  const typeInfo = documentTypes[data.type];

  return (
    // BỌC TOÀN BỘ ITEM BẰNG LINK
    <Link
      to={data._id}
      className="block cursor-pointer hover:bg-gray-50 rounded-md shadow-md border border-gray-200 mb-2"
    >
      <div className="h-full flex flex-col md:grid md:grid-cols-12 gap-4 p-4 md:items-center flex-wrap">

        {/* 1. SỐ HIỆU (col-span-2) - Căn giữa */}
        <div className="flex flex-col gap-1 md:col-span-2 border-l-2 pl-2 md:pl-0 md:border-none">
          <span className="font-medium text-gray-500 text-xs md:hidden">
            SỐ HIỆU
          </span>
          {/* Căn giữa trên desktop */}
          <span className="md:text-center text-base font-semibold text-sm">{data.docCode}</span>
        </div>

        {/* 2. TÊN TÀI LIỆU (col-span-4) - Căn trái */}
        <div className="flex flex-col gap-1 md:col-span-4 border-l-2 pl-2 md:pl-0 md:border-none">
          <span className="font-medium text-blue-600 hover:text-blue-800 text-sm">
            {data.name}
          </span>
        </div>

        {/* 3. NGÀY BAN HÀNH (col-span-2) - Căn giữa */}
        <div className="flex flex-col gap-1 md:col-span-2 border-l-2 pl-2 md:pl-0 md:border-none">
          <span className="font-medium text-gray-500 text-xs md:hidden">
            NGÀY BAN HÀNH
          </span>
          {/* Căn giữa trên desktop */}
          <span className="md:text-center text-sm">
            {data.issuedAt
              ? new Date(data.issuedAt).toLocaleDateString("vi-VN")
              : "--"}
          </span>
        </div>

        {/* 4. LOẠI TÀI LIỆU (col-span-4) - Căn giữa */}
        <div className="flex flex-col gap-1 md:col-span-4 border-l-2 pl-2 md:pl-0 md:border-none">
          <span className="font-medium text-gray-500 text-xs md:hidden">
            LOẠI TÀI LIỆU
          </span>
          {/* CustomLabel được dùng để hiển thị loại tài liệu, căn giữa trên desktop */}
          <div className="md:flex md:justify-center"> 
            {typeInfo && (
              <CustomLabel
                label={typeInfo.label}
                icon={typeInfo.icon}
                color={typeInfo.color}
                selected
                clickable={false}
              />
            )}
          </div>
        </div>

        {/* ACTION / ICON DOWNLOAD/EDIT đã được loại bỏ */}
        
      </div>
    </Link>
  );
};
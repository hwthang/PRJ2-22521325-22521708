import React from "react";
import { defAvatar } from "../../../core/assets/images";
import { STATUS_MAP } from "../../../utils/map";
import { formatDate } from "../../../utils/date";

function MemberItem({
  member = {
    fullName: "Đặng Hữu Thắng",
    memberCode: "000001",
   position: "Bí thư ",
    joinedAt: "2022-12-12",
    address: "19 Trần Quang Khải, phường Đông Hòa, thành phố Hồ Chí Minh",
    status: "active",
  },
}) {
  const {
    avatar,
    fullName,
    memberCode,
   position,
    joinedAt,
    address,
    status,
  } = member;

  // Class cho tiêu đề nhỏ (Trực thuộc, Ngày thành lập, Địa chỉ)
  const labelClass =
    "text-sm text-gray-400 font-medium uppercase tracking-wider";
  // Class cho nội dung chính
  const valueClass = "mt-0.5 text-base font-semibold text-sm";

  return (
    // Thẻ chính: Bo góc, đổ bóng nhẹ, thêm viền trái XANH DƯƠNG
    <div
      className="overflow-hidden rounded-lg shadow-md bg-white 
                    transition-transform hover:shadow-xl hover:-translate-y-0.5 
                    border-l-4 border-blue-600 p-4 relative z-0"
    >
      {/* 1. Phần Avatar và Tên Chi đoàn */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
        <div className="flex items-center flex-1 gap-4">
          <img
            src={avatar || defAvatar}
            alt={`Ảnh đại diện của ${fullName}`}
            // Giữ kích thước avatar vừa phải, bo tròn hoàn toàn
            className="h-16 w-16 min-h-16 min-w-16 rounded-full object-cover ring-2 ring-blue-100"
          />
          {/* Tên Chi đoàn: Lớn, in đậm, màu xanh đậm */}
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-blue-800 leading-snug">
              {fullName}
            </h3>
       
          </div>
        </div>
        <div
          className={`w-fit gap-2 font-semibold flex items-center justify-center p-2 text-sm rounded-lg ${STATUS_MAP[status]?.color}`}
        >
          {STATUS_MAP[status]?.icon}
          {STATUS_MAP[status]?.label}
        </div>
      </div>

      {/* 2. Phần Thông tin chi tiết - Bố cục linh hoạt */}
      <div className="grid grid-cols-6 gap-x-4 gap-y-3">
        <div className="col-span-3 md:col-span-1 border-l-2 border-pink-500 pl-3">
          <span className={labelClass}>Số thẻ đoàn</span>
          <p className={`${valueClass}`}>{memberCode}</p>
        </div>
        {/* Ngày thành lập: 2 cột (màn hình nhỏ) */}
        <div className="col-span-3 md:col-span-1 border-l-2 border-amber-500 pl-3">
          <span className={labelClass}>Ngày vào đoàn</span>
          <p className={`${valueClass}`}>{formatDate(joinedAt)}</p>
        </div>

        {/* Đoàn trực thuộc: 3 cột (màn hình nhỏ) */}
        <div className="col-span-3 md:col-span-1 border-l-2 border-green-500 pl-3">
          <span className={labelClass}>Chức vụ</span>
          {/* font-medium và truncate để xử lý tên dài */}
          <p
            className={`${valueClass} font-medium truncate`}
            title={position}
          >
            {position}
          </p>
        </div>

        {/* Địa chỉ: Toàn bộ chiều ngang (6 cột) */}
        <div className="col-span-6 md:col-span-3 border-l-2 border-red-500 pl-3">
          <span className={labelClass}>Địa chỉ</span>
          <p className={`${valueClass} font-normal`}>{address}</p>
        </div>
      </div>
    </div>
  );
}

export default MemberItem;

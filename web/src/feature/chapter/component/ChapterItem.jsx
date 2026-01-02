import React from "react";
import { formatDate } from "../../../utils/date";
import { defAvatar } from "../../../core/assets/images";

const ChapterItem = ({
  data = {
    avatar: defAvatar,
    username: "dongb",
    email: "dongb.qldv@gmail.com",
    phoneNumber: "0987654322",
    name: "Chi đoàn khu phố Đông A",
    affiliated: "Đoàn phường Đông Hòa",
    establishedAt: "1990-01-02T00:00:00.000Z",
    address: "19 Trần Quang Khải, phường Đông Hòa, thành phố Hồ Chí Minh",
  },
}) => {
  return (
    <div className="cursor-pointer hover:bg-blue-50 rounded-md h-full flex flex-col md:grid md:grid-cols-12 gap-4 p-4 shadow-md border border-gray-200 md:items-center flex-wrap">
      <div className="flex gap-4 items-center md:col-span-4">
        <img src={data.avatar} className="h-12 w-12 rounded-full" />
        <span className=" font-medium ">{data.name}</span>
      </div>

      <div className="flex flex-col gap-2 border-l-2 pl-2 md:col-span-3 md:pl-0 md:border-none">
        <span className="font-medium text-gray-500 text-sm md:hidden ">
          ĐOÀN TRỰC THUỘC
        </span>
        <span className="text-center text-sm"> {data.affiliated}</span>
      </div>

      <div className="flex flex-col gap-2 border-l-2 pl-2 md:col-span-1 md:pl-0 md:border-none">
        <span className="font-medium text-gray-500 text-sm md:hidden md:text-center">
          NGÀY THÀNH LẬP
        </span>
        <span className="md:text-center text-sm">
          {formatDate(data.establishedAt)}
        </span>
      </div>

      <div className="flex flex-col gap-2 border-l-2 pl-2 md:col-span-4 md:pl-0 md:border-none">
        <span className="font-medium text-gray-500 text-sm md:hidden">
          ĐỊA CHỈ
        </span>
        <span className="text-sm">{data.address}</span>
      </div>
    </div>
  );
};

export default ChapterItem;

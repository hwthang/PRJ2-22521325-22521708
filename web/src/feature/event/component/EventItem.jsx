import React from "react";
import { Clock } from "lucide-react";
import { formatVietnamDatetimeAMPM } from "../../../utils/date";
import { eventTopics, eventStatuses } from "../shared/EventMap";
import { CustomLabel } from "../../component/custom/CustomLabel";

export const EventItem = ({data}) => {
  // Mock dữ liệu sự kiện
  // const data = {
  //   id: "1",
  //   name: "Đại hội chi đoàn khu phố Đông B nhiệm kỳ 2025-2026",
  //   startTime: "2025-04-12T07:30:00.000Z",
  //   endTime: "2025-04-12T09:30:00.000Z",
  //   location: "Hội trường E, Đại học Công nghệ Thông tin – ĐHQG TP.HCM",
  //   status: "upcoming", // key từ eventStatuses
  //   topics: ["volunteer", "environment", "technology"], // key từ eventTopics
  // };

  const statusInfo = eventStatuses[data.status];

  return (
    <div className="cursor-pointer hover:bg-gray-50 rounded-md h-full flex flex-col md:grid md:grid-cols-12 gap-4 p-4 shadow-md border border-gray-200 md:items-center flex-wrap">

      {/* TÊN SỰ KIỆN */}
      <div className="flex flex-col gap-1 border-l-2 pl-2 md:col-span-3 md:pl-0 md:border-none">
        <span className="font-medium text-gray-500 text-xs md:hidden">
          TÊN SỰ KIỆN
        </span>
        <span className="md:text-justify font-medium">{data.name}</span>
      </div>

      {/* THỜI GIAN BẮT ĐẦU */}
      <div className="flex flex-col gap-1 border-l-2 pl-2 md:col-span-2 md:pl-0 md:border-none">
        <span className="font-medium text-gray-500 text-xs md:hidden">
          BẮT ĐẦU
        </span>
        <span className="md:text-center text-sm">
          {formatVietnamDatetimeAMPM(data.startTime)}
        </span>
      </div>

      {/* THỜI GIAN KẾT THÚC */}
      <div className="flex flex-col gap-1 border-l-2 pl-2 md:col-span-2 md:pl-0 md:border-none">
        <span className="font-medium text-gray-500 text-xs md:hidden">
          KẾT THÚC
        </span>
        <span className="md:text-center text-sm">
          {formatVietnamDatetimeAMPM(data.endTime)}
        </span>
      </div>

      {/* ĐỊA CHỈ */}
      <div className="flex flex-col gap-1 border-l-2 pl-2 md:col-span-3 md:pl-0 md:border-none">
        <span className="font-medium text-gray-500 text-xs md:hidden">
          ĐỊA ĐIỂM
        </span>
        <span className="text-sm">{data.location}</span>
      </div>

      {/* TRẠNG THÁI */}
      <div className="flex flex-col gap-1 border-l-2 pl-2 md:col-span-2 md:pl-0 md:border-none">
        <span className="font-medium text-gray-500 text-xs md:hidden ">
          TRẠNG THÁI
        </span>
        <div className="flex gap-2 items-center md:justify-center">
          <CustomLabel
            label={statusInfo?.label ?? "Không rõ"}
            color={statusInfo?.color ?? "gray"}
            icon={statusInfo?.icon ?? "Clock"}
            selected
          />
        </div>
      </div>

      {/* CHỦ ĐỀ SỰ KIỆN */}
      <div className="flex flex-col gap-1 border-l-2 pl-2 md:col-span-12 md:pl-0 md:border-l-0 md:border-gray-200 md:border-t-2 md:py-2">
        <span className="font-medium text-gray-500 text-xs md:hidden">
          CHỦ ĐỀ
        </span>
        <div className="flex gap-2 flex-wrap">
          {data.topics.map((key) => {
            const topic = eventTopics[key];
            if (!topic) return null;
            return (
              <CustomLabel
                key={key}
                label={topic.label}
                color={topic.color}
                icon={topic.icon}
                selected
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

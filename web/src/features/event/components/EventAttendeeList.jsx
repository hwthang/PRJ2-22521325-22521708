import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  CircleDashed,
  Search,
} from "lucide-react";

const EventAttendeeList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Dữ liệu mẫu
  const [attendees, setAttendees] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      unit: "Chi đoàn 1",
      memberId: "CD00123",
      status: "checked_in",
      checkInTime: "08:30 27/10/2025",
    },
    {
      id: 2,
      name: "Trần Thị B",
      unit: "Chi đoàn 2",
      memberId: "CD00124",
      status: "not_checked",
      checkInTime: null,
    },
    {
      id: 3,
      name: "Phạm Văn C",
      unit: "Chi đoàn 3",
      memberId: "CD00125",
      status: "absent",
      checkInTime: null,
    },
  ]);

  // Đổi trạng thái
  const handleToggleStatus = (id) => {
    setAttendees((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;

        let newStatus;
        let newTime = a.checkInTime;

        switch (a.status) {
          case "not_checked":
            newStatus = "checked_in";
            newTime =
              new Date().toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              }) +
              " " +
              new Date().toLocaleDateString("vi-VN");
            break;
          case "checked_in":
            newStatus = "absent";
            newTime = null;
            break;
          default:
            newStatus = "not_checked";
            newTime = null;
        }

        return { ...a, status: newStatus, checkInTime: newTime };
      })
    );
  };

  // Lọc theo từ khóa (tên, chi đoàn, hoặc số thẻ đoàn)
  const filtered = attendees.filter((a) => {
    const keyword = searchTerm.toLowerCase();
    return (
      a.name.toLowerCase().includes(keyword) ||
      a.unit.toLowerCase().includes(keyword) ||
      a.memberId.toLowerCase().includes(keyword)
    );
  });

  // Icon trạng thái
  const renderStatusIcon = (status) => {
    switch (status) {
      case "checked_in":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "absent":
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <CircleDashed className="w-6 h-6 text-gray-400" />;
    }
  };

  // Text trạng thái
  const renderStatusText = (a) => {
    switch (a.status) {
      case "checked_in":
        return (
          <div className="flex items-center justify-center gap-2 text-green-600">
            <Clock className="w-5 h-5" />
            <span className="text-base">{a.checkInTime}</span>
          </div>
        );
      case "absent":
        return <span className="text-red-500 font-semibold text-base">Vắng mặt</span>;
      default:
        return <span className="text-gray-400 italic text-base">Chưa điểm danh</span>;
    }
  };

  return (
    <div className="col-span-12 md:col-span-8 md:col-start-3 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm theo họ tên, chi đoàn hoặc số thẻ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-md">
        <table className="min-w-full bg-white text-gray-700 text-base">
          <thead className="bg-blue-50 text-gray-700 font-semibold">
            <tr>
              <th className="py-3 px-4 text-center w-14">STT</th>
              <th className="py-3 px-4 text-left">Họ và tên</th>
              <th className="py-3 px-4 text-left">Chi đoàn</th>
              <th className="py-3 px-4 text-left">Số thẻ đoàn</th>
              <th className="py-3 px-4 text-center w-32">Trạng thái</th>
              <th className="py-3 px-4 text-center w-48">Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((a, index) => (
                <tr
                  key={a.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 text-center">{index + 1}</td>
                  <td className="py-3 px-4 font-medium">{a.name}</td>
                  <td className="py-3 px-4">{a.unit}</td>
                  <td className="py-3 px-4">{a.memberId}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(a.id)}
                      className="flex items-center justify-center mx-auto hover:scale-110 transition-transform"
                    >
                      {renderStatusIcon(a.status)}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {renderStatusText(a)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-5 text-gray-500">
                  Không tìm thấy kết quả
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventAttendeeList;

import React from "react";

// Icon Check và User (Giữ nguyên)
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

// Hàm lấy class trạng thái (Giữ nguyên)
const getStatusClasses = (status) => {
  switch (status) {
    case "present":
      return {
        text: "Đã điểm danh",
        color: "bg-green-100 text-green-700 border-green-300",
        buttonText: "Đã điểm danh",
        buttonColor: "bg-green-600 hover:bg-green-700",
        isDisabled: true,
      };
    case "absent":
      return {
        text: "Vắng mặt",
        color: "bg-red-100 text-red-700 border-red-300",
        buttonText: "Điểm danh Vắng",
        buttonColor: "bg-red-600 hover:bg-red-700",
        isDisabled: false,
      };
    case "pending":
    default:
      return {
        text: "Chờ điểm danh",
        color: "bg-yellow-100 text-yellow-700 border-yellow-300",
        buttonText: "Điểm danh (Có mặt)",
        buttonColor: "bg-indigo-600 hover:bg-indigo-700",
        isDisabled: false,
      };
  }
};

const AttendanceItem = ({
  attendance = {
    _id: "691b1f569142d32cb2479953",
    eventId: "691b1f3d9142d32cb247994f",
    memberId: {
      _id: "691b1f209142d32cb2479949",
      accountId: {
        _id: "691b1f089142d32cb2479944",
        avatar: null,
        username: "member",
        email: "member@qldv.com",
        phoneNumber: "0909090909",
        password:
          "$2b$10$0m9BcnJUfhUPLIxMuXKJCuqC75vUi2kSYsY4m8u7vWsMTaY93yC6e",
        type: "member",
        status: "active",
        createdAt: "2025-11-17T13:11:36.548Z",
        updatedAt: "2025-11-17T13:11:36.548Z",
        __v: 0,
      },
      chapterId: {
        _id: "691b1ee19142d32cb247993e",
        accountId: "691b1ed59142d32cb2479939",
        name: "Chi đoàn khu phố Đông A",
        affiliated: "Đoàn phường Đông Hòa",
        establishedAt: "1990-01-01T00:00:00.000Z",
        address: "19 Trần Quang Khải, phường Đông Hòa, thành phố Hồ Chí Minh",
        createdAt: "2025-11-17T13:10:57.232Z",
        updatedAt: "2025-11-17T13:10:57.232Z",
        __v: 0,
      },
      fullName: "Đặng Hữu Thắng",
      gender: "Nam",
      dateOfBirth: "2004-10-25T00:00:00.000Z",
      hometown: "19 Trần Quang Khải, phường Đông Hòa, thành phố Hồ Chí Minh",
      address: "19 Trần Quang Khải, phường Đông Hòa, thành phố Hồ Chí Minh",
      ethnicity: "Kinh",
      religion: "Không",
      education: "Đại học",
      qualification: "Kĩ sư",
      politicalTheory: "Sơ cấp",
      memberCode: "090900",
      joinedAt: "2023-03-26T00:00:00.000Z",
      position: "Phó Bí thư",
      createdAt: "2025-11-17T13:12:00.800Z",
      updatedAt: "2025-11-17T13:12:00.800Z",
      __v: 0,
    },
    status: "pending",
    createdAt: "2025-11-17T13:12:54.641Z",
    updatedAt: "2025-11-17T13:12:54.641Z",
    __v: 0,
  },
  onManualAttendance, // Hàm xử lý khi nhấn nút điểm danh
}) => {
  const member = attendance.memberId;
  const chapter = member?.chapterId;
  const statusInfo = getStatusClasses(attendance.status);

  const handleAttendance = () => {
    if (onManualAttendance && attendance.status === "pending") {
      onManualAttendance(attendance._id, "present");
    }
  };

  return (
    <div className="border border-gray-200 shadow-sm hover:shadow-md transition duration-200 ease-in-out p-4 rounded-lg grid grid-cols-12 items-center bg-white">
      {/* Cột 1: Thông tin Đoàn viên */}
      {/* Chiếm 8/12 cột trên màn hình nhỏ (sm), 4/12 trên md, 3/12 trên lg */}
      <div className="col-span-6 sm:col-span-5 md:col-span-4 lg:col-span-3 flex items-center space-x-3 truncate">
        <div className="flex-shrink-0 p-2 bg-indigo-50 rounded-full text-indigo-600">
          <UserIcon />
        </div>
        <div className="truncate">
          <p
            className="text-sm font-semibold text-gray-900 truncate"
            title={member?.fullName}
          >
            {member?.fullName || "N/A"}
          </p>
          <p
            className="text-xs text-gray-500 truncate"
            title={member?.position}
          >
            {member?.position || "Đoàn viên"} - {member?.memberCode || "N/A"}
          </p>
        </div>
      </div>

      {/* Cột 2: Thông tin Chi đoàn */}
      {/* Chỉ hiển thị từ màn hình Medium trở lên. Chiếm 4/12 cột */}
      <div className="col-span-0 md:col-span-4 lg:col-span-4 text-xs text-gray-600 truncate hidden md:block">
        <p className="font-medium truncate" title={chapter?.name}>
          {chapter?.name || "Chi đoàn N/A"}
        </p>
        <p className="truncate" title={chapter?.affiliated}>
          Trực thuộc: {chapter?.affiliated || "N/A"}
        </p>
      </div>

      {/* Cột 3: Trạng thái */}
      {/* Chỉ hiển thị từ màn hình Large trở lên. Chiếm 1/12 cột */}
      <div className="col-span-0 lg:col-span-2 hidden lg:block">
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full border ${statusInfo.color}`}
        >
          {statusInfo.text}
        </span>
      </div>

      {/* Cột 4: Nút hành động */}
      {/* Chiếm 5/12 cột trên sm, 4/12 trên md, 3/12 trên lg. Dịch sang phải */}
      <div className="col-span-5 sm:col-span-7 md:col-span-4 lg:col-span-3 flex justify-end">
        {attendance.status === "present" ? (
          <div className="text-green-600 font-semibold flex items-center space-x-1 text-sm">
            <CheckIcon />
            <span className="hidden sm:block">Đã xong</span>
            <span className="sm:hidden">Xong</span>
          </div>
        ) : (
          <button
            onClick={handleAttendance}
            disabled={statusInfo.isDisabled}
            className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md shadow-sm text-white transition duration-150 ease-in-out
                            ${statusInfo.buttonColor}
                            ${
                              statusInfo.isDisabled
                                ? "opacity-50 cursor-not-allowed"
                                : "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            }
                        `}
            title="Thực hiện điểm danh thủ công"
          >
            <span className="hidden sm:block">{statusInfo.buttonText}</span>
            <span className="sm:hidden">Điểm danh</span>{" "}
            {/* Rút gọn chữ trên mobile */}
          </button>
        )}
      </div>
    </div>
  );
};

export default AttendanceItem;

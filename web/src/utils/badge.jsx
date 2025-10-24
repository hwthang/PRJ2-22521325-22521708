export const getStatusBadge = (status) => {
  switch (status) {
    case "active":
      return (
        <span className="flex justify-center items-center h-full w-full bg-green-50 text-green-700 border-green-200 border rounded-full text-sm font-medium">
          Hoạt động
        </span>
      );
    case "locked":
      return (
        <span className="flex justify-center items-center h-full w-full bg-red-50 text-red-700 border-red-200 border rounded-full text-sm font-medium">
          Bị khóa
        </span>
      );
    case "pending":
      return (
        <span className="flex justify-center items-center h-full w-full bg-yellow-50 text-yellow-700 border-yellow-200 border rounded-full text-sm font-medium">
          Chờ xác nhận
        </span>
      );
    default:
      return (
        <span className="flex justify-center items-center bg-gray-50 text-gray-700 border-gray-200 border rounded-full text-sm font-medium">
          Không xác định
        </span>
      );
  }
};

export const getTypeBadge = (type) => {
  switch (type) {
    case "member":
      return (
        <span className=" flex justify-center h-full w-full items-center bg-blue-50 text-blue-700 border-blue-200 border rounded-full text-sm font-medium">
          Đoàn viên
        </span>
      );
    case "chapter":
      return (
        <span className="flex justify-center items-center h-full w-full bg-purple-50 text-purple-700 border-purple-200 border rounded-full text-sm font-medium">
          Chi đoàn
        </span>
      );

    default:
      return (
        <span className="flex justify-center items-center h-full w-full bg-gray-50 text-gray-700 border-gray-200 border rounded-full text-sm font-medium">
          Không xác định
        </span>
      );
  }
};
import React, { useState, useRef, useEffect } from "react";
import logo from "../../../src/core/assets/images/logo.png";
import defAvatar from "../../../src/core/assets/images/avatar.png";
import { IoNotifications } from "react-icons/io5";

// --- Cấu hình Màu sắc ---
const BG_HEADER_CLASS = "bg-blue-900";        // Nền Header: Xanh Navy
const ICON_HOVER_CLASS = "hover:bg-blue-800"; // Hiệu ứng hover cho icon
const TEXT_PRIMARY_CLASS = "text-white";      // Màu chữ chính trên nền xanh
const ACCENT_COLOR_CLASS = "text-blue-400";   // Màu nhấn nhẹ cho tên/logo

const ME = {
  avatar: defAvatar,
  fullname: "Dang Huu Thang",
};

const NOTIFICATIONS = [
  // ... (Dữ liệu thông báo giữ nguyên)
  {
    id: 1,
    title: "Thông báo hệ thống",
    message: "Hệ thống sẽ bảo trì vào lúc 22:00 tối nay.",
    time: "10 phút trước",
    read: false,
  },
  {
    id: 2,
    title: "Cập nhật mới",
    message: "Phiên bản 2.1 của ứng dụng đã sẵn sàng để tải về.",
    time: "1 giờ trước",
    read: true,
  },
  {
    id: 3,
    title: "Tin nhắn từ admin",
    message: "Vui lòng cập nhật thông tin cá nhân trước cuối tuần.",
    time: "2 giờ trước",
    read: false,
  },
  {
    id: 4,
    title: "Sự kiện sắp tới",
    message: "Chi đoàn sẽ tổ chức buổi sinh hoạt ngoại khóa vào thứ 7.",
    time: "Hôm nay",
    read: true,
  },
  {
    id: 5,
    title: "Nhắc nhở",
    message: "Bạn chưa hoàn tất nhiệm vụ tuần này.",
    time: "Hôm qua",
    read: false,
  },
];

const Logo = () => (
  <div className="flex items-center w-60 h-full gap-2">
    <img src={logo} alt="Logo" className="h-full max-h-10" />
    <div className={`font-medium text-2xl ${TEXT_PRIMARY_CLASS}`}>CHI ĐOÀN SỐ</div>
  </div>
);

// NotificationItem được tinh chỉnh
const NotificationItem = ({ item, onClickItem }) => (
  <li
    onClick={() => onClickItem(item)}
    // Hiệu ứng và màu nền rõ ràng hơn
    className={`px-4 py-3 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors duration-150
      ${item.read ? 'bg-white hover:bg-gray-50' : 'bg-blue-50 hover:bg-blue-100'} 
      flex justify-between items-start gap-2`}
  >
    <div className="w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          {/* Chấm tròn chưa đọc: màu xanh đậm */}
          {!item.read && (
            <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></div>
          )}
          <p className={`font-medium ${item.read ? 'text-gray-700' : 'text-gray-900'} text-sm`}>{item.title}</p>
        </div>
        <span className="text-xs text-gray-400">{item.time}</span>
      </div>
      <p className="text-sm text-gray-500 ml-4 line-clamp-2">{item.message}</p>
    </div>
  </li>
);

function Header() {
  const [user] = useState(ME);
  const [notifications] = useState(NOTIFICATIONS);
  const [openNotification, setOpenNotification] = useState(false);
  const [openUserOptions, setOpenUserOptions] = useState(false);

  // Tính toán số lượng thông báo chưa đọc
  const unreadCount = notifications.filter(n => !n.read).length;

  const notificationRef = useRef(null);
  const userRef = useRef(null);

  // Handlers
  const handleClickNotificationItem = (item) => {
    // Logic đánh dấu đã đọc sẽ được thêm ở đây
    console.log("Clicked notification:", item);
    // setOpenNotification(false); // Giữ cho mở sau khi click để người dùng xem tiếp
  };

  const handleViewProfile = () => {
    console.log("Xem trang cá nhân");
    setOpenUserOptions(false);
  };

  const handleLogOut = () => {
    console.log("Đăng xuất");
    setOpenUserOptions(false);
  };

  // Click outside để đóng menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Đóng Notification
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setOpenNotification(false);
      }
      // Đóng User Options
      if (userRef.current && !userRef.current.contains(event.target)) {
        setOpenUserOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    // Sử dụng màu nền xanh đậm
    <header className={`h-16 w-full relative p-3 flex justify-between ${BG_HEADER_CLASS}`}>
      <Logo />
      
      <div className="flex h-full gap-4 relative z-50 items-center">
        
        {/* === 1. Notification Icon & Dropdown Container === */}
        <div className="relative h-full flex items-center" ref={notificationRef}>
            {/* Notification Icon Button */}
            <button
                onClick={() => setOpenNotification((prev) => !prev)}
                className={`relative p-2 rounded-full ${ICON_HOVER_CLASS} transition-colors duration-200`}
                aria-label="Thông báo"
            >
                <IoNotifications size={30} className={TEXT_PRIMARY_CLASS} />
                {/* Chấm đỏ báo hiệu số lượng chưa đọc */}
                {unreadCount > 0 && (
                    <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 min-w-5 h-5 px-1 flex items-center justify-center bg-red-600 rounded-full text-xs font-bold text-white leading-none">
                        {unreadCount}
                    </div>
                )}
            </button>

            {/* Notification Dropdown */}
            {openNotification && (
                <div
                    // Bố cục Dropdown hiện đại hơn
                    className="absolute top-full mt-3 bg-white right-0 w-80 shadow-xl border border-gray-200 rounded-lg overflow-hidden max-h-[70vh] flex flex-col z-50"
                >
                    <div className={`p-4 font-bold text-lg border-b border-gray-200 ${MAIN_TEXT_COLOR_CLASS}`}>
                        Thông báo mới ({unreadCount})
                    </div>
                    <ul className="overflow-y-auto flex-grow divide-y divide-gray-100">
                        {notifications.length === 0 ? (
                            <p className="p-4 text-gray-500 text-sm">Không có thông báo nào</p>
                        ) : (
                            notifications.map((item) => (
                                <NotificationItem 
                                    key={item.id} 
                                    item={item} 
                                    onClickItem={handleClickNotificationItem}
                                />
                            ))
                        )}
                    </ul>
                    <div className={`p-2 text-center text-sm ${ACCENT_COLOR_CLASS} hover:bg-gray-100 cursor-pointer border-t border-gray-200 font-medium`}>
                        Xem tất cả
                    </div>
                </div>
            )}
        </div>

        {/* --- Divider --- */}
        <div className="h-2/3 w-px bg-blue-700/50"></div>

        {/* === 2. User Info & Options Container === */}
        <div className="relative h-full flex items-center" ref={userRef}>
            <button
                onClick={() => setOpenUserOptions((prev) => !prev)}
                className="flex items-center gap-2 cursor-pointer p-1 rounded-full transition-colors duration-200 hover:bg-blue-800"
            >
                <img
                    src={user.avatar || defAvatar}
                    alt={user.fullname}
                    className="h-12 w-12 rounded-full object-cover border-2 border-blue-400"
                />
                <p className={`hidden md:block ${TEXT_PRIMARY_CLASS} text-md font-medium mr-1`}>
                    {user.fullname || "Người dùng"}
                </p>
            </button>
        
            {/* User Options Dropdown */}
            {openUserOptions && (
                <div
                    // Bố cục Dropdown hiện đại hơn
                    className="absolute top-full mt-3 right-0 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
                >
                    <div className="p-3 text-sm text-center font-semibold text-gray-700 border-b border-gray-100">
                        {user.fullname}
                    </div>
                    <ul>
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm"
                            onClick={handleViewProfile}
                        >
                            Xem trang cá nhân
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600 text-sm border-t border-gray-100"
                            onClick={handleLogOut}
                        >
                            Đăng xuất
                        </li>
                    </ul>
                </div>
            )}
        </div>
      </div>
    </header>
  );
}

export default Header;
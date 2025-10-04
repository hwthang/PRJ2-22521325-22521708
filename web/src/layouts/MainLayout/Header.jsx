import React, { useState, useRef, useEffect } from "react";
import logo from "../../../src/core/assets/images/logo.png";
import defAvatar from "../../../src/core/assets/images/avatar.png";
import { IoNotifications } from "react-icons/io5";

const ME = {
  avatar: defAvatar,
  fullname: "Dang Huu Thang",
};

const NOTIFICATIONS = [
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
    <img src={logo} className="h-full" />
    <div className="text-white font-medium text-2xl">CHI ĐOÀN SỐ</div>
  </div>
);

// NotificationItem trực tiếp trong file
  const NotificationItem = ({ item, onClickItem }) => (
    <li
      onClick={() => onClickItem(item)}
      className="px-4 py-3 border-b border-gray-400 last:border-b-0 cursor-pointer hover:bg-gray-200 flex justify-between items-start gap-2"
    >
      <div className="w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {!item.read && (
              <div className="w-2 h-2 rounded-full bg-blue-900"></div>
            )}
            <p className="font-medium text-gray-800">{item.title}</p>
          </div>
          <span className="text-xs text-gray-400">{item.time}</span>
        </div>
        <p className="text-sm text-gray-600">{item.message}</p>
      </div>
    </li>
  );

function Header() {
  const [user] = useState(ME);
  const [notifications] = useState(NOTIFICATIONS);
  const [openNotification, setOpenNotification] = useState(false);
  const [openUserOptions, setOpenUserOptions] = useState(false);

  const notificationRef = useRef(null);
  const userRef = useRef(null);

  // Handlers
  const handleClickNotificationItem = (item) => {
    console.log("Clicked notification:", item);
    setOpenNotification(false);
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
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setOpenNotification(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setOpenUserOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-full w-full relative p-3 flex justify-between">
      <Logo />
      <div className="flex h-full gap-4 relative z-50">
        {/* Notification Dropdown */}
        {openNotification && (
          <div
            ref={notificationRef}
            className="absolute top-[110%] bg-white right-0 min-w-[250px] w-80 z-10 shadow-[0_0_10px_#c9c9c9] rounded-md overflow-auto h-[50vh]"
          >
            {notifications.length === 0 ? (
              <p className="p-3 text-gray-500">Không có thông báo nào</p>
            ) : (
              <ul>
                {notifications.map((item) => (
                  <NotificationItem key={item.id} item={item} onClickItem={handleClickNotificationItem}/>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* User Options Dropdown */}
        {openUserOptions && (
          <div
            ref={userRef}
            className="absolute top-[110%] right-0 min-w-[180px] w-48 bg-white rounded-md shadow-[0_0_10px_#c9c9c9] z-10 overflow-hidden"
          >
            <ul>
              <li
                className="px-4 py-3 hover:bg-gray-200 cursor-pointer"
                onClick={handleViewProfile}
              >
                Xem trang cá nhân
              </li>
              <li
                className="px-4 py-3 hover:bg-gray-200 cursor-pointer"
                onClick={handleLogOut}
              >
                Đăng xuất
              </li>
            </ul>
          </div>
        )}

        {/* Notification Icon */}
        <div
          onClick={() => setOpenNotification((prev) => !prev)}
          className="relative hover:bg-blue-600 cursor-pointer flex items-center gap-2 h-full aspect-square justify-center rounded-full bg-blue-800 "
        >
          <IoNotifications size={30} className="text-white" />
          <div className="w-4 h-4 top-0 right-0 absolute bg-red-600 rounded-full"></div>
        </div>

        {/* User Info */}
        <div
          onClick={() => setOpenUserOptions((prev) => !prev)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            src={user.avatar || defAvatar}
            className="h-full rounded-full border-2 border-blue-600"
          />
          <p className="hidden md:block text-white text-lg text-blue-100">
            {user.fullname || "Người dùng"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Header;

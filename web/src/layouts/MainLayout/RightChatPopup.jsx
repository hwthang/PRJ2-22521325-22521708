import React, { useState } from "react";
import ChatPopup from "../../features/chat/components/ChatPopup";
import { IoIosCloseCircle } from "react-icons/io";
import { FaFacebookMessenger } from "react-icons/fa6";

const CHAT_LIST = [
  {
    id: 1,
    fullname: "Nguyễn Văn A",
    avatar: "https://i.pravatar.cc/150?img=1",
    status: "online",
    lastMessage: "Chào bạn, hôm nay có họp không?",
    lastSender: "Nguyễn Văn A",
    isRead: false,
    lastTime: "09:15",
  },
  {
    id: 2,
    fullname: "Trần Thị B",
    avatar: "https://i.pravatar.cc/150?img=2",
    status: "offline",
    lastMessage: "Mình sẽ gửi báo cáo vào mai.",
    lastSender: "Trần Thị B",
    isRead: true,
    lastTime: "Hôm qua 18:20",
  },
  {
    id: 3,
    fullname: "Lê Văn C",
    avatar: "https://i.pravatar.cc/150?img=3",
    status: "online",
    lastMessage: "Đã nhận được file, cảm ơn!",
    lastSender: "me",
    isRead: true,
    lastTime: "08:45",
  },
  {
    id: 4,
    fullname: "Phạm Thị D",
    avatar: "https://i.pravatar.cc/150?img=4",
    status: "offline",
    lastMessage: "Chúng ta gặp lại vào tuần sau nhé.",
    lastSender: "Phạm Thị D",
    isRead: false,
    lastTime: "Hôm qua 15:30",
  },
  {
    id: 5,
    fullname: "Hoàng Văn E",
    avatar: "https://i.pravatar.cc/150?img=5",
    status: "online",
    lastMessage: "Đã hoàn thành nhiệm vụ tuần này.",
    lastSender: "me",
    isRead: true,
    lastTime: "07:50",
  },
  {
    id: 6,
    fullname: "Đặng Thị F",
    avatar: "https://i.pravatar.cc/150?img=6",
    status: "offline",
    lastMessage: "Xin lỗi, mình bận một chút.",
    lastSender: "Đặng Thị F",
    isRead: false,
    lastTime: "Hôm qua 12:10",
  },
  {
    id: 7,
    fullname: "Ngô Văn G",
    avatar: "https://i.pravatar.cc/150?img=7",
    status: "online",
    lastMessage: "Sẵn sàng cho buổi họp lúc 14h.",
    lastSender: "Ngô Văn G",
    isRead: false,
    lastTime: "09:00",
  },
  {
    id: 8,
    fullname: "Bùi Thị H",
    avatar: "https://i.pravatar.cc/150?img=8",
    status: "offline",
    lastMessage: "Mình sẽ tham gia vào ngày mai.",
    lastSender: "me",
    isRead: true,
    lastTime: "Hôm qua 16:45",
  },
  {
    id: 9,
    fullname: "Vũ Văn I",
    avatar: "https://i.pravatar.cc/150?img=9",
    status: "online",
    lastMessage: "Cảm ơn bạn đã hỗ trợ!",
    lastSender: "Vũ Văn I",
    isRead: true,
    lastTime: "08:30",
  },
  {
    id: 10,
    fullname: "Trịnh Thị J",
    avatar: "https://i.pravatar.cc/150?img=10",
    status: "offline",
    lastMessage: "Hẹn gặp lại lần sau.",
    lastSender: "Trịnh Thị J",
    isRead: false,
    lastTime: "Hôm qua 19:00",
  },
];

function RightChatPopup() {
  const [openPopup, setOpenPopup] = useState(false);
  const [chatList, setChatList] = useState(
    CHAT_LIST.sort(
      (a, b) =>
        (a.status === "online" ? 0 : 1) - (b.status === "online" ? 0 : 1)
    )
  );

  const handleOpenPopup = () => {
    setOpenPopup((prev) => !prev);
  };
  return (
    <div className="w-full h-full relative">
      <div className="absolute bottom-0 right-0 pr-2 flex items-end gap-2">
        {/* Popup chat */}
        {openPopup && (
          <div className="flex flex-col bg-white rounded-lg shadow-[0_0_10px_#c9c9c9]">
            <div className="h-12 flex items-center justify-between px-1 py-2">
              <p>Đoạn chat</p>
              <IoIosCloseCircle
                size={40}
                className="text-red-600 cursor-pointer hover:text-red-400"
                onClick={() => setOpenPopup(false)}
              />
            </div>
            <ChatPopup data={chatList} />
          </div>
        )}

        <div
          onClick={handleOpenPopup}
          className="mb-10 relative w-13 h-13 rounded-full bg-blue-900 hover:bg-blue-600 cursor-pointer flex items-center justify-center"
        >
          <FaFacebookMessenger size={30} className="text-white" />
          <div className="w-4 h-4 bg-red-600 rounded-full absolute top-0 right-0"></div>
        </div>
      </div>
    </div>
  );
}

export default RightChatPopup;

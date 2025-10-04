import React, { useState, useEffect, useRef } from "react";
import defAvatar from "../../../core/assets/images/avatar.png";
import { IoSend } from "react-icons/io5";
import { MdOutlineAttachFile } from "react-icons/md";

const CHATS = [
  {
    id: 1,
    from: "Nguyễn Văn A",
    message: "Chào bạn, hôm nay có họp không?",
    time: "09:15",
  },
  {
    id: 2,
    from: "me",
    message: "Có nhé, 14h chiều mình sẽ mở phòng.",
    time: "09:17",
  },
];

function ChatBox({ data }) {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState(CHATS);
  const chatContentRef = useRef(null);

  // Auto scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [chats]);

  // Gửi tin nhắn text
  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: chats.length + 1,
      from: "me",
      message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChats([...chats, newMessage]);
    setMessage("");
  };

  // Gửi ảnh từ file đính kèm
  const handleAttachFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Chỉ được phép chọn tệp hình ảnh!");
      e.target.value = ""; // reset
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    const newMessage = {
      id: chats.length + 1,
      from: "me",
      image: imageUrl,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChats([...chats, newMessage]);

    // reset input sau khi gửi
    e.target.value = "";
  };

  // ✅ Khi chưa chọn user thì ẩn chatbox
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <p>Hãy chọn một cuộc trò chuyện để bắt đầu</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between h-full p-2 gap-2">
      {/* Header */}
      <div className="flex gap-2 items-center">
        <div className="relative">
          <img
            src={data?.avatar || defAvatar}
            className="min-h-10 min-w-10 h-10 w-10 object-cover rounded-full"
            alt="avatar"
          />
          {data?.status === "online" && (
            <div className="absolute w-2 h-2 bg-green-500 rounded-full bottom-0 right-0"></div>
          )}
        </div>
        <div className="font-medium">{data?.fullname}</div>
      </div>

      {/* Chat content */}
      <div
        ref={chatContentRef}
        className="flex-1 bg-gray-100 rounded-lg p-3 overflow-y-auto"
      >
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex mb-2 ${
              chat.from === "me" ? "justify-end" : "justify-start"
            }`}
          >
            {chat.from !== "me" && (
              <img
                src={data?.avatar || defAvatar}
                alt="avatar"
                className="w-6 h-6 rounded-full mr-2 self-end"
              />
            )}

            {/* Nếu là ảnh thì hiện trực tiếp, không bọc bubble */}
            {chat.image ? (
              <div className="flex flex-col items-end">
                <img
                  src={chat.image}
                  alt="chat-img"
                  className="rounded-lg max-w-[200px] max-h-[200px] object-cover"
                  onLoad={() => {
                    if (chatContentRef.current) {
                      chatContentRef.current.scrollTop =
                        chatContentRef.current.scrollHeight;
                    }
                  }}
                />
                <div className="text-xs text-gray-400 mt-1 text-right">
                  {chat.time}
                </div>
              </div>
            ) : (
              <div
                className={`max-w-xs px-3 py-2 rounded-2xl text-sm shadow ${
                  chat.from === "me"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                <div>{chat.message}</div>
                <div className="text-xs text-gray-300 mt-1 text-right">
                  {chat.time}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="h-12 bg-white rounded-lg flex items-center px-1 gap-1">
        {/* Attach file */}
        <label className="flex items-center justify-center w-10 h-10 rounded-full text-blue-900 cursor-pointer active:opacity-50 active:bg-gray-100">
          <MdOutlineAttachFile size={22} />
          <input
            type="file"
            accept="image/*"
            
            className="hidden"
            onChange={handleAttachFile}
          />
        </label>

        {/* Input message */}
        <div className="flex-1 flex items-center">
          <input
            className="border-2 w-full outline-none py-1 px-2 rounded-lg border-gray-300 focus:border-blue-400"
            placeholder="Nhập tin nhắn"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
        </div>

        {/* Send button */}
        <div
          className="flex items-center justify-center w-10 h-10 rounded-full text-blue-900 cursor-pointer active:opacity-50 active:bg-gray-100"
          onClick={handleSendMessage}
        >
          <IoSend size={22} />
        </div>
      </div>
    </div>
  );
}

export default ChatBox;

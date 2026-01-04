import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import DefaultAvatar from "../../../core/assets/images/avatar.png";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { formatRelativeTime } from "../../../utils/date";
import { defAvatar } from "../../../core/assets/images";

const ChatSidebar = ({ chatList, onSelectChat, myAccountId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  const activeChatId = searchParams.get("conversationId");

  // Logic helper để hiển thị nội dung tin nhắn cuối cùng
  const renderLastMessageContent = (lastMessage) => {
    if (!lastMessage) return "Bắt đầu trò chuyện...";

    // Nếu có media (tệp, ảnh, video)
    if (lastMessage.media) {
      const type = lastMessage.media.type;
      if (type === "image") return "📷 Đã gửi một ảnh";
      if (type === "video") return "🎥 Đã gửi một video";
      return "📁 Đã gửi một tệp";
    }

    // Nếu là tin nhắn văn bản bình thường
    return lastMessage.message || "Bắt đầu trò chuyện...";
  };

  const filteredChats = useMemo(() => {
    return chatList
      .map((chat) => {
        const other = chat.members?.find((m) => (m._id || m) !== myAccountId);
        return {
          ...chat,
          displayName:
            chat.name || other?.displayName || other?.fullname || "Người dùng",
          displayAvatar:
            chat?.members?.length > 2
              ? defAvatar
              : other?.avatar?.url || defAvatar,
        };
      })
      .filter((c) =>
        c.displayName.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [chatList, myAccountId, searchTerm]);

  return (
    <aside className="w-full md:w-[380px] bg-white border-r border-slate-200 flex flex-col h-full shadow-sm">
      <div className="p-5 space-y-4">
        <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
          Tin nhắn
        </h1>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:bg-white focus:border-blue-200 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {filteredChats.map((chat) => {
          const isActive = activeChatId === chat._id;
          const isUnread =
            chat.lastMessage &&
            (chat.lastMessage.senderId?._id || chat.lastMessage.senderId) !==
              myAccountId &&
            !chat.lastMessage.seenBy?.includes(myAccountId);

          return (
            <div
              key={chat._id}
              onClick={() => onSelectChat(chat._id)}
              className={`flex items-center gap-4 p-3.5 rounded-2xl cursor-pointer transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "hover:bg-slate-50"
              }`}
            >
              <div className="relative flex-shrink-0">
                <div
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 ${
                    isActive ? "border-blue-400" : "border-white"
                  }`}
                >
                  <img
                    src={chat?.displayAvatar || defAvatar}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3
                    className={`text-[14px] truncate ${
                      isActive
                        ? "text-white font-bold"
                        : isUnread
                        ? "text-slate-900 font-black"
                        : "text-slate-700 font-semibold"
                    }`}
                  >
                    {chat.displayName}
                  </h3>
                  <span
                    className={`text-[10px] ${
                      isActive ? "text-blue-100" : "text-slate-400"
                    }`}
                  >
                    {chat.updatedAt && formatRelativeTime(chat.updatedAt)}
                  </span>
                </div>
                <p
                  className={`text-[12px] truncate ${
                    isActive
                      ? "text-blue-50"
                      : isUnread
                      ? "text-slate-900 font-bold"
                      : "text-slate-400"
                  }`}
                >
                  {/* Sử dụng hàm helper ở đây */}
                  {renderLastMessageContent(chat.lastMessage)}
                </p>
              </div>
              {isUnread && !isActive && (
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white shadow-sm"></div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default ChatSidebar;
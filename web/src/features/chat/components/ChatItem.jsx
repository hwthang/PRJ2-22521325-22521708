import React from "react";
import defAvatar from "../../../core/assets/images/avatar.png";

function ChatItem({ data }) {
  const prefix =
    data?.lastSender === "me"
      ? "Bạn: "
      : data?.lastSender
      ? ""
      : "";

  return (
    <div className="hover:bg-blue-100 rounded-lg flex items-center cursor-pointer gap-2 p-2">
      {/* Avatar + online indicator */}
      <div className="relative flex-shrink-0">
        <img
          src={data?.avatar || defAvatar}
          className="min-h-10 min-w-10 h-10 w-10 object-cover rounded-full"
          alt="avatar"
        />
        {data?.status === "online" && (
          <div className="absolute w-2 h-2 bg-green-500 rounded-full bottom-0 right-0 border border-white"></div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center">
          <div className="font-medium truncate">{data?.fullname}</div>
          <div className="text-xs text-gray-500 ml-2 whitespace-nowrap">
            {data?.lastTime}
          </div>
        </div>
        <div
          className={`text-sm truncate ${
            data?.isRead === false ? "font-semibold text-black" : "text-gray-500"
          }`}
        >
          {prefix}
          {data?.lastMessage}
        </div>
      </div>

      {/* Unread indicator */}
      {data?.isRead === false && (
        <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
      )}
    </div>
  );
}

export default ChatItem;

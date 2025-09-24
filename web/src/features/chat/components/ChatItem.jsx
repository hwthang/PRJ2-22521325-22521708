import React from "react";
import avatar from "../../../core/assets/images/avatar.png";

function ChatItem({ lastedMessage }) {
  return (
    <div className="hover:bg-blue-100 h-full flex items-center cursor-pointer gap-2 p-2">
      <div className="relative">
        <img
          src={avatar}
          className="min-h-10 min-w-10 h-10 w-10 object-fit rounded-full"
        />
        <div className="absolute w-2 h-2 bg-green-500 rounded-full bottom-0 right-0"></div>
      </div>

      <div className="flex flex-col">
        <div className="font-medium">Đặng Hữu Thắng</div>
        <div className="text-sm">{lastedMessage}</div>
      </div>
    </div>
  );
}

export default ChatItem;

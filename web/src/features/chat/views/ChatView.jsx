import React from "react";
import ChatList from "../components/ChatList";
import ChatPopup from "../components/ChatPopup";
import BasicInput from "../../../core/components/Input/BasicInput";
import { IoIosSearch } from "react-icons/io";

function ChatView() {
  return (
    <div className="relative h-full">
      <div className=" p-3 shadow-[0_0_5px_#fffff]">
        <div className="flex gap-2 justify-center items-center ring ring-gray-400 rounded-lg p-2">
          <IoIosSearch size={28} className="text-blue-900" />
          <BasicInput placeholder={"Nhập tên người dùng"} className={"px-0"} />
        </div>
      </div>
      <div className="h-full">
        <ChatList />
      </div>
    </div>
  );
}

export default ChatView;

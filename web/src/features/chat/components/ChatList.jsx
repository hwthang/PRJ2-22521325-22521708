import React, { useState } from "react";
import ChatItem from "./ChatItem";
import ChatPopup from "./ChatPopup";
import { FaFacebookMessenger } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";

function ChatList() {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedChat, setSelectedChat] = useState({});
  const users = Array(100).fill(1);
  const handleClickItem = (item) => {
    selectedChat(item);
  };
  return (
    <div className="relative h-full">
      <div className="flex flex-col overflow-auto hide-scrollbar h-full pb-20">
        {users.map((item, i) => (
          <div key={i} onClick={() => setShowPopup(true)}>
            <ChatItem />
          </div>
        ))}
        <div className="h-100 absolute bottom-16 right-0 pr-2 flex items-end gap-2">
          {showPopup && (
            <div className="flex flex-col bg-white rounded-lg shadow-[0_0_10px_#c9c9c9]">
              <div className="h-12 flex items-center justify-between px-1 py-2">
                <div>ĐOẠN CHAT</div>
                <IoIosCloseCircle
                  size={40}
                  className="text-red-600 cursor-pointer hover:text-red-400"
                  onClick={() => setShowPopup(false)}
                />
              </div>
              <ChatPopup />
            </div>
          )}
          <div
            onClick={() => setShowPopup((prev) => !prev)}
            className="mb-10 relative w-13 h-13 rounded-full bg-blue-900 hover:bg-blue-600 cursor-pointer flex items-center justify-center"
          >
            <FaFacebookMessenger size={30} className="text-white" />
            <div className="w-4 h-4 bg-red-600 rounded-full absolute top-0 right-0"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatList;

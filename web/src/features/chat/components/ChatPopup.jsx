import React from "react";
import ChatItem from "./ChatItem";
import ChatBox from "./ChatBox";

function ChatPopup() {
  const chats = Array(10).fill({
    name: "Đặng Hữu Thắng",
    lastedMessage: "Hello bà thơ",
  });
  return (
    <div className="w-200 h-140  p-2 pb-4 flex gap-2 bg-gray-100">
      <div className=" flex-1 overflow-auto hide-scrollbar bg-white p-1 rounded-lg">
        {chats.map((item, i) => (
          <div key={i} className="">
            <ChatItem lastedMessage={"hello bà thờ"} />
          </div>
        ))}
      </div>
      <div className=" flex-2 flex flex-col bg-white rounded-lg">
       <ChatBox/>
      </div>
    </div>
  );
}

export default ChatPopup;

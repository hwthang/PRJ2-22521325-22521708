import React, { useState } from "react";
import ChatItem from "./ChatItem";
import ChatBox from "./ChatBox";

function ChatPopup({ data }) {
  const [search, setSearch] = useState("");          // state ô tìm kiếm
  const [selectedChat, setSelectedChat] = useState(null); // cuộc trò chuyện đang chọn
  const [chatList, setChatList] = useState(data);    // danh sách chat hiển thị

  // Xử lý tìm kiếm theo tên
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setChatList(
      data.filter((item) =>
        item.fullname.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
    if (e.target.value.length === 0) setChatList(data); // reset khi xoá hết
  };

  const handleClickItem = (item) => {
    setSelectedChat(item);

    console.log("Đã chọn cuộc trò chuyện:", item.fullname);
  };
  return (
    <div className="w-200 h-100 p-2 pb-4 flex gap-2 bg-gray-100">
      {/* Sidebar danh sách chat */}
      <div className="flex-1 overflow-auto hide-scrollbar bg-white p-1 rounded-lg">
        {/* Ô tìm kiếm */}
        <div className="p-2 shadow-[0_0_5px_#fffff]">
          <div className="flex gap-2 justify-center items-center ring ring-gray-400 rounded-lg p-2">
            <input
              className="outline-none w-full"
              placeholder="Tìm kiếm"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Danh sách các ChatItem */}
        {chatList.map((item, i) => (
          <div key={i} onClick={() => handleClickItem(item)}>
            <ChatItem data={item} />
          </div>
        ))}
      </div>

      {/* Khu vực hiển thị ChatBox */}
      <div className="flex-2 flex flex-col bg-white rounded-lg">
        <ChatBox data={selectedChat} />
      </div>
    </div>
  );
}

export default ChatPopup;

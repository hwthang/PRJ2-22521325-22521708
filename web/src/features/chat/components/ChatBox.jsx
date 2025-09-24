import React from "react";
import avatar from "../../../core/assets/images/avatar.png";
import BasicInput from "../../../core/components/Input/BasicInput";
import { IoSend } from "react-icons/io5";
import { MdOutlineAttachFile } from "react-icons/md";

function ChatBox() {
  return (
    <div className="flex flex-col justify-between items-between h-full p-2 gap-2">
      <div className="flex gap-2 flex items-center">
        <div className="relative">
          <img
            src={avatar}
            className="min-h-10 min-w-10 h-10 w-10 object-fit rounded-full"
          />
          <div className="absolute w-2 h-2 bg-green-500 rounded-full bottom-0 right-0"></div>
        </div>
        <div className="font-medium">Đặng Hữu Thắng</div>
      </div>
      <div className="flex-1 bg-gray-100 rounded-lg ">Khung chat</div>
      <div className="h-12 bg-white rounded-lg flex">
        <div className=" h-full">
          <div className="h-full flex items-center justify-center aspect-square rounded-full text-blue-900 active:opacity-50 active:bg-gray-100">
            <MdOutlineAttachFile size={24} className="" />
          </div>
        </div>
        <div className="h-full py-1 flex-2 flex items-center justify-center pr-1">
          <BasicInput className={"h-full px-3 border rounded-full"} />
          <div className="h-full flex items-center justify-center aspect-square rounded-full text-blue-900 active:opacity-50 active:bg-gray-100">
            <IoSend size={24} className="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;

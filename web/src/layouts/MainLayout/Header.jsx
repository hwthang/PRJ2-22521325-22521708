import React from "react";
import logo from "../../../src/core/assets/images/logo.png";
import avatar from "../../../src/core/assets/images/avatar.png";
import { Link } from "react-router-dom";
import { IoNotifications } from "react-icons/io5";


function Header() {
  return (
    <div className="min-h-20 md:max-h-20 relative z-20 bg-blue-950 flex justify-between items-center gap-4 md:gap-10 flex-col md:flex-row py-2">
      <div className="flex items-center w-60 justify-center items-center">
        <div className="min-w-20 w-20 h-20 p-3">
          <img src={logo} />
        </div>
        <div className="text-3xl md:text-2xl whitespace-nowrap text-white font-bold flex justify-center items-center h-full w-full">
          CHI ĐOÀN SỐ
        </div>
      </div>
      <div className=" flex-1 flex justify-start items-center w-full">
        <div className="bg-blue-100 px-4 h-12 w-full rounded-full">
          <input
            className="outline-none h-full w-full"
            placeholder="Tìm kiếm"
          />
        </div>
      </div>
      <div className="flex-1 h-13 border flex justify-end px-4 w-full gap-4">
        <Link to={"notifications"} className="relative hover:bg-blue-600 relative cursor-pointer flex items-center gap-2 h-13 w-13 justify-center rounded-full bg-blue-800 ">
          <IoNotifications size={30} className="text-white" />
          <div className="w-4 h-4 top-0 right-0 absolute bg-red-600 rounded-full"></div>
        </Link>
        <Link
          className="group relative cursor-pointer flex items-center gap-2 "
          to={"profile"}
        >
          <img
            src={avatar}
            className="group-hover:border-blue-400 w-13 h-13 rounded-full border-2 border-blue-200 object-fit "
          />
          <p className="group-hover:text-blue-200 text-white font-medium">
            Đặng Hữu Thắng
          </p>
        </Link>
      </div>
    </div>
  );
}

export default Header;

import React from "react";
import { Outlet } from "react-router-dom";
import { BiSolidDashboard } from "react-icons/bi";
import LeftNavigation from "./LeftNavigation";
import RightChatList from "./RightChatList";
import Header from "./Header";

function MainLayout({children}) {
  return (
    <div className=" relative z-0 border-box flex flex-col h-screen w-screen overflow-auto">
      <Header />
      <div className="flex-1 flex h-full overflow-hidden">
        <LeftNavigation/>
        <div className="flex-1 overflow-auto bg-gray-100">
          <Outlet/>
        </div>
        <RightChatList/>
      </div>
    </div>
  );
}

export default MainLayout;

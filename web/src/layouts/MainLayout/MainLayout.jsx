import React from "react";
import { Outlet } from "react-router-dom";
import { BiSolidDashboard } from "react-icons/bi";
import LeftNavigation from "./LeftNavigation";
import RightChatPopup from "./RightChatPopup";
import Header from "./Header";

function MainLayout() {
  return (
    <div className="relative flex flex-col h-screen w-screen text-blue-900">
      <div className="h-[10vh] w-full bg-blue-950">
        <Header />
      </div>
      <div className="relative flex h-[90vh] max-w-[100vw] overflow-auto">
        <div className="w-fit">
          <LeftNavigation />
        </div>
        <div className="h-full w-full bg-gray-200 overflow-auto" >
          <Outlet/>
        </div>
       
      
      </div>
    </div>
  );
}

export default MainLayout;

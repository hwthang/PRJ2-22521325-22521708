import React, { useEffect, useState } from "react";
import {
  Home,
  Users,
  UserCheck,
  Calendar,
  Zap,
  FileText,
  ClipboardList,
  BarChart2,
  MessageCircle,
  LogOut,
  BotMessageSquare, // Import icon đăng xuất
} from "lucide-react";

import NavItem from "../../core/components/Navigation/NavItem";
import customCache from "../../utils/customCache";
import { useNavigate } from "react-router-dom"; // Giả sử bạn dùng react-router

function LeftNavigation() {
  const [role, setRole] = useState();
  const navigate = useNavigate();
  
  useEffect(() => {
    setRole(customCache.myAccount?.get().type);
  }, []);

  const handleLogout = () => {
    // Xử lý logic đăng xuất tại đây
    localStorage.removeItem("my_account");
    customCache.myAccount?.clear(); 
    navigate("/");
  };

  const ICON_SIZE = 20; // Giảm nhẹ size để khớp với text-sm

  return (
    <div
      className="w-60 flex h-full flex-col justify-between border-r border-blue-50 bg-white py-8 text-sm text-slate-600 transition-all duration-500 ease-in-out"
    >
      {/* PHẦN TRÊN: DANH SÁCH MENU */}
      <div className="flex flex-col gap-1 px-3 overflow-y-auto hide-scrollbar">
        <NavItem
          label={"Trang chủ"}
          icon={<Home size={ICON_SIZE} />}
          path={`${role}/dashboard`}
        />

        <NavItem
          role={["admin"]}
          label={"Cơ sở đoàn"}
          icon={<Users size={ICON_SIZE} />}
          path={`${role}/chapters`}
        />

        <NavItem
          role={["admin", "chapter"]}
          label={"Đoàn viên"}
          icon={<UserCheck size={ICON_SIZE} />}
          path={`${role}/members`}
        />

        <NavItem
          label={"Sự kiện"}
          icon={<Calendar size={ICON_SIZE} />}
          path={`${role}/events`}
        />

        <NavItem
          role={["member"]}
          label={"Tham gia"}
          icon={<Zap size={ICON_SIZE} />}
          path={`${role}/registrations`}
        />

        <NavItem
          label={"Tài liệu"}
          icon={<FileText size={ICON_SIZE} />}
          path={`${role}/documents`}
        />

        <NavItem
          label={"Khảo sát"}
          icon={<ClipboardList size={ICON_SIZE} />}
          path={`${role}/surveys`}
        />

        {/* <NavItem
          role={["chapter"]}
          label={"Báo cáo, thống kê"}
          icon={<BarChart2 size={ICON_SIZE} />}
          path={`${role}/statistics`}
        /> */}

        <NavItem
          role={["chapter", "member", "admin"]}
          label={"Trò chuyện"}
          icon={<MessageCircle size={ICON_SIZE} />}
          path={`${role}/chat`}
        />

        <NavItem
          role={["chapter", "member", "admin"]}
          label={"Chatbot"}
          icon={<BotMessageSquare size={ICON_SIZE} />}
          path={`${role}/chatbot`}
        />
      </div>

      {/* PHẦN DƯỚI: ĐĂNG XUẤT */}
      <div className="px-3 pt-4 border-t border-slate-50">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
        >
          <LogOut size={ICON_SIZE} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold uppercase tracking-wider text-[11px]">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}

export default LeftNavigation;
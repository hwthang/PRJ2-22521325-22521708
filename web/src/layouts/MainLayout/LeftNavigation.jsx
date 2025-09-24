import React, { useEffect, useRef, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { RiBubbleChartFill, RiSurveyFill } from "react-icons/ri";
import NavItem from "../../core/components/Navigation/NavItem";
import { FaUserGroup } from "react-icons/fa6";
import { RiUserCommunityFill } from "react-icons/ri";
import { BsCalendar2EventFill } from "react-icons/bs";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { SiGoogleforms } from "react-icons/si";
import { BsFillBarChartFill } from "react-icons/bs";

function LeftNavigation() {
  const [showNav, setShowNav] = useState(false);
  const role = "admin";
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Nếu click bên ngoài dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNav(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // cleanup khi component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div
      onClick={() => setShowNav(true)}
      ref={dropdownRef}
      className={`${
        showNav ? "w-60" : "w-16 "
      } flex flex-col justify-start relative border-r-1 hide-scrollbar py-10 text-blue-900 overflow-auto transition-all duration-500 ease-in-out`}
    >
      {/* <div
        onClick={() => setShowNav((prev) => !prev)}
        className={`absolute top-5 -right-5 bg-white rounded-full border-2 aspect-square flex justify-center items-center h-10 w-10 cursor-pointer hover:text-blue-600`}
      >
        <FiMenu size={24} />
      </div> */}
      <NavItem
        label={"Trang chủ"}
        icon={<RiBubbleChartFill size={24} />}
        path={`dashboard`}
      />

      <NavItem
        label={"Người dùng"}
        icon={<FaUserGroup size={24} />}
        path={`accounts`}
      />

      <NavItem
        label={"Cơ sở đoàn"}
        icon={<RiUserCommunityFill size={30} />}
        path={`chapters`}
      />
      <NavItem
        label={"Sự kiện"}
        icon={<BsCalendar2EventFill size={24} />}
        path={`events`}
      />
      <NavItem
        label={"Tài liệu"}
        icon={<HiClipboardDocumentList size={30} />}
        path={`documents`}
      />
      <NavItem
        label={"Khảo sát"}
        icon={<SiGoogleforms size={24} />}
        path={`surveys`}
      />
      <NavItem
        label={"Báo cáo, thống kê"}
        icon={<BsFillBarChartFill size={24} />}
        path={`statistics`}
      />
    </div>
  );
}

export default LeftNavigation;

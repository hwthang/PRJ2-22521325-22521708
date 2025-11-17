import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
// Import các icon tương đương từ lucide-react
import { 
  Home, // Trang chủ (RiBubbleChartFill)
  Users, // Cơ sở đoàn (RiUserCommunityFill)
  UserCheck, // Đoàn viên (FaUserGraduate)
  Calendar, // Sự kiện (BsCalendar2EventFill)
  Zap, // Tham gia (MdLocalFireDepartment)
  FileText, // Tài liệu (HiClipboardDocumentList)
  ClipboardList, // Khảo sát (SiGoogleforms hoặc RiSurveyFill)
  BarChart2, // Báo cáo, thống kê (BsFillBarChartFill)
  Settings, // Cài đặt (IoMdSettings)
  Menu, // Menu toggle (FiMenu)
} from "lucide-react"; 

import NavItem from "../../core/components/Navigation/NavItem"; // Giả định NavItem sử dụng icon component
import permission from "../../utils/permission"; // Giữ nguyên
import { useAccess } from "../../core/context/AccessContext"; // Giữ nguyên
// Import nếu bạn cần icon Tài khoản bị comment
// import { UserCog } from 'lucide-react'; 

function LeftNavigation() {
  const [showNav, setShowNav] = useState(false);
  const dropdownRef = useRef(null);
  const accessData = useAccess();
  const { user } = accessData;


  useEffect(() => {
    console.log(user)
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
  
  // Icon Size: Lucide icons được định nghĩa bằng className w/h, 
  // nhưng nếu NavItem nhận component, ta có thể truyền size mặc định (ví dụ: 24)
  const ICON_SIZE = 24; 

  return (
    <div
      // Thay vì onClick mở nav, thường chúng ta sẽ có một nút toggle riêng
      // Tuy nhiên, giữ nguyên logic click vào sidebar sẽ mở rộng
      onClick={() => setShowNav(true)} 
      ref={dropdownRef}
      className={`${
        showNav ? "w-60" : "w-16 "
      } gap-2 flex h-full flex-col justify-start relative border-r border-gray-200 hide-scrollbar py-10 text-gray-700 overflow-auto transition-all duration-500 ease-in-out`}
    >
      {/* Nút Toggle (Thêm vào đây nếu bạn muốn có nút toggle) */}
      {/* <button 
          onClick={(e) => {e.stopPropagation(); setShowNav(!showNav)}}
          className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100"
      >
        <Menu size={24} /> 
      </button> */}


      <NavItem
        label={"Trang chủ"}
        icon={<Home size={ICON_SIZE} />} // Home (thay RiBubbleChartFill)
        path={`dashboard`}
      />

      {/* {permission.hasPermission(user.role, "view_accounts") && (
        <NavItem
          label={"Tài khoản"}
          icon={<UserCog size={ICON_SIZE} />} // UserCog (thay FaUserGroup)
          path={`accounts`}
        />
      )} */}

      <NavItem
        label={"Cơ sở đoàn"}
        icon={<Users size={ICON_SIZE} />} // Users (thay RiUserCommunityFill)
        path={`chapters`}
      />

      <NavItem
        label={"Đoàn viên"}
        icon={<UserCheck size={ICON_SIZE} />} // UserCheck (thay FaUserGraduate)
        path={`members`}
      />
      
      <NavItem
        label={"Sự kiện"}
        icon={<Calendar size={ICON_SIZE} />} // Calendar (thay BsCalendar2EventFill)
        path={`events`}
      />
      
      <NavItem
        label={"Tham gia"}
        icon={<Zap size={ICON_SIZE} />} // Zap (thay MdLocalFireDepartment)
        path={`registration`}
      />
      
      <NavItem
        label={"Tài liệu"}
        icon={<FileText size={ICON_SIZE} />} // FileText (thay HiClipboardDocumentList)
        path={`documents`}
      />
      
      <NavItem
        label={"Khảo sát"}
        icon={<ClipboardList size={ICON_SIZE} />} // ClipboardList (thay SiGoogleforms)
        path={`surveys`}
      />
      
      <NavItem
        label={"Báo cáo, thống kê"}
        icon={<BarChart2 size={ICON_SIZE} />} // BarChart2 (thay BsFillBarChartFill)
        path={`statistics`}
      />
      
      <NavItem
        label={"Cài đặt"}
        icon={<Settings size={ICON_SIZE} />} // Settings (thay IoMdSettings)
        path={`settings`}
      />
    </div>
  );
}

export default LeftNavigation;
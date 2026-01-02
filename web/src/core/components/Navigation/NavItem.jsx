import React from "react";
import { NavLink } from "react-router-dom";
import customCache from "../../../utils/customCache";


function NavItem({ label, icon, path, role, ...props }) {
  const ACCENT_COLOR_HEX = '#2563EB';
  const MAIN_TEXT_COLOR_HEX = '#1E3A8A';

  // Lấy role hiện tại của user
  const myRole = customCache?.myAccount?.get()?.type;

  // Nếu NavItem yêu cầu role nhưng user không có → ẩn item
  if (role?.length > 0 && !role.includes(myRole)) return null;

  return (
    <NavLink to={path} {...props}>
      {({ isActive }) => (
        <div
          className={`
            w-full min-h-12 flex items-center text-sm transition-colors duration-150
            ${
              isActive
                ? `bg-blue-50 text-blue-600 font-semibold border-blue-600`
                : `text-blue-900 hover:bg-gray-100`
            }
          `}
        >
          {/* Icon */}
          <div className="min-w-16 w-16 h-12 flex justify-center items-center">
            {React.cloneElement(icon, {
              color: isActive ? ACCENT_COLOR_HEX : MAIN_TEXT_COLOR_HEX,
              size: 24,
              className: "transition-colors duration-150",
            })}
          </div>

          {/* Label */}
          <div className="w-full flex items-center pr-4 text-nowrap font-semibold">
            {label}
          </div>
        </div>
      )}
    </NavLink>
  );
}

export default NavItem;

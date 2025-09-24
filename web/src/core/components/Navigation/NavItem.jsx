import React from "react";
import { BiSolidDashboard } from "react-icons/bi";
import { NavLink } from "react-router-dom";

function NavItem({ label, icon, path, ...props }) {
  return (
    <NavLink
      to={path}
      className={({isActive})=>`w-full min-h-12 flex overflow-hidden  ${isActive ? 'bg-blue-600 text-white font-medium':'bg-white text-blue-900 hover:bg-blue-100'}`}
    {...props}
    >
      <div className="min-w-16 w-16 h-12 flex justify-center items-center">
        {icon}
      </div>
      <div className="w-full text-nowrap flex items-center">
        {label}
      </div>
    </NavLink>
  );
}

export default NavItem;

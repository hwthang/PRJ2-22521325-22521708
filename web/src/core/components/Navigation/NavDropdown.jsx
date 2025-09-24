import React, { useState } from "react";
import NavItem from "./NavItem";
import { RiBubbleChartFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";

function NavDropdown({ openMenu, children }) {
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <div className="border flex flex-col ">
      <NavLink to={'/auth'} className={({isActive})=>`h-16 ${isActive ? 'bg-blue-600 text-white':'bg-white text-blue-900 hover:bg-blue-200'}`} onClick={() => setShowDropdown((prev) => !prev)}>
        Dropdown
      </NavLink>
      <div className="">
        <div
          className={`ml-8 border-l-2 transition-all duration-500 ease-in-out overflow-hidden ${
            showDropdown&&openMenu ? "h-full" : "h-0"
          }`}
        >
             <>
          <NavItem
            label={"Trang chủ"}
            icon={<RiBubbleChartFill size={30} />}
            path={"register"}
          />
          <NavItem
            label={"Trang chủ"}
            icon={<RiBubbleChartFill size={30} />}
            path={"register"}
          />
          <NavItem
            label={"Trang chủ"}
            icon={<RiBubbleChartFill size={30} />}
            path={"register"}
          />
        </>
        </div>
       
      </div>
    </div>
  );
}

export default NavDropdown;

import React from "react";
import { FaChevronLeft } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import AccountDetail from "../components/AccountDetail";

function AccountDetailView() {
  const navigate = useNavigate()
  const key = useLocation().state
  return (
    <div className="h-full w-full relative z-10">
      <div className="h-fit w-full p-6 md:p-10 flex flex-col gap-6 md:gap-10">
        <div className="bg-white p-6 rounded-lg flex gap-6 flex-col h-full">
          <div onClick={()=>navigate(-1)} className="active:bg-gray-100 p-1 rounded-full h-10 w-10 flex justify-center items-center">
            <FaChevronLeft size={26} />
          </div>
         <AccountDetail id={key}/>
        </div>
      </div>
    </div>
  );
}

export default AccountDetailView;

import { ChevronLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import SurveyDetailForm from "../components/SurveyDetailForm";

function SurveyDetailView() {
  return (
    <div className={`md:p-10 p-6 flex flex-col gap-6 relative z-0 `}>
      <div className="bg-white flex py-6 flex-col gap-6 shadow-md rounded-md">
        <div className="col-span-12">
          <Link
            to={"/surveys"}
            className="flex gap-2  px-4 items-center w-fit"
          >
            <ChevronLeft size={40} />
            <span className="font-bold text-2xl">Thông tin khảo sát</span>
          </Link>
        </div>
        <div className="mx-6 md:mx-10">
          <SurveyDetailForm />
        </div>
      </div>
    </div>
  );
}

export default SurveyDetailView;

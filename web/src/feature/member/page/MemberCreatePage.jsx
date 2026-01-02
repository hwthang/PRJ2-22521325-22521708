import React from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import MemberCreateForm from "../component/MemberCreateForm";
import MemberImportExcel from "../component/MemberImportExcel";

const MemberCreatePage = () => {
  return (
    <div className="p-6 flex flex-col gap-6">
      <Link
        to={-1}
        className="active:bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center"
      >
        <ChevronLeft />
      </Link>

      <MemberCreateForm />
      <MemberImportExcel />
    </div>
  );
};

export default MemberCreatePage;

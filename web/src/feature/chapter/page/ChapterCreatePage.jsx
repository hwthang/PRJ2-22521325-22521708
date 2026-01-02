import React from "react";

import ChapterCreateForm from "../component/ChapterCreateForm";
import ChapterImportExcel from "../component/ChapterImportExcel";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ChapterCreatePage = () => {
  return (
    <div className="p-6 flex flex-col gap-6">
      <Link to={-1} className="active:bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center">
        <ChevronLeft />
      </Link>

      <ChapterCreateForm />
      <ChapterImportExcel />
    </div>
  );
};

export default ChapterCreatePage;

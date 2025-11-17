import { ChevronLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import MemberInfoSection from "../component/MemberInfoSection";

function MemberDetailView() {
  return (
    <div className="">
      <div className="flex text-2xl items-center mt-6 ml-6">
        <Link to={-1}>
          <ChevronLeft size={40} />
        </Link>
      </div>
      <div className="grid md:grid-cols-12 gap-6 max-w-6xl mx-auto px-6 py-4">
        <div className="col-span-12">
          <MemberInfoSection />
        </div>
      </div>
    </div>
  );
}

export default MemberDetailView;

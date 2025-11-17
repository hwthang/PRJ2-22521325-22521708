import React, { useState } from "react";
import { ChevronUp, UserCheck } from "lucide-react";
import MemberListView from "../../member/view/MemberListView";

function ChapterMemberSection() {
  const [open, setOpen] = useState(false);

  return (
    <div className=" rounded-lg transition-all duration-300">
      {/* Header */}
      <div
        className="pt-2 flex items-center justify-between cursor-pointer select-none"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="font-semibold text-2xl flex gap-2 items-center">
          <UserCheck size={30}/> Danh sách đoàn viên
        </span>
        <ChevronUp
          className={`transition-transform duration-300 ${
            !open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Divider */}
      <div className="" />

      {/* Content with expand animation */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-1 py-4 pt-2">
          <MemberListView />
        </div>
      </div>
    </div>
  );
}

export default ChapterMemberSection;

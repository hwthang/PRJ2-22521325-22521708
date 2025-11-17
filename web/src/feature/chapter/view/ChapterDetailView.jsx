import {
  Book,
  Calendar,
  CameraIcon,
  Check,
  ChevronLeft,
  ClipboardList,
  FileSpreadsheet,
  FileText,
  Info,
  UserCheck,
  Users,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import defAvatar from "../../../core/assets/images/avatar.png";
import { STATUS_MAP } from "../../../utils/map";

import ChapterInfoSection from "../component/ChapterInfoSection";
import ChapterMemberSection from "../component/ChapterMemberSection";
import ChapterDocumentSection from "../component/ChapterDocumentSection";

function ChapterDetailView({ chapter, onUpdate, onActivate, onLock }) {
  return (
    <div className="">
      <div className="flex text-2xl items-center mt-6 ml-6">
        <Link to={-1}>
          <ChevronLeft size={40} />
        </Link>
      </div>
      <div className="grid md:grid-cols-12 gap-6 max-w-6xl mx-auto px-6 py-4">
        <div className="col-span-12">
          <ChapterInfoSection
            chapter={chapter}
            onUpdate={onUpdate}
            onActivate={onActivate}
            onLock={onLock}
          />
        </div>
        <div className="col-span-12">
          <ChapterMemberSection />
        </div>
         <div className="col-span-12">
          <ChapterDocumentSection />
        </div>
      </div>
    </div>
  );
}

export default ChapterDetailView;

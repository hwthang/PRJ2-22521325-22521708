import React from "react";
import { Award, XCircle, FileText, ExternalLink, CalendarDays } from "lucide-react";

const EvaluationItem = ({ data }) => {
  const isReward = data.type === "reward";

  return (
    <div className={`group relative bg-white rounded-2xl border-l-4 p-5 shadow-sm hover:shadow-md transition-all duration-300 ${
      isReward ? "border-emerald-500" : "border-rose-500"
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
              isReward ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
            }`}>
              {isReward ? "Khen thưởng" : "Kỷ luật"}
            </div>
            <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
              <CalendarDays size={14} />
              {/* Giả sử bạn có trường createdAt từ API */}
              {new Date().toLocaleDateString('vi-VN')} 
            </div>
          </div>
          
          <h3 className="text-slate-800 font-bold text-base group-hover:text-indigo-600 transition-colors mb-1">
            {data.title}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
            {data.description}
          </p>
        </div>

        {data.attachments?.length > 0 && (
          <div className="flex -space-x-2 overflow-hidden py-1">
            {data.attachments.map((file, idx) => (
              <a
                key={idx}
                href={file.path}
                target="_blank"
                rel="noreferrer"
                title={file.originalname}
                className="w-10 h-10 flex items-center justify-center bg-white border-2 border-slate-100 rounded-xl text-indigo-500 hover:-translate-y-1 hover:z-10 transition-all shadow-sm"
              >
                <FileText size={18} />
              </a>
            ))}
            {data.attachments.length > 3 && (
              <div className="w-10 h-10 flex items-center justify-center bg-slate-100 border-2 border-white rounded-xl text-[10px] font-bold text-slate-500">
                +{data.attachments.length - 3}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hover Action */}
      
    </div>
  );
};

export default EvaluationItem;
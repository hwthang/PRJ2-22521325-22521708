import React from "react";
import { Eye, Download, ShieldCheck } from "lucide-react";

const DocumentPreview = ({ selectedDoc }) => {
  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-120px)] bg-[#2d2d2d] rounded-[2rem] overflow-hidden border border-slate-800 shadow-2xl">
      <div className="flex items-center justify-between p-4 px-6 border-b border-white/5">
        <div className="flex items-center gap-3 text-white">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
            <Eye size={18} />
          </div>
          <div>
            <span className="font-bold text-xs uppercase tracking-widest block">Xem trước tài liệu</span>
            <span className="text-[10px] text-slate-400 truncate max-w-[300px] block">{selectedDoc?.name || "Chưa chọn tài liệu"}</span>
          </div>
        </div>

        {selectedDoc && (
          <a
            href={selectedDoc.file?.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-white/10 hover:bg-white text-white hover:text-slate-900 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-lg"
          >
            <Download size={16} /> Tải về
          </a>
        )}
      </div>

      <div className="flex-1 bg-white mx-4 mb-4 rounded-2xl overflow-hidden shadow-inner relative">
        {selectedDoc?.file?.url ? (
          <iframe
            src={`${selectedDoc.file.url}#toolbar=1&navpanes=0&scrollbar=0&zoom=75`}
            title="PDF Preview"
            className="w-full h-full border-none"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-4">
            <div className="p-6 bg-slate-50 rounded-full animate-pulse">
              <ShieldCheck size={48} className="text-slate-200" />
            </div>
            <p className="font-bold text-sm uppercase tracking-widest">Vui lòng chọn tài liệu để hiển thị</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentPreview;
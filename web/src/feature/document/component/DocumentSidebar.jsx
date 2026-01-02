import React, { useState } from "react";
import {
  Search,
  Filter,
  FileText,
  Calendar,
  Tag,
  MessageSquare,
} from "lucide-react";
import { documentTypes } from "../page/DocumentListPage";
import { CheckOption } from "../../../core/components/CheckOption";

const DocumentSidebar = ({
  documents,
  selectedId,
  onSelect,
  searchText,
  setSearchText,
  selectedTypes,
  setSelectedTypes,
  onOpenFeedback,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <aside className="w-[400px] bg-white border-r border-slate-200 shadow-sm flex flex-col h-full">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
            Danh mục
          </h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all ${
              showFilters || selectedTypes.length > 0
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            <Filter size={16} />
            Lọc {selectedTypes.length > 0 && `(${selectedTypes.length})`}
          </button>
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Tìm tên, số hiệu..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Bảng Filter Tag */}
        {showFilters && (
          <div className="py-2 animate-in fade-in slide-in-from-top-1 border-b border-slate-100 pb-5">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">
              Loại văn bản
            </p>
            <CheckOption
              options={documentTypes}
              value={selectedTypes}
              onChange={setSelectedTypes}
              multiple={true}
            />
          </div>
        )}

        {/* Danh sách tài liệu */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-1">
            Tài liệu văn bản
          </p>
          {documents.map((doc) => (
            <div
              key={doc._id}
              onClick={() => onSelect(doc)}
              className={`group p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 
                ${
                  selectedId === doc._id
                    ? "border-indigo-500 bg-indigo-50/50 shadow-md translate-x-1"
                    : "border-transparent bg-white hover:border-slate-200 shadow-sm"
                }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 
                ${
                  selectedId === doc._id
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-bold text-sm truncate ${
                    selectedId === doc._id
                      ? "text-indigo-700"
                      : "text-slate-700"
                  }`}
                >
                  {doc.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                    <Tag size={10} /> {doc.docCode}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                    <Calendar size={10} />{" "}
                    {new Date(doc.issuedAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenFeedback(doc);
                }}
                className="opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg hover:bg-white text-indigo-500 shadow-sm"
              >
                <MessageSquare size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default DocumentSidebar;

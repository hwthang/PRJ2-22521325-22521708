import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  FileText,
  Calendar,
  Tag,
  MessageSquare,
  XCircle, // Thêm icon để xóa lọc
} from "lucide-react";
import { documentTypes } from "../page/DocumentListPage";
import { CheckOption } from "../../../core/components/CheckOption";
import { CheckOptionDropdown } from "../../../core/components/CheckOptionDropdown";

const DocumentSidebar = ({
  documents = [],
  selectedId,
  onSelect,
  searchText,
  setSearchText,
  selectedTypes,
  setSelectedTypes,
  onOpenFeedback,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  // Kiểm tra xem có đang dùng bộ lọc nào không
  const isFiltering = searchText.length > 0 || selectedTypes.length > 0;

  // Hàm xóa tất cả bộ lọc
  const handleClearFilters = () => {
    setSearchText("");
    setSelectedTypes([]);
  };

  const filterOptions = useMemo(() =>
    Object.entries(documentTypes).map(([key, value]) => ({
      value: key,
      label: value.label,
    })),
  []);

  const colorMap = {
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
    cyan: "bg-cyan-100 text-cyan-700 border-cyan-200",
    gray: "bg-gray-100 text-gray-700 border-gray-200",
    emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
    red: "bg-red-100 text-red-700 border-red-200",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    orange: "bg-orange-100 text-orange-700 border-orange-200",
    teal: "bg-teal-100 text-teal-700 border-teal-200",
    green: "bg-green-100 text-green-700 border-green-200",
    pink: "bg-pink-100 text-pink-700 border-pink-200",
  };

  const getDocTypeConfig = (typeKey) => {
    return documentTypes[typeKey] || { label: typeKey, color: "slate" };
  };

  return (
    <aside className="w-[400px] bg-white border-r border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5">
        
        {/* Header & Filter Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
              Danh mục
            </h2>
            {isFiltering && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1 text-[10px] font-bold text-red-500 hover:text-red-600 bg-red-50 px-2 py-1 rounded-full transition-colors uppercase tracking-wider"
              >
                <XCircle size={12} />
                Xóa lọc
              </button>
            )}
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all ${
              showFilters || selectedTypes.length > 0
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            <Filter size={16} />
            Lọc {selectedTypes.length > 0 && `(${selectedTypes.length})`}
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Tìm tên, số hiệu..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          {searchText && (
            <button 
              onClick={() => setSearchText("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
            >
              <XCircle size={16} />
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="py-2 animate-in fade-in slide-in-from-top-2 border-b border-slate-100 pb-5">
            <div className="flex justify-between items-center mb-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Loại văn bản
              </p>
              {selectedTypes.length > 0 && (
                <button 
                  onClick={() => setSelectedTypes([])}
                  className="text-[10px] font-bold text-indigo-500 hover:underline"
                >
                  Bỏ chọn tất cả
                </button>
              )}
            </div>
            <CheckOptionDropdown
              options={documentTypes} // Sử dụng filterOptions đã map từ object sang array
              value={selectedTypes}
              onChange={setSelectedTypes}
              multiple={true}
            />
          </div>
        )}

        {/* Documents List */}
        <div className="space-y-2">
          <div className="flex justify-between items-center pb-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Kết quả ({documents.length})
            </p>
          </div>

          {documents.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                <Search size={20} className="text-slate-300" />
              </div>
              <p className="text-slate-500 text-sm font-bold">Không tìm thấy tài liệu</p>
              <p className="text-slate-400 text-[11px] mt-1">Vui lòng thử thay đổi từ khóa hoặc bộ lọc</p>
              {isFiltering && (
                <button 
                  onClick={handleClearFilters}
                  className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  Thiết lập lại bộ lọc
                </button>
              )}
            </div>
          ) : (
            documents.map((doc) => {
              const typeConfig = getDocTypeConfig(doc.type);
              const colorClass = colorMap[typeConfig.color] || colorMap.slate;

              return (
                <div
                  key={doc._id}
                  onClick={() => onSelect(doc)}
                  className={`group p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 
                    ${selectedId === doc._id
                      ? "border-indigo-500 bg-indigo-50/50 shadow-md translate-x-1"
                      : "border-transparent bg-white hover:border-slate-200 shadow-sm"
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1
                    ${selectedId === doc._id ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                    <FileText size={20} />
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${colorClass}`}>
                      {typeConfig.label}
                    </span>

                    <h3 className={`font-bold text-sm leading-snug break-words line-clamp-2 ${selectedId === doc._id ? "text-indigo-700" : "text-slate-700"}`}>
                      {doc.name}
                    </h3>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                        <Tag size={10} /> {doc.docCode}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                        <Calendar size={10} /> {new Date(doc.issuedAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenFeedback(doc);
                    }}
                    className={`p-2 rounded-lg transition-all ${
                      selectedId === doc._id 
                        ? "opacity-100 text-indigo-600 bg-white shadow-sm" 
                        : "opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-500"
                    }`}
                  >
                    <MessageSquare size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
};

export default DocumentSidebar;
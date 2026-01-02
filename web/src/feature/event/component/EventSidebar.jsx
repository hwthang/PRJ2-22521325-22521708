import React, { useState } from "react";
import { Search, Filter, Calendar, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { eventTopics } from "../shared/EventMap";
import { CheckOption } from "../../../core/components/CheckOption";

const EventSidebar = ({ 
  events, selectedId, onSelect, 
  searchText, setSearchText, 
  selectedTopics, setSelectedTopics 
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <aside className="w-[380px] bg-white border-r border-slate-200 shadow-sm flex flex-col h-full">
      {/* Cố định phần Header nếu muốn, hoặc cho scroll tất cả */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5">
        
        {/* Tiêu đề & Nút Filter */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">Sự kiện</h1>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all ${
              showFilters || selectedTopics.length > 0 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            <Filter size={16} />
            Lọc {selectedTopics.length > 0 && `(${selectedTopics.length})`}
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Tìm tên, địa điểm..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
          />
        </div>

        {/* Phần Filter Tag (Sẽ đẩy danh sách xuống khi hiện ra) */}
        {showFilters && (
          <div className="py-2 animate-in slide-in-from-top-1 duration-200 border-b border-slate-100 pb-5">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">Chủ đề sự kiện</p>
            <CheckOption 
              options={eventTopics}
              value={selectedTopics}
              onChange={setSelectedTopics}
              multiple={true}
            />
          </div>
        )}

        {/* Danh sách Sự kiện - Nằm chung trong luồng scroll */}
        <div className="space-y-3 pt-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kết quả ({events.length})</p>
          { events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .map((event) => (
            <div
              key={event._id}
              onClick={() => onSelect(event)}
              className={`p-3.5 rounded-2xl cursor-pointer transition-all flex gap-3 items-start border-2 
                ${selectedId === event._id 
                  ? "bg-blue-600 border-blue-600 shadow-lg text-white -translate-y-0.5" 
                  : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                }`}
            >
              <img src={event.images?.[0]?.url} className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0" alt="" />
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <h3 className="font-bold text-[13px] line-clamp-2 leading-tight">{event.name}</h3>
                <div className={`flex items-center gap-1.5 text-[10px] ${selectedId === event._id ? "text-blue-100" : "text-slate-500"}`}>
                  <MapPin size={12} className="shrink-0" />
                  <span className="truncate">{event.venue}</span>
                </div>
                <div className={`flex items-center gap-1.5 text-[10px] font-bold ${selectedId === event._id ? "text-blue-200" : "text-slate-400"}`}>
                  <Calendar size={12} />
                  {new Date(event.startedAt).toLocaleDateString("vi-VN")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default EventSidebar
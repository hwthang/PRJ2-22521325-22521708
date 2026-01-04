import React, { useState } from "react";
import { Search, Filter, Calendar, MapPin } from "lucide-react";
import { eventTopics } from "../shared/EventMap";
import { CheckOptionDropdown } from "../../../core/components/CheckOptionDropdown";

const EventSidebar = ({ 
  events, selectedId, onSelect, 
  searchText, setSearchText, 
  selectedTopics, setSelectedTopics 
}) => {
  const [showFilters, setShowFilters] = useState(false);

  // Hàm helper để lấy style màu dựa trên cấu hình eventTopics
  const getTagStyle = (topicKey, isActive) => {
    const topic = eventTopics[topicKey];
    if (!topic) return "bg-slate-100 text-slate-500 border-slate-200";

    // Khi item được chọn (nền xanh đậm), tag nên có màu trắng mờ để dễ nhìn
    if (isActive) return "bg-white/20 text-white border-white/30";

    // Mapping màu từ config sang class Tailwind (Sử dụng 50/600/100 cho độ tương phản tốt)
    const colorMap = {
      green: "bg-green-50 text-green-700 border-green-200",
      red: "bg-red-50 text-red-700 border-red-200",
      emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
      orange: "bg-orange-50 text-orange-700 border-orange-200",
      sky: "bg-sky-50 text-sky-700 border-sky-200",
      pink: "bg-pink-50 text-pink-700 border-pink-200",
      violet: "bg-violet-50 text-violet-700 border-violet-200",
      purple: "bg-purple-50 text-purple-700 border-purple-200",
      cyan: "bg-cyan-50 text-cyan-700 border-cyan-200",
      amber: "bg-amber-50 text-amber-700 border-amber-200",
      yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
      teal: "bg-teal-50 text-teal-700 border-teal-200",
      rose: "bg-rose-50 text-rose-700 border-rose-200",
      fuchsia: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
      lime: "bg-lime-50 text-lime-700 border-lime-200",
    };

    return colorMap[topic.color] || "bg-slate-50 text-slate-600 border-slate-200";
  };

  return (
    <aside className="w-[380px] bg-white border-r border-slate-200 shadow-sm flex flex-col h-full">
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

        {/* Phần Filter Tag */}
        {showFilters && (
          <div className="py-2 animate-in slide-in-from-top-1 duration-200 border-b border-slate-100 pb-5">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">Chủ đề sự kiện</p>
            <CheckOptionDropdown
              options={eventTopics}
              value={selectedTopics}
              onChange={setSelectedTopics}
              multiple={true}
            />
          </div>
        )}

        {/* Danh sách Sự kiện */}
        <div className="space-y-3 pt-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kết quả ({events.length})</p>
          {events
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((event) => {
              const isActive = selectedId === event._id;
              return (
                <div
                  key={event._id}
                  onClick={() => onSelect(event)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all flex gap-3 items-start border-2 
                    ${isActive 
                      ? "bg-blue-600 border-blue-600 shadow-lg text-white -translate-y-0.5" 
                      : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                >
                  <img src={event.images?.[0]?.url} className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0 shadow-sm" alt="" />
                  
                  <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                    {/* --- HIỂN THỊ TAG TẠI ĐÂY --- */}
                    <div className="flex flex-wrap gap-1">
                      {event.tags?.map((topicKey) => (
                        <span 
                          key={topicKey}
                          className={`text-[8px] px-1.5 py-0.5 rounded-md font-black uppercase tracking-wider border ${getTagStyle(topicKey, isActive)}`}
                        >
                          {eventTopics[topicKey]?.label || topicKey}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-bold text-[13px] line-clamp-2 leading-tight">
                      {event.name}
                    </h3>

                    <div className="space-y-0.5">
                      <div className={`flex items-center gap-1.5 text-[10px] ${isActive ? "text-blue-100" : "text-slate-500"}`}>
                        <MapPin size={12} className="shrink-0" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                      <div className={`flex items-center gap-1.5 text-[10px] font-bold ${isActive ? "text-blue-200" : "text-slate-400"}`}>
                        <Calendar size={12} />
                        {new Date(event.startedAt).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </aside>
  );
};

export default EventSidebar;
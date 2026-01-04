import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Heart,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Clock,
  ShieldCheck,
  Info,
  Tag as TagIcon, // Import thêm icon Tag
} from "lucide-react";
import CommentSection from "../component/CommentSection.jsx";
import {
  formatRelativeTime,
  formatVietnamDatetimeAMPM,
} from "../../../utils/date.js";
import { eventTopics } from "../shared/EventMap"; // Import config topics
import { defAvatar } from "../../../core/assets/images/index.js";

const EventDetail = ({
  event,
  interaction,
  onLike,
  onRegister,
  commentOpen,
  setCommentOpen,
}) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    setCurrentImgIndex(0);
  }, [event._id]);

  // Helper để lấy style màu cho Tag dựa trên config
  const getTagStyle = (topicKey) => {
    const topic = eventTopics[topicKey];
    if (!topic) return "bg-slate-100 text-slate-500 border-slate-200";

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
    <article
      key={event._id}
      className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col h-fit mb-10 animate-in fade-in duration-300"
    >
      {/* Image Slider - Giữ nguyên */}
      <div className="relative h-[450px] bg-slate-900 group">
        <img
          src={event.images[currentImgIndex]?.url}
          className="w-full h-full object-contain"
          alt="event"
        />
        {event.images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setCurrentImgIndex((i) => i === 0 ? event.images.length - 1 : i - 1)}
              className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-slate-900 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => setCurrentImgIndex((i) => i === event.images.length - 1 ? 0 : i + 1)}
              className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-slate-900 transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>

      <div className="p-8 lg:p-12">
        <header className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-base border border-blue-100 uppercase">
                <img src={event.chapterId?.accountId?.avatar?.url || defAvatar} className="rounded-lg"/>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-tight">
                  {event.chapterId?.name || "Đơn vị tổ chức"}
                </h4>
                <span className="text-slate-400 text-sm flex items-center gap-1 font-medium">
                  <Clock size={10} /> {formatRelativeTime(event.createdAt)}
                </span>
              </div>
            </div>

            <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tight mb-4">
              {event.name}
            </h2>

            {/* --- PHẦN TAGS BỔ SUNG --- */}
            {event?.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {event.tags.map((topicKey) => (
                  <span
                    key={topicKey}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider border shadow-sm ${getTagStyle(topicKey)}`}
                  >
                    <TagIcon size={12} />
                    {eventTopics[topicKey]?.label || topicKey}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Nút Đăng ký - Giữ nguyên */}
          {event.status === "upcoming" && (
            event.hadRegistered ? (
              <div className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm flex items-center gap-2 border border-emerald-100 shadow-sm">
                <ShieldCheck size={18} /> ĐÃ GHI DANH
              </div>
            ) : (
              <button
                onClick={() => onRegister(event._id)}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2 uppercase tracking-wider shrink-0"
              >
                Đăng ký tham gia
              </button>
            )
          )}
        </header>

        {/* Các phần còn lại (Thời gian, Địa điểm, Mô tả, Tương tác) giữ nguyên */}
        {/* ... */}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Nội dung cũ */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-5">
                 {/* Calendar box */}
                 <div className="w-12 h-12 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
                    <Calendar size={24} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Thời gian diễn ra</p>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-blue-500/60 uppercase">Bắt đầu</span>
                            <span className="text-[13px] font-bold text-slate-700">{formatVietnamDatetimeAMPM(event.startedAt)}</span>
                        </div>
                        <div className="h-8 w-[1px] bg-slate-200 rotate-[20deg]" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-rose-500/60 uppercase">Kết thúc</span>
                            <span className="text-[13px] font-bold text-slate-700">{formatVietnamDatetimeAMPM(event.endedAt)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                <div className="p-3 bg-rose-100 text-rose-600 rounded-xl"><MapPin size={20} /></div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Địa điểm</p>
                    <p className="text-sm font-bold text-slate-700">{event.venue}</p>
                </div>
            </div>
        </div>

        <div className="prose prose-slate max-w-none mb-8">
          <h5 className="flex items-center gap-2 text-sm font-bold uppercase text-slate-800 mb-3">
            <Info size={16} className="text-blue-500" /> Mô tả chi tiết
          </h5>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-slate-50/50 p-6 rounded-2xl border border-dashed border-slate-200">
            {event.description}
          </p>
        </div>

        <div className="flex items-center gap-8 py-6 border-t border-slate-100">
          <button onClick={onLike} className={`flex items-center gap-2 font-bold text-sm transition-all ${interaction.isLiked ? "text-rose-500" : "text-slate-400 hover:text-rose-500"}`}>
            <Heart size={22} fill={interaction.isLiked ? "currentColor" : "none"} /> {interaction.likeCount}
          </button>
          <button onClick={() => setCommentOpen(!commentOpen)} className={`flex items-center gap-2 font-bold text-sm transition-all ${commentOpen ? "text-blue-600" : "text-slate-400 hover:text-blue-600"}`}>
            <MessageSquare size={22} /> Thảo luận
          </button>
        </div>

        {commentOpen && <CommentSection postId={event.postId?._id} initialComments={[]} />}
      </div>
    </article>
  );
};

export default EventDetail;
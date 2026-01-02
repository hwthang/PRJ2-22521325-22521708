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
  Share2,
  ArrowRight,
} from "lucide-react";
import CommentSection from "../component/CommentSection.jsx";
import {
  formatRelativeTime,
  formatVietnamDatetimeAMPM,
} from "../../../utils/date.js";

const EventDetail = ({
  event,
  interaction,
  onLike,
  onRegister,
  commentOpen,
  setCommentOpen,
}) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Reset index ảnh khi đổi event
  useEffect(() => {
    setCurrentImgIndex(0);
  }, [event._id]);

  return (
    <article
      key={event._id}
      className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col h-fit mb-10 animate-in fade-in duration-300"
    >
      {/* Image Slider */}
      <div className="relative h-[450px] bg-slate-900 group">
        <img
          src={event.images[currentImgIndex]?.url}
          className="w-full h-full object-contain"
          alt="event"
        />
        {event.images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() =>
                setCurrentImgIndex((i) =>
                  i === 0 ? event.images.length - 1 : i - 1
                )
              }
              className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-slate-900 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() =>
                setCurrentImgIndex((i) =>
                  i === event.images.length - 1 ? 0 : i + 1
                )
              }
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
                {event.chapterId?.name?.substring(0, 2) || "SV"}
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
            <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">
              {event.name}
            </h2>
          </div>

          {/* Nút Đăng ký */}
          {event.status === "upcoming" &&
            (event.hadRegistered ? (
              <div className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm flex items-center gap-2 border border-emerald-100 shadow-sm">
                <ShieldCheck size={18} /> ĐÃ GHI DANH
              </div>
            ) : (
              <button
                onClick={() => onRegister(event._id)}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2 uppercase tracking-wider"
              >
                Đăng ký tham gia
              </button>
            ))}
        </header>

        {/* Thông tin thời gian/địa điểm */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-5">
            {/* Icon khối lớn bên trái */}
            <div className="w-12 h-12 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
              <Calendar size={24} strokeWidth={2.5} />
            </div>

            {/* Nội dung bên phải */}
            <div className="flex-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">
                Thời gian diễn ra
              </p>

              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-blue-500/60 uppercase">
                    Bắt đầu
                  </span>
                  <span className="text-[13px] font-bold text-slate-700">
                    {formatVietnamDatetimeAMPM(event.startedAt)}
                  </span>
                </div>
                <div className="h-8 w-[1px] bg-slate-200 rotate-[20deg]" />{" "}
                {/* Đường vạch ngăn cách chéo nhẹ */}
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-rose-500/60 uppercase">
                    Kết thúc
                  </span>
                  <span className="text-[13px] font-bold text-slate-700">
                    {formatVietnamDatetimeAMPM(event.endedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Địa điểm
              </p>
              <p className="text-sm font-bold text-slate-700">{event.venue}</p>
            </div>
          </div>
        </div>

        {/* Mô tả */}
        <div className="prose prose-slate max-w-none mb-8">
          <h5 className="flex items-center gap-2 text-sm font-bold uppercase text-slate-800 mb-3">
            <Info size={16} className="text-blue-500" /> Mô tả chi tiết
          </h5>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-slate-50/50 p-6 rounded-2xl border border-dashed border-slate-200">
            {event.description}
          </p>
        </div>

        {/* Tương tác */}
        <div className="flex items-center gap-8 py-6 border-t border-slate-100">
          <button
            onClick={onLike}
            className={`flex items-center gap-2 font-bold text-sm transition-all ${
              interaction.isLiked
                ? "text-rose-500"
                : "text-slate-400 hover:text-rose-500"
            }`}
          >
            <Heart
              size={22}
              fill={interaction.isLiked ? "currentColor" : "none"}
            />{" "}
            {interaction.likeCount}
          </button>
          <button
            onClick={() => setCommentOpen(!commentOpen)}
            className={`flex items-center gap-2 font-bold text-sm transition-all ${
              commentOpen
                ? "text-blue-600"
                : "text-slate-400 hover:text-blue-600"
            }`}
          >
            <MessageSquare size={22} /> Thảo luận
          </button>
        </div>

        {commentOpen && (
          <CommentSection postId={event.postId?._id} initialComments={[]} />
        )}
      </div>
    </article>
  );
};

export default EventDetail;

import React, { useState, useEffect } from "react";
import PostMedia from "./PostMedia";
import { defAvatar } from "../../../core/assets/images";
import {
  MessageSquareText,
  Heart,
  LandPlot,
  AlarmClockCheck,
  Clock,
} from "lucide-react";
import Caption from "./Caption";
import { eventTopics } from "../../event/shared/EventMap";
import { CustomLabel } from "../../component/custom/CustomLabel";
import CommentSection from "./CommentSection"; // 👈 thêm

const EventPost = ({ data }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(100000);
  const [commentCount] = useState(102);

  // 👉 state biết đã đăng ký hay chưa
  const [isRegistered, setIsRegistered] = useState(
    data?.status === "upcoming" && data?.canRegister === false
  );

  useEffect(() => {
    setIsRegistered(
      data?.status === "upcoming" && data?.canRegister === false
    );
  }, [data]);

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("vi-VN");
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num;
  };

  const handleRegisterEvent = () => {
    console.log("Register event:", data?.id || data?._id, data?.name);
    setIsRegistered(true);
  };

  return (
  <div className="shadow-sm border w-180 border-gray-200 bg-white rounded-md grid grid-cols-1 overflow-hidden">
  {/* Media */}
  <div className="w-full h-100">
    <PostMedia items={data?.images || []} />
  </div>

  {/* Content */}
  <div className="p-5 relative flex flex-col max-h-[640px]">
    {/* Header + nút đăng ký */}
    <div className="flex items-center justify-between gap-4 pb-3">
      {/* Avatar + info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <img
          src={defAvatar}
          className="h-12 w-12 rounded-full object-cover shadow-sm"
          alt="avatar"
        />
        <div className="min-w-0">
          <div className="font-semibold text-gray-900 text-base truncate">
            {data?.chapterName || "Đoàn cơ sở"}
          </div>

          <div className="text-sm text-gray-500">
            {formatDate(data?.startTime)} — {formatDate(data?.endTime)}
          </div>

          <div className="text-sm text-gray-600 flex items-center gap-1">
            <LandPlot size={14} />
            <span className="truncate">{data?.location}</span>
          </div>
        </div>
      </div>

      {/* Button đăng ký – giữ nguyên logic */}
      {data?.status === "upcoming" && (
        <div className="flex items-center">
          {!isRegistered ? (
            <button
              onClick={handleRegisterEvent}
              className="flex items-center gap-2 rounded-full bg-blue-600 text-white text-xs 
                         px-4 py-2 hover:bg-blue-700 active:bg-blue-800 transition shadow-sm"
            >
              <Clock className="w-4 h-4" />
              <span>Đăng ký tham gia ngay</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 text-green-600 font-medium text-xs">
              <AlarmClockCheck className="w-4 h-4" />
              <span>Đã đăng ký tham gia</span>
            </div>
          )}
        </div>
      )}
    </div>

    {/* Scrollable area */}
    <div className="flex-1 overflow-y-auto pr-1 -mr-1">
      {/* Caption */}
      <Caption text={data?.description || ""} />

      {/* Topics */}
      <div className="flex gap-2 flex-wrap mt-3">
        {data?.topics?.map((key) => {
          const topic = eventTopics[key];
          if (!topic) return null;
          return (
            <CustomLabel
              key={key}
              label={topic.label}
              color={topic.color}
              icon={topic.icon}
              selected
            />
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="mt-4 flex items-center gap-10 border-y py-3 border-gray-300">
        {/* Like */}
        <button
          onClick={toggleLike}
          className={`flex items-center gap-2 transition ${
            liked ? "text-red-600 font-semibold" : "hover:text-red-600"
          }`}
        >
          <Heart size={18} className={liked ? "fill-red-600 text-red-600" : ""} />
          {formatNumber(likeCount)}
        </button>

        {/* Comment */}
        <button
          onClick={() => setCommentOpen(!commentOpen)}
          className={`flex items-center gap-2 transition ${
            commentOpen ? "text-blue-600 font-semibold" : "hover:text-blue-600"
          }`}
        >
          <MessageSquareText size={18} />
          {formatNumber(commentCount)}
        </button>
      </div>

      {/* Comments */}
      <CommentSection open={commentOpen} avatar={defAvatar} />
    </div>
  </div>
</div>

  );
};

export default EventPost;

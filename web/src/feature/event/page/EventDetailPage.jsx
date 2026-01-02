import { ChevronLeft, QrCode, Eye, EyeOff } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import apiClient from "../../../utils/api";

import EventDetailForm from "../component/EventDetailForm";
import CommentManagerSection from "../component/CommentManagerSection";
import ParticipantListSection from "../component/ParticipantListSection";
import AttendanceQRSection from "../component/AttendanceQRSection";

const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false); // State để ẩn/hiện QR Section

  const fetchEventById = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/events/${id}`);
      setEvent(response.data.event);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEventById(); }, [id]);

  if (loading) return (
    <div className="p-6 flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="p-6 flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Quay lại */}
      <div className="flex items-center">
        <Link to={-1} className="h-10 w-10 rounded-full flex items-center justify-center border hover:bg-white hover:shadow-sm transition-all">
          <ChevronLeft size={24} />
        </Link>
      </div>

      {/* 1. Form chi tiết sự kiện */}
      <EventDetailForm event={event} />
<div className="mt-4">
        <div className="h-[1px] bg-gray-200 w-full mb-8"></div>
        <CommentManagerSection postId={event?.postId?._id} />
      </div>
      {/* 2. Khu vực Quản lý Tham gia */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="font-extrabold text-xl text-gray-800 uppercase tracking-tight">Điều hành sự kiện</h3>
          
          <button
            onClick={() => setShowQR(!showQR)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all shadow-sm border ${
              showQR 
              ? "bg-gray-100 text-gray-600 border-gray-200" 
              : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
            }`}
          >
            {showQR ? <><EyeOff size={18} /> Ẩn QR</> : <><QrCode size={18} /> Hiện QR Điểm Danh</>}
          </button>
        </div>

        {/* Hiện QR Section ngay trên List nếu showQR = true */}
        {showQR && <AttendanceQRSection eventId={id} />}

        {/* Danh sách người tham gia */}
        <ParticipantListSection eventId={id} />
      </div>

      {/* 3. Thảo luận */}
      
    </div>
  );
};

export default EventDetailPage;
import React, { useState, useEffect } from "react";
import { Phone, PhoneOff, User, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { base_url } from "../../utils/api";
import ConversationService from "../chat/service/ConversationService";

const IncomingCallPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Lấy các ID từ URL
  const fromId = searchParams.get("from"); // Người gọi
  const toId = searchParams.get("to"); // Chính là mình (người nhận)
  const callId = searchParams.get("callId");

  const [fromUser, setFromUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // Trạng thái khi đang bấm nút

  const fetchFromUser = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${base_url}/api/accounts/${fromId}`);
      const json = await res.json();
      setFromUser(json);
    } catch (err) {
      console.error("Lỗi lấy thông tin người gọi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fromId) fetchFromUser();
  }, [fromId]);

  // 1. Xử lý Chấp nhận cuộc gọi
  const handleAccept = async () => {
    try {
      setActionLoading(true);
      const res = await fetch(`${base_url}/api/calls/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: toId, // Người gửi request accept là mình
          to: fromId, // Gửi thông báo lại cho người gọi
          callId: callId,
        }),
      });

      const json = await res.json();
      const myAccount = localStorage.getItem("my_account");
      const type = JSON.parse(myAccount).type;
      navigate(
        `/app/${type}/video-call?callId=${callId}&from=${fromId}&to=${toId}`
      );
    } catch (err) {
      console.error("Lỗi accept:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // 2. Xử lý Từ chối cuộc gọi
  const handleDecline = async () => {
    try {
      setActionLoading(true);
      await fetch(`${base_url}/api/calls/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: toId,
          to: fromId,
          callId: callId,
        }),
      });

      const res = await ConversationService.sendMessage(callId, {
        senderId: toId,
        message: "Đã từ chối cuộc gọi",
      });

      const myAccount = localStorage.getItem("my_account");
      const type = JSON.parse(myAccount).type;
      navigate(`/app/${type}/chat?conversationId=${callId}`);
    } catch (err) {
      console.error("Lỗi reject:", err);
      navigate(-1);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-around p-8 text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="text-center animate-bounce-slow">
        <span className="text-sm font-bold tracking-[0.4em] text-emerald-400 uppercase mb-4 block">
          Cuộc gọi đến...
        </span>
        {loading ? (
          <div className="h-10 w-48 bg-slate-800 animate-pulse rounded-lg mx-auto" />
        ) : (
          <h1 className="text-4xl font-black mb-2">
            {fromUser?.displayName || "Người dùng ẩn danh"}
          </h1>
        )}
        <p className="text-slate-400 font-medium">Đang chờ bạn trả lời</p>
      </div>

      {/* Center - Avatar */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-44 h-44 bg-emerald-500/20 rounded-full animate-ping" />
        <div className="absolute w-60 h-60 bg-emerald-500/10 rounded-full animate-[ping_3s_linear_infinite]" />

        <div className="relative w-52 h-52 rounded-[3.5rem] bg-slate-800 border-4 border-slate-700 flex items-center justify-center shadow-2xl overflow-hidden z-10">
          {fromUser?.avatar ? (
            <img
              src={fromUser.avatar?.url}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={100} className="text-slate-600" />
          )}
        </div>
      </div>

      {/* Footer - Nút bấm */}
      <div className="flex items-center gap-12 sm:gap-20">
        {/* Nút Từ chối */}
        <div className="flex flex-col items-center gap-3">
          <button
            disabled={actionLoading}
            onClick={handleDecline}
            className="w-20 h-20 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all active:scale-90 disabled:opacity-50"
          >
            <PhoneOff size={32} fill="currentColor" />
          </button>
          <span className="text-xs font-black text-red-500 uppercase tracking-widest">
            Từ chối
          </span>
        </div>

        {/* Nút Nhận cuộc gọi */}
        <div className="flex flex-col items-center gap-3">
          <button
            disabled={actionLoading}
            onClick={handleAccept}
            className="w-20 h-20 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all active:scale-90 animate-shake disabled:opacity-50"
          >
            {actionLoading ? (
              <Loader2 className="animate-spin" size={32} />
            ) : (
              <Phone size={32} fill="currentColor" />
            )}
          </button>
          <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">
            Trả lời
          </span>
        </div>
      </div>

      {/* Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(10deg); }
          75% { transform: rotate(-10deg); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `,
        }}
      />
    </div>
  );
};

export default IncomingCallPage;

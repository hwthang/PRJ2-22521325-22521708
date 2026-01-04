import React, { useState, useEffect } from "react";
import { PhoneOff, User, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { base_url } from "../../utils/api";
import ConversationService from "../chat/service/ConversationService";

export const WaitingCallPage = () => {
  const [searchParams] = useSearchParams();
  const toId = searchParams.get("to");
  const callId = searchParams.get("callId");
  const fromId = searchParams.get("from");

  const [timer, setTimer] = useState(0);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false); // Trạng thái khi đang gọi API hủy
  const navigate = useNavigate();

  // 1. Fetch thông tin tài khoản người nhận
  useEffect(() => {
    const fetchAccountInfo = async () => {
      if (!toId) return;
      try {
        setLoading(true);
        const res = await fetch(`${base_url}/api/accounts/${toId}`);
        const json = await res.json();
        // Giả sử cấu trúc trả về là json.data.account hoặc json trực tiếp tùy vào API của bạn
        setAccount(json?.data?.account || json);
      } catch (err) {
        console.error("Lỗi lấy thông tin tài khoản:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccountInfo();
  }, [toId]);

  // 2. Logic đếm giây
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 3. Tự động ngắt khi đủ 60 giây
  useEffect(() => {
    if (timer >= 60) {
      handleEndCall();
    }
  }, [timer]);

  // 4. Hàm xử lý hủy cuộc gọi (Gửi API)
  const handleEndCall = async () => {
    if (isCancelling) return;

    try {
      setIsCancelling(true);

      // Gọi API cancel để phía bên kia (người nhận) nhận được socket "call:cancelled"
      await fetch(`${base_url}/api/calls/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromId,
          to: toId,
          callId: callId,
        }),
      });

      const res = await ConversationService.sendMessage(callId, {
        senderId: fromId,
        message: "Đã hủy cuộc gọi",
      });
    } catch (error) {
      console.error("Lỗi khi hủy cuộc gọi:", error);
    } finally {
      setIsCancelling(false);
      navigate(-1); // Quay lại bất kể API có lỗi hay không
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-around p-8 text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="text-center animate-in fade-in zoom-in duration-700">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Loader2 className="animate-spin text-blue-500" size={20} />
          <span className="text-sm font-bold tracking-[0.3em] text-blue-400 uppercase">
            {isCancelling ? "Đang hủy..." : "Đang gọi..."}
          </span>
        </div>

        {loading ? (
          <div className="h-10 w-48 bg-slate-800 animate-pulse rounded-lg mx-auto mb-2" />
        ) : (
          <h1 className="text-4xl font-black mb-2 transition-all">
            {account?.displayName || "Người dùng"}
          </h1>
        )}

        <p className="text-slate-400 text-lg font-medium">
          {formatTime(timer)}
        </p>
      </div>

      {/* Center - Avatar */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-40 h-40 bg-blue-500/20 rounded-full animate-[ping_2s_linear_infinite]" />
        <div className="absolute w-64 h-64 bg-blue-500/10 rounded-full animate-[ping_3s_linear_infinite]" />

        <div className="relative w-48 h-48 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center shadow-2xl overflow-hidden z-10">
          {account?.avatar ? (
            <img
              src={account.avatar?.url || account.avatar}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={90} className="text-slate-600" />
          )}
        </div>
      </div>

      {/* Footer - Nút Hủy */}
      <div className="flex flex-col items-center gap-6">
        <button
          onClick={handleEndCall}
          disabled={isCancelling}
          className={`group relative flex items-center justify-center transition-transform active:scale-90 ${
            isCancelling ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <div className="absolute w-24 h-24 bg-red-500/20 rounded-full animate-pulse group-hover:bg-red-500/40" />

          <div className="relative w-20 h-20 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-colors">
            {isCancelling ? (
              <Loader2 className="animate-spin" size={32} />
            ) : (
              <PhoneOff size={32} fill="currentColor" />
            )}
          </div>
        </button>

        <div className="text-center">
          <span className="text-red-500/80 font-bold text-xs uppercase tracking-widest block mb-1">
            Kết thúc
          </span>
          <p className="text-[10px] text-slate-500 italic">
            Cuộc gọi sẽ tự động ngắt nếu không có người nhấc máy
          </p>
        </div>
      </div>
    </div>
  );
};

export default WaitingCallPage;

import React, { useState, useEffect } from "react";
import { Phone, PhoneOff, User, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { base_url } from "../../utils/api";

const IncomingCallPage = () => {
  const [searchParams] = useSearchParams();
  const [fromUser, setFromUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFromUser = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${base_url}/api/accounts/${searchParams.get("from")}`
      );
      const json = await res.json();
     
        setFromUser(json);
      
    } catch (err) {
      console.error("Lỗi lấy thông tin người gọi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFromUser();
    
  }, []);

  const handleAccept = () => {
    console.log("Chấp nhận cuộc gọi");
    // Điều hướng đến màn hình video chat thực tế tại đây
  };

  const handleDecline = () => {
    console.log("Từ chối cuộc gọi");
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-around p-8 text-white font-sans overflow-hidden">
      
      {/* Header - Trạng thái */}
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

      {/* Center - Avatar & Hiệu ứng sóng lan tỏa mạnh hơn */}
      <div className="relative flex items-center justify-center">
        {/* Các vòng sóng lan tỏa liên tục */}
        <div className="absolute w-44 h-44 bg-emerald-500/20 rounded-full animate-ping" />
        <div className="absolute w-60 h-60 bg-emerald-500/10 rounded-full animate-[ping_3s_linear_infinite]" />
        
        <div className="relative w-52 h-52 rounded-[3.5rem] bg-slate-800 border-4 border-slate-700 flex items-center justify-center shadow-2xl overflow-hidden z-10">
          {fromUser?.avatar ? (
            <img src={fromUser.avatar?.url} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <User size={100} className="text-slate-600" />
          )}
        </div>
      </div>

      {/* Footer - Hai nút chức năng chính */}
      <div className="flex items-center gap-12 sm:gap-20">
        
        {/* Nút Từ chối */}
        <div className="flex flex-col items-center gap-3">
          <button 
            onClick={handleDecline}
            className="w-20 h-20 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all active:scale-90 hover:rotate-12"
          >
            <PhoneOff size={32} fill="currentColor" />
          </button>
          <span className="text-xs font-black text-red-500 uppercase tracking-widest">Từ chối</span>
        </div>

        {/* Nút Nhận cuộc gọi */}
        <div className="flex flex-col items-center gap-3">
          <button 
            onClick={handleAccept}
            className="w-20 h-20 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all active:scale-90 animate-shake hover:-rotate-12"
          >
            <Phone size={32} fill="currentColor" />
          </button>
          <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Trả lời</span>
        </div>

      </div>

      {/* CSS cho hiệu ứng rung (shake) */}
      <style dangerouslySetInnerHTML={{ __html: `
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
      `}} />
    </div>
  );
};

export default IncomingCallPage;
import React, { useState, useEffect, useRef } from "react";
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, User, 
  AlertTriangle, Loader2
} from "lucide-react";
import {
  PaginatedGridLayout, StreamCall, StreamTheme, 
  StreamVideo, StreamVideoClient, VideoPreview,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { base_url } from "../../utils/api";
import { useNavigate, useSearchParams } from "react-router-dom";

const VideoCallPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const callId = searchParams.get("callId");
  const toId = searchParams.get("to");
  const fromId = searchParams.get("from");

  const [client, setClient] = useState();
  const [call, setCall] = useState();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  // Khóa để ngăn gọi API nhiều lần
  const hasInitialized = useRef(false);
  const myAccount = JSON.parse(localStorage.getItem("my_account") || "{}");

  // 1. Khởi tạo Stream Client (Chỉ chạy 1 lần)
  useEffect(() => {
    if (!myAccount._id || hasInitialized.current) return;
    hasInitialized.current = true;

    const initClient = async () => {
      try {
        const response = await fetch(`${base_url}/create-user-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: myAccount._id, name: myAccount.displayName }),
        });
        const json = await response.json();

        const myClient = new StreamVideoClient({
          apiKey: json.apiKey,
          user: { id: myAccount._id, name: myAccount.displayName },
          token: json.token,
        });
        setClient(myClient);
      } catch (err) {
        console.error("Lỗi khởi tạo Client:", err);
        hasInitialized.current = false; // Cho phép thử lại nếu lỗi mạng
      }
    };

    initClient();
    return () => {
      // client?.disconnectUser(); // Thường không ngắt ở đây để tránh mất kết nối khi re-render
    };
  }, [myAccount._id, myAccount.displayName]);

  // 2. Thiết lập cuộc gọi
  useEffect(() => {
    if (!client || !callId) return;
    
    const myCall = client.call("default", callId);
    const setupCall = async () => {
      try {
        await myCall.getOrCreate();
        await myCall.join({ create: true });
        // Đảm bảo thiết bị được bật ngay khi join
        await myCall.camera.enable();
        await myCall.microphone.enable();
        setCall(myCall);
      } catch (err) {
        console.error("Lỗi thiết lập cuộc gọi:", err);
      }
    };

    setupCall();
    return () => {
      // Khi unmount component mà không qua confirmEndCall
      if (myCall.state.callingState !== 'left') {
        myCall.leave().catch(console.error);
      }
    };
  }, [client, callId]);

  const handleToggleMic = async () => {
    if (!call) return;
    const nextState = !isMuted;
    setIsMuted(nextState);
    nextState ? await call.microphone.disable() : await call.microphone.enable();
  };

  const handleToggleVideo = async () => {
    if (!call) return;
    const nextState = !isVideoOff;
    setIsVideoOff(nextState);
    nextState ? await call.camera.disable() : await call.camera.enable();
  };

  const confirmEndCall = async () => {
    try {
      setIsEnding(true);
      await fetch(`${base_url}/api/calls/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: myAccount._id,
          to: toId === myAccount._id ? fromId : toId,
          callId: callId,
        }),
      });
      if (call) await call.endCall(); // endCall kết thúc cho mọi người, leave chỉ mình rời đi
      navigate(`/app/${myAccount.type}/chat?conversationId=${callId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsEnding(false);
      setShowExitPopup(false);
    }
  };

  if (!client || !call) {
    return (
      <div className="h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-500 rounded-full animate-spin mb-6"></div>
        <p className="text-zinc-500 font-medium tracking-widest uppercase text-[10px]">Secure Connection...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white flex flex-col font-sans overflow-hidden">
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <StreamTheme>
            <div className="flex-1 relative p-2 md:p-4">
              <div className="w-full h-full bg-zinc-950 rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/5 relative shadow-inner">
                
                {/* Đối phương */}
                <div className="w-full h-full [&_.str-video__participant-view]:bg-transparent">
                  <PaginatedGridLayout filterParticipants={(p) => p.userId !== myAccount._id} />
                </div>

                {/* PIP: Video của bạn - Đã sửa lỗi kích thước */}
                <div className="absolute top-6 right-6 w-24 h-36 md:w-44 md:h-28 bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-10 transition-transform hover:scale-105 active:scale-95 group">
                  <div className="w-full h-full relative overflow-hidden">
                    {isVideoOff ? (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                        <User className="text-zinc-700" size={24} />
                      </div>
                    ) : (
                      <div className="video-preview-container w-full h-full overflow-hidden">
                        <VideoPreview />
                      </div>
                    )}
                    
                    {/* Overlay thông tin nhỏ */}
                    <div className="absolute bottom-1.5 left-2 flex items-center gap-1.5 bg-black/40 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                      <div className={`w-1.5 h-1.5 rounded-full ${isMuted ? 'bg-red-500' : 'bg-emerald-500'}`} />
                      <span className="text-[8px] font-bold text-white/70 uppercase tracking-tighter">Bạn</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-8 left-8 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/5 shadow-lg">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-400">Live</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="pb-8 pt-2 flex justify-center">
              <div className="flex items-center gap-3 bg-zinc-900/60 backdrop-blur-2xl p-2 px-5 rounded-full border border-white/10 shadow-2xl">
                <button onClick={handleToggleMic} className={`p-4 rounded-full transition-all ${isMuted ? "bg-red-500/20 text-red-500 border border-red-500/30" : "bg-zinc-800/80 text-zinc-400 hover:text-white"}`}>
                  {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                </button>

                <button onClick={handleToggleVideo} className={`p-4 rounded-full transition-all ${isVideoOff ? "bg-red-500/20 text-red-500 border border-red-500/30" : "bg-zinc-800/80 text-zinc-400 hover:text-white"}`}>
                  {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                </button>

                <div className="w-[1px] h-6 bg-white/10 mx-1"></div>

                <button onClick={() => setShowExitPopup(true)} className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-red-600/20 flex items-center gap-2 active:scale-95">
                  <PhoneOff size={18} />
                  <span className="text-[11px] uppercase tracking-widest hidden sm:inline">Kết thúc</span>
                </button>
              </div>
            </div>

            {/* Exit Confirmation */}
            {showExitPopup && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                <div className="bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6 border border-red-500/20">
                    <AlertTriangle size={30} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Rời cuộc gọi?</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed mb-8">Bạn có chắc muốn kết thúc phiên làm việc này?</p>
                  <div className="flex gap-3">
                    <button onClick={() => setShowExitPopup(false)} className="flex-1 py-3.5 rounded-full bg-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-700 transition-all">Quay lại</button>
                    <button onClick={confirmEndCall} disabled={isEnding} className="flex-1 py-3.5 rounded-full bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-all flex items-center justify-center gap-2">
                      {isEnding ? <Loader2 className="animate-spin" size={16} /> : "Rời đi"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </StreamTheme>
        </StreamCall>
      </StreamVideo>

      {/* CSS MAGIC: Sửa lỗi VideoPreview không fit khung */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Ép video preview lấp đầy container cha */
        .video-preview-container .str-video__video-preview {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 0 !important;
        }
        /* Loại bỏ các khoảng đệm mặc định của SDK */
        .str-video__video-preview-container {
          width: 100% !important;
          height: 100% !important;
          padding: 0 !important;
        }
        video {
          object-fit: cover !important;
        }
      `}} />
    </div>
  );
};

export default VideoCallPage;
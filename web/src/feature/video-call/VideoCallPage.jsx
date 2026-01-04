import React, { useState, useEffect } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Settings,
  Maximize2,
} from "lucide-react";
import {
  PaginatedGridLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import { base_url } from "../../utils/api";
import { useNavigate, useSearchParams } from "react-router-dom";

const VideoCallPage = () => {
  const [searchParams] = useSearchParams();
  const [client, setClient] = useState();
  const [call, setCall] = useState();
  const navigate = useNavigate();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetch(`${base_url}/create-user-token`, {
      method: "POSt",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: searchParams.get("id"),
        name: searchParams.get("Thắng"),
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        const myClient = StreamVideoClient.getOrCreateInstance(json);
        setClient(myClient);
      });

    return () => {
      client?.disconnectUser();
      setClient(undefined);
    };
  }, []);

  useEffect(() => {
    if (!client) return;

    const myCall = client.call("default", searchParams.get("callId"));

    const setupCall = async () => {
      try {
        await myCall.getOrCreate();
        await myCall.join({ create: true });
        setCall(myCall); // Only set state once the call is fully initialized
      } catch (err) {
        console.error("Failed to setup call:", err);
      }
    };

    setupCall();

    return () => {
      myCall.leave().catch((err) => console.error(err));
      setCall(undefined);
    };
  }, [client]);

  // 1. Khởi tạo loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // --- CÁC HÀM XỬ LÝ (HANDLERS) ---

  // Xử lý bật/tắt Micro
  const handleToggleMic = async () => {
    try {
      // Lấy giá trị mới nhất dựa trên giá trị cũ
      const nextMutedState = !isMuted;
      setIsMuted(nextMutedState);

      if (nextMutedState) {
        await call.microphone.disable();
        console.log("Mic đã tắt");
      } else {
        await call.microphone.enable();
        console.log("Mic đã bật");
      }
    } catch (error) {
      console.error("Lỗi khi điều khiển Mic:", error);
      // Nếu lỗi, nên hoàn tác (revert) lại UI
      setIsMuted(isMuted);
    }
  };
  // Xử lý bật/tắt Camera
  const handleToggleVideo = async () => {
    try {
      const nextVideoState = !isVideoOff;
      setIsVideoOff(nextVideoState);

      if (nextVideoState) {
        await call.camera.disable();
        console.log("Camera đã tắt");
      } else {
        await call.camera.enable();
        console.log("Camera đã bật");
      }
    } catch (error) {
      console.error("Lỗi khi điều khiển Camera:", error);
      setIsVideoOff(isVideoOff);
    }
  };

  // Xử lý kết thúc cuộc gọi
  const handleEndCall = () => {
    if (window.confirm("Bạn có chắc chắn muốn rời khỏi cuộc gọi?")) {
      console.log("Kết thúc cuộc gọi..."); // Giả lập quay lại ban đầu
      // Thực tế: window.location.href = "/dashboard" hoặc đóng stream
      const myAccount = localStorage.getItem("my_account");
      const role = JSON.parse(myAccount).type;
      navigate(`/app/${role}/dashboard`);
    }
  };

  // Xử lý phóng to video preview (PIP)
  const handleMaximizePreview = (e) => {
    e.stopPropagation(); // Ngăn sự kiện nổi bọt
    alert("Chế độ xem toàn màn hình cho video của bạn");
  };

  // --- GIAO DIỆN LOADING ---
  if (!client || !call) {
    return (
      <div className="h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-24 h-24 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <Video size={32} className="text-blue-500 animate-pulse" />
        </div>
        <h1 className="mt-8 text-xl font-medium tracking-tight">
          Đang kết nối tín hiệu...
        </h1>
      </div>
    );
  }

  // --- GIAO DIỆN CHÍNH ---
  return (
    <div className="h-screen bg-zinc-950 text-white flex flex-col p-4 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Main Video Area */}
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <StreamTheme>
            {/* Control Bar */}{" "}
            <div className="flex-1 relative bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
              <div className="relative w-full h-full">
                {/* Đối tác */}
                <div className="w-full h-150 bg-zinc-800 flex items-center justify-center">
                  <PaginatedGridLayout
                    filterParticipants={(p) => p.name != "Thắng"}
                  />
                </div>

                {/* Video Preview của bạn (PIP) */}
                <div className="absolute bottom-6 right-6 w-40 h-60 md:w-64 md:h-36 bg-zinc-700 rounded-2xl border-2 border-zinc-900 shadow-2xl overflow-hidden z-10 transition-all duration-300">
                  <div className="w-full h-full flex items-center justify-center bg-zinc-600 relative group">
                    {isVideoOff ? (
                      <div className="flex flex-col items-center gap-2">
                        <VideoOff size={24} className="text-zinc-500" />
                        <span className="text-[10px] text-zinc-500">
                          Camera Off
                        </span>
                      </div>
                    ) : (
                      <VideoPreview />
                    )}

                    {/* Nút Maximize ẩn/hiện khi hover */}

                    <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      Bạn {isMuted && " (Muted)"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="flex items-center gap-3 bg-zinc-900/90 p-3 rounded-[2rem] border border-zinc-800 backdrop-blur-md">
                {/* Mic Button */}
                <button
                  onClick={handleToggleMic}
                  className={`p-4 rounded-2xl transition-all duration-200 active:scale-95 ${
                    isMuted
                      ? "bg-red-500/20 text-red-500"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
                </button>

                {/* Video Button */}
                <button
                  onClick={handleToggleVideo}
                  className={`p-4 rounded-2xl transition-all duration-200 active:scale-95 ${
                    isVideoOff
                      ? "bg-red-500/20 text-red-500"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
                </button>

                <div className="w-[1px] h-8 bg-zinc-800 mx-1"></div>

                {/* End Call Button */}
                <button
                  onClick={handleEndCall}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-red-500/30 flex items-center gap-2 active:scale-95"
                >
                  <PhoneOff size={20} />
                  <span className="hidden sm:inline">Kết thúc</span>
                </button>
              </div>
            </div>
          </StreamTheme>
        </StreamCall>
      </StreamVideo>
    </div>
  );
};

export default VideoCallPage;

const MainCall = () => {};

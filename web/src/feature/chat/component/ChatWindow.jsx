import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Smile,
  Loader2,
  X,
  MoreVertical,
  Phone,
  Video,
  PlayCircle,
  FileText,
  Download,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import DefaultAvatar from "../../../core/assets/images/avatar.png";
import ChatDetailSidebar from "./ChatDetailSidebar";
import { Link, useNavigate } from "react-router-dom";
import { base_url } from "../../../utils/api";
import { defAvatar } from "../../../core/assets/images";

const ChatWindow = ({
  chatData,
  messages,
  loadingMessages,
  isUploading,
  myAccountId,
  onSendMessage,
  onUploadFile,
  onConversationUpdated,
  onStartPrivateChat,
}) => {
  const [message, setMessage] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const scrollRef = useRef(null);
  const emojiRef = useRef(null);
  const navigate = useNavigate();

  const myAccountRaw = localStorage.getItem("my_account");
  const role = JSON.parse(myAccountRaw).type;
  const isAdmin = myAccountRaw
    ? JSON.parse(myAccountRaw).type === "chapter"
    : false;

  // Cuộn xuống cuối
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage("");
    setShowEmoji(false);
  };

  const handleVideoCall = async () => {
    console.log(myAccountId);
    const toId = chatData.members.filter((item) => item._id != myAccountId)[0]
      ._id;
    console.log(toId);
    fetch(`${base_url}/api/calls/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: myAccountId,
        to: toId,
        callId: chatData._id,
      }),
    });

   onSendMessage("Đã thực hiện cuộc gọi");
    navigate(
      `/app/${role}/waiting-call?to=${toId}&callId=${chatData._id}&from=${myAccountId}`
    );
  };

  const otherMember = chatData.members?.find(
    (m) => (m._id || m) !== myAccountId
  );
  const displayName =
    chatData.name ||
    otherMember?.displayName ||
    otherMember?.fullname ||
    "Người dùng";

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#f8fafc]">
      <main
        className={`flex flex-col h-full transition-all duration-500 ease-in-out ${
          showDetails ? "flex-[2.5]" : "flex-1"
        } relative bg-white`}
      >
        {/* Lightbox Viewer */}
        {lightbox && (
          <div
            className="fixed inset-0 z-[1000] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 text-white/50 hover:text-white">
              <X size={32} />
            </button>
            {lightbox.type === "image" ? (
              <img
                src={lightbox.url}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
            ) : (
              <video
                src={lightbox.url}
                controls
                autoPlay
                className="max-w-full max-h-[90vh] rounded-lg"
              />
            )}
          </div>
        )}

        {/* Header */}
        <header className="px-6 py-4 border-b border-slate-100 bg-white/80 backdrop-blur-md flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-slate-100 cursor-pointer"
              onClick={() => setShowDetails(true)}
            >
              <img
                src={
                  chatData?.members?.length > 2
                    ? defAvatar
                    : otherMember?.avatar?.url || defAvatar
                }
                className="w-full h-full object-cover"
                alt="Avatar"
              />
            </div>
            <div className="flex flex-col">
              <h2
                className="font-bold text-slate-800 text-[15px] cursor-pointer"
                onClick={() => setShowDetails(true)}
              >
                {displayName}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {!chatData.name && (
              <button
                onClick={handleVideoCall}
                className="p-2.5 text-slate-400 hover:text-blue-600"
              >
                <Video size={19} />
              </button>
            )}

            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`p-2.5 rounded-full ${
                showDetails ? "bg-blue-50 text-blue-600" : "text-slate-400"
              }`}
            >
              <MoreVertical size={19} />
            </button>
          </div>
        </header>

        {/* Message Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-6 py-8 space-y-8 bg-[#fbfcfd] custom-scrollbar"
        >
          {loadingMessages ? (
            <div className="flex justify-center items-center h-full opacity-40">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMe = (msg.senderId?._id || msg.senderId) === myAccountId;

              return (
                <div
                  key={msg._id || index}
                  className={`flex w-full ${
                    isMe ? "justify-end" : "justify-start"
                  } mb-4 px-2 animate-in fade-in slide-in-from-bottom-2`}
                >
                  <div
                    className={`flex gap-3 max-w-[80%] md:max-w-[70%] ${
                      isMe ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    {!isMe && (
                      <div className="flex-shrink-0 mt-auto mb-6">
                        <img
                          src={msg.senderId?.avatar?.url || defAvatar}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm border border-slate-100"
                          alt="avatar"
                        />
                      </div>
                    )}

                    <div
                      className={`flex flex-col ${
                        isMe ? "items-end" : "items-start"
                      }`}
                    >
                      {/* Tên người gửi (Chỉ hiện cho người khác) */}
                      {!isMe && (
                        <span className="text-[11px] font-bold text-slate-500 ml-1 mb-1 uppercase tracking-tight">
                          {msg.senderId?.displayName}
                        </span>
                      )}

                      {/* Nội dung tin nhắn văn bản */}
                      {msg.message && (
                        <div
                          className={`px-4 py-2.5 rounded-[22px] text-[14.5px] leading-relaxed shadow-sm relative ${
                            isMe
                              ? "bg-blue-600 text-white rounded-br-none shadow-blue-100"
                              : "bg-white text-slate-800 border border-slate-100 rounded-bl-none shadow-slate-50"
                          }`}
                        >
                          {msg.message}
                        </div>
                      )}

                      {/* Media: Image/Video/File */}
                      {msg.media && (
                        <div
                          className={`mt-2 group relative ${
                            isMe ? "flex justify-end" : ""
                          }`}
                        >
                          {/* IMAGE */}
                          {msg.media.type === "image" && (
                            <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
                              <img
                                src={msg.media.url}
                                onClick={() =>
                                  setLightbox({
                                    url: msg.media.url,
                                    type: "image",
                                  })
                                }
                                className="max-h-72 w-full object-contain cursor-pointer bg-slate-50"
                              />
                            </div>
                          )}

                          {/* VIDEO */}
                          {msg.media.type === "video" && (
                            <div
                              className="relative cursor-pointer rounded-2xl overflow-hidden border border-slate-100 shadow-sm transition-transform hover:scale-[1.02] bg-black"
                              onClick={() =>
                                setLightbox({
                                  url: msg.media.url,
                                  type: "video",
                                })
                              }
                            >
                              <video src={msg.media.url} className="max-h-72" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                                  <PlayCircle
                                    className="text-white fill-white"
                                    size={28}
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* FILE */}
                          {msg.media.type === "file" && (
                            <div className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-300 transition-colors">
                              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <FileText size={22} />
                              </div>
                              <div className="flex flex-col min-w-0 pr-2">
                                <span className="text-sm font-bold text-slate-700 truncate max-w-[160px]">
                                  {msg.media.fileName}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  Tài liệu đính kèm
                                </span>
                              </div>
                              <a
                                href={msg.media.url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              >
                                <Download size={18} />
                              </a>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Timestamp */}
                      <span
                        className={`text-[10px] text-slate-400 mt-1.5 font-medium flex items-center gap-1 ${
                          isMe ? "mr-1" : "ml-1"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {isMe && (
                          <div className="w-1 h-1 rounded-full bg-slate-300 ml-1" />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Area */}
        <div className="p-5 bg-white border-t border-slate-100">
          <div className="max-w-5xl mx-auto flex items-end gap-3 relative">
            {showEmoji && (
              <div className="absolute bottom-16 left-0 z-[100]" ref={emojiRef}>
                <EmojiPicker
                  onEmojiClick={(d) => setMessage((p) => p + d.emoji)}
                  width={320}
                  height={400}
                />
              </div>
            )}

            <div className="flex-1 flex items-end gap-2 bg-slate-50 border border-slate-100 p-2.5 px-4 rounded-[26px] focus-within:bg-white transition-all">
              <input
                type="file"
                id="fileChat"
                hidden
                onChange={(e) => onUploadFile(e.target.files[0])}
              />
              <label
                htmlFor="fileChat"
                className="p-2 text-slate-400 cursor-pointer hover:text-blue-600"
              >
                {isUploading ? (
                  <Loader2 className="animate-spin" size={19} />
                ) : (
                  <Paperclip size={19} />
                )}
              </label>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="flex-1 bg-transparent border-none outline-none py-2 text-[14.5px] resize-none max-h-32 min-h-[40px]"
                placeholder="Nhập tin nhắn..."
                rows={1}
              />
              <button
                onClick={() => setShowEmoji(!showEmoji)}
                className="p-2 text-slate-400 hover:text-amber-500"
              >
                <Smile size={22} />
              </button>
            </div>

            <button
              onClick={handleSend}
              disabled={!message.trim() && !isUploading}
              className="p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-lg disabled:opacity-30"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>

      {/* Sidebar Detail */}
      <div
        className={`transition-all duration-500 overflow-hidden border-l border-slate-100 bg-white ${
          showDetails ? "w-[360px]" : "w-0"
        }`}
      >
        <ChatDetailSidebar
          chatData={chatData}
          messages={messages}
          myAccountId={myAccountId}
          isAdmin={isAdmin}
          onClose={() => setShowDetails(false)}
          onConversationUpdated={onConversationUpdated}
          onStartPrivateChat={onStartPrivateChat}
        />
      </div>
    </div>
  );
};

export default ChatWindow;

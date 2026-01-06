import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  SendHorizontal,
  Bot,
  User,
  Trash2,
  MessageSquare,
  CircleDot,
  Loader2,
  Copy,
  Check,
} from "lucide-react";

const API_URL = "http://localhost:3000/api/chatbot";

const ChatBotPage = () => {
  const [userId, setUserId] = useState("user1");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/${userId}`);
      const data = await res.json();
      const formatted = (data.data || []).map((m) => ({
        role: m.isBot ? "bot" : "user",
        content: m.content,
      }));
      setMessages(formatted);
    } catch (error) {
      console.error("Fetch error:", error);
      setMessages([]);
    }
  };

  const getAIResponses = async () => {
    if (!input.trim() || loading) return;

    const userContent = input;
    setMessages((prev) => [...prev, { role: "user", content: userContent }]);
    setInput("");
    setLoading(true);

    const myAccount = JSON.parse(localStorage.getItem(("my_account")))
    try {
      const res = await fetch(`${API_URL}/${myAccount._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userContent }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", content: data.answer }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "⚠️ Đã xảy ra lỗi kết nối với máy chủ AI." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  useEffect(() => {
    fetchMessages();
  }, [userId]);
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#f8fafc] overflow-hidden font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg text-white shadow-md shadow-blue-100">
            <Bot size={22} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 leading-tight">
              Trợ lý AI Đoàn TN
            </h1>
            <div className="flex items-center gap-1.5">
              <CircleDot size={8} className="text-green-500 fill-green-500" />
              <span className="text-[10px] font-semibold text-slate-500 uppercase">
                Sẵn sàng
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <User size={14} className="text-slate-400" />
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer"
            >
              {USERS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div> */}
          <button
            onClick={() => setMessages([])}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Xóa lịch sử"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </header>

      {/* Chat Space */}
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-24 lg:px-64 space-y-6 scroll-smooth">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
            <div className="p-5 bg-white rounded-3xl shadow-sm border border-slate-100">
              <MessageSquare size={48} className="text-blue-100" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-600">Xin chào!</p>
              <p className="text-xs">
                Tôi có thể giúp gì cho bạn về các thủ tục Đoàn?
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            } group`}
          >
            <div
              className={`flex gap-3 max-w-[90%] md:max-w-[80%] ${
                msg.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === "user"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-white border border-slate-200 text-slate-500"
                }`}
              >
                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>

              {/* Message Content */}
              <div className="relative">
                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                  }`}
                >
                  {msg.role === "bot" ? (
                    <div className="prose prose-sm prose-slate max-w-none break-words">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  )}
                </div>

                {/* Copy Button for Bot Messages */}
                {msg.role === "bot" && (
                  <button
                    onClick={() => copyToClipboard(msg.content, index)}
                    className="absolute -right-10 top-0 p-2 text-slate-300 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    {copiedIndex === index ? (
                      <Check size={14} className="text-green-500" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500">
              <Bot size={16} />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-blue-600" />
              <span className="text-xs font-medium text-slate-400">
                AI đang xử lý...
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
        <div className="max-w-4xl mx-auto flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:bg-white focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100/50 transition-all duration-300">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getAIResponses()}
            placeholder="Đặt câu hỏi cho AI..."
            className="flex-1 bg-transparent px-4 py-2.5 outline-none text-sm text-slate-700 placeholder:text-slate-400"
          />
          <button
            onClick={getAIResponses}
            disabled={loading || !input.trim()}
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 shrink-0"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <SendHorizontal size={18} />
            )}
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">
          Powered by Gemini AI • 2026 Assistant
        </p>
      </footer>
    </div>
  );
};

export default ChatBotPage;

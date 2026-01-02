import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ConversationService from "../service/ConversationService";
import ChatWindow from "../component/ChatWindow";
import ChatSidebar from "../component/ChatSidebar";
import socket from "../../../utils/socket";
import { onUpload } from "../../../utils/cloudinary";

const ChatPage = () => {
  // --- STATES ---
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedChatId = searchParams.get("conversationId");
  const selectedChatIdRef = useRef(selectedChatId);

  const myAccount = JSON.parse(localStorage.getItem("my_account") || "{}");
  const myAccountId = myAccount._id;
  const userType = myAccount.type || "user";

  // Đồng bộ ref để socket luôn truy cập được ID mới nhất
  useEffect(() => {
    selectedChatIdRef.current = selectedChatId;
  }, [selectedChatId]);

  // --- LOGIC 1: FETCH DANH SÁCH CHAT ---
  const fetchConversations = useCallback(async () => {
    if (!myAccountId) return;
    try {
      const data = await ConversationService.getMyConversations(myAccountId);
      setConversations(data || []);
    } catch (err) {
      console.error("Lỗi fetch danh sách hội thoại:", err);
    }
  }, [myAccountId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // --- LOGIC 2: FETCH TIN NHẮN CHI TIẾT ---
  const fetchMessages = useCallback(async (id) => {
    if (!id) return;
    try {
      setLoadingMessages(true);
      const res = await ConversationService.getMessages(id);
      if (res.success) setMessages(res.messages || []);
    } catch (err) {
      console.error("Lỗi fetch tin nhắn:", err);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (selectedChatId) {
      fetchMessages(selectedChatId);
    } else {
      setMessages([]);
    }
  }, [selectedChatId, fetchMessages]);

  // --- LOGIC 3: GỬI TIN NHẮN & MEDIA ---
  const handleSendMessage = async (chatId, text, media = null) => {
    if (!text?.trim() && !media) return;
    try {
      const res = await ConversationService.sendMessage(chatId, {
        senderId: myAccountId,
        message: text,
        media,
      });
      if (res.success) {
        // Cập nhật tin nhắn vào khung chat ngay lập tức (Optimistic UI)
        setMessages((prev) => [...prev, res.message]);
        // Cập nhật tin nhắn cuối ở Sidebar
        fetchConversations();
      }
    } catch (err) {
      console.error("Lỗi gửi tin nhắn:", err);
    }
  };

  const handleUploadFile = async (file) => {
    if (!file || !selectedChatId) return;
    try {
      setIsUploading(true);
      const resourceType = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "raw";
      const asset = await onUpload(file, resourceType);
      await handleSendMessage(selectedChatId, "", {
        url: asset.url,
        type: resourceType === "raw" ? "file" : resourceType,
        fileName: file.name
      });
    } catch (err) {
      alert("Lỗi tải lên tệp");
    } finally {
      setIsUploading(false);
    }
  };

  // --- LOGIC 4: SOCKET TẬP TRUNG ---
  useEffect(() => {
    if (!myAccountId) return;

    const handleSocketEvent = (payload) => {
      // 1. Cập nhật Sidebar (Đưa chat có tin nhắn mới lên đầu)
      setConversations((prev) => {
        const chatIndex = prev.findIndex((c) => c._id === payload.conversationId);
        
        if (chatIndex === -1) {
          fetchConversations(); // Chat mới hoàn toàn -> Load lại danh sách
          return prev;
        }

        const updated = [...prev];
        const target = { 
          ...updated[chatIndex], 
          lastMessage: payload, 
          updatedAt: payload.createdAt 
        };

        // Nếu đang mở đúng phòng này thì đánh dấu đã xem qua API
        if (selectedChatIdRef.current === payload.conversationId) {
          ConversationService.seenMessages(payload.conversationId, myAccountId).catch(console.error);
          target.lastMessage.seenBy = [...(payload.seenBy || []), myAccountId];
        }

        updated.splice(chatIndex, 1);
        return [target, ...updated];
      });

      // 2. Cập nhật tin nhắn vào khung chat hiện tại
      if (selectedChatIdRef.current === payload.conversationId) {
        setMessages((prev) => {
          const exists = prev.find(m => m._id === payload._id);
          return exists ? prev : [...prev, payload];
        });
      }
    };

    socket.on("new_message", handleSocketEvent);
    return () => socket.off("new_message", handleSocketEvent);
  }, [myAccountId, fetchConversations]);

  // --- LOGIC 5: XỬ LÝ CHỌN CHAT ---
  const handleSelectChat = async (id) => {
    navigate(`/app/${userType}/chat?conversationId=${id}`);
    try {
      await ConversationService.seenMessages(id, myAccountId);
      // Cập nhật trạng thái "đã xem" cục bộ để UI Sidebar đổi font chữ ngay
      setConversations(prev => 
        prev.map(c => c._id === id 
          ? { ...c, lastMessage: { ...c.lastMessage, seenBy: [...(c.lastMessage?.seenBy || []), myAccountId] } } 
          : c
        )
      );
    } catch (err) {
      console.error("Lỗi đánh dấu đã xem:", err);
    }
  };
const handleStartPrivateChat = async (targetUser) => {
  // 1. Kiểm tra xem đã có hội thoại 1-1 với người này trong danh sách chưa
  // Hội thoại 1-1 thường không có tên (name) và chỉ có 2 thành viên
  const existingChat = conversations.find(c => 
    !c.name && 
    c.members.length === 2 && 
    c.members.some(m => (m._id || m) === targetUser._id)
  );

  if (existingChat) {
    // Nếu đã tồn tại, chỉ cần chọn nó
    handleSelectChat(existingChat._id);
    return;
  }

  // 2. Nếu chưa có, tiến hành tạo mới qua Service
  try {
    // Giả sử API yêu cầu mảng các thành viên gồm mình và người kia
    const res = await ConversationService.createConversation({
      name: "", // Để trống để backend tự hiểu là chat 1-1
      members: [myAccountId, targetUser._id]
    });

    if (res.success) {
      // Cập nhật danh sách hội thoại để Sidebar hiển thị cái mới nhất
      await fetchConversations(); 
      // Chuyển hướng đến hội thoại mới tạo
      handleSelectChat(res.conversation._id);
    }
  } catch (err) {
    console.error("Lỗi khi tạo hội thoại riêng:", err);
    alert("Không thể bắt đầu trò chuyện với người dùng này");
  }
};
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar - Luôn hiển thị */}
      <ChatSidebar
        myAccountId={myAccountId}
        chatList={conversations}
        onSelectChat={handleSelectChat}
      />

      {/* Khung Chat chính */}
      <div className="flex-1 relative bg-white">
        {selectedChatId && conversations.some((c) => c._id === selectedChatId) ? (
          <ChatWindow
            chatData={conversations.find((c) => c._id === selectedChatId)}
            messages={messages}
            loadingMessages={loadingMessages}
            isUploading={isUploading}
            myAccountId={myAccountId}
            onSendMessage={(txt) => handleSendMessage(selectedChatId, txt)}
            onUploadFile={handleUploadFile}
            onConversationUpdated={fetchConversations}
            onStartPrivateChat={handleStartPrivateChat}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-300">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <svg className="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="font-medium text-slate-400">Chọn một hội thoại để bắt đầu trò chuyện</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
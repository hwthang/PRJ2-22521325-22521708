import React, { useState } from "react";
import {
  X,
  Settings,
  Users,
  MessageSquare,
  Trash2,
  FileText,
  Download,
  Image as ImageIcon,
  Play,
  UserPlus,
} from "lucide-react";
import ConversationService from "../service/ConversationService";
import CustomModal from "./CustomModal";

const ChatDetailSidebar = ({
  chatData,
  messages,
  myAccountId,
  isAdmin,
  onClose,
  onStartPrivateChat,
  onConversationUpdated,
}) => {
  // --- States quản lý UI ---
  const [zoomMedia, setZoomMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // States cho các Modals
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMemberId, setNewMemberId] = useState("");

  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);

  // --- Lọc dữ liệu Media & Files ---
  const mediaItems =
    messages?.filter(
      (m) => m.media && (m.media.type === "image" || m.media.type === "video")
    ) || [];
  const fileItems =
    messages?.filter((m) => m.media && m.media.type === "file") || [];

  // --- Logic Xử lý ---

  // 1. Đổi tên nhóm (Xử lý kỹ lỗi mất thành viên)
  const handleRenameSubmit = async () => {
    if (!newName.trim() || newName === chatData.name) {
      setIsRenameOpen(false);
      return;
    }
    try {
      setIsLoading(true);
      const res = await ConversationService.renameConversation(
        chatData._id,
        newName
      );

      if (res.success) {
        // GIẢI PHÁP: Tạo object mới thủ công
        const updatedData = {
          ...chatData, // 1. Giữ toàn bộ dữ liệu hiện tại (bao gồm members có tên/avatar)
          name: res.conversation.name, // 2. CHỈ cập nhật tên mới từ kết quả API
        };

        onConversationUpdated(updatedData);
        setIsRenameOpen(false);
      }
    } catch (err) {
      console.error("Lỗi đổi tên:", err);
      alert("Không thể đổi tên nhóm");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Thêm thành viên
  const handleAddMemberSubmit = async () => {
    if (!newMemberId.trim()) return;
    try {
      setIsLoading(true);
      const res = await ConversationService.addMember(
        chatData._id,
        newMemberId
      );
      if (res.success) {
        // API addMember thường trả về conversation đã update thành viên mới
        onConversationUpdated(res.conversation);
        setIsAddMemberOpen(false);
        setNewMemberId("");
      }
    } catch (err) {
      alert("Không tìm thấy người dùng hoặc người dùng đã có trong nhóm");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Xóa thành viên
  const handleRemoveSubmit = async () => {
    if (!memberToRemove) return;
    try {
      setIsLoading(true);
      const res = await ConversationService.removeMember(
        chatData._id,
        memberToRemove._id
      );
      if (res.success) {
        onConversationUpdated(res.conversation);
        setIsRemoveOpen(false);
      }
    } catch (err) {
      alert("Lỗi thực thi khi xóa thành viên");
    } finally {
      setIsLoading(false);
      setMemberToRemove(null);
    }
  };

  return (
    <aside className="w-full bg-white h-full flex flex-col relative shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)]">
      {/* ================= MODALS SECTION ================= */}

      {/* Modal: Đổi tên */}
      <CustomModal
        isOpen={isRenameOpen}
        onClose={() => setIsRenameOpen(false)}
        title="Đổi tên nhóm"
        onConfirm={handleRenameSubmit}
        isLoading={isLoading}
      >
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
            Tên nhóm mới
          </label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all"
            placeholder="Nhập tên mới..."
            autoFocus
          />
        </div>
      </CustomModal>

      {/* Modal: Thêm thành viên */}
      <CustomModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        title="Thêm thành viên"
        confirmText="Thêm ngay"
        onConfirm={handleAddMemberSubmit}
        isLoading={isLoading}
      >
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
            Mã số (ID) người dùng
          </label>
          <input
            type="text"
            value={newMemberId}
            onChange={(e) => setNewMemberId(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all"
            placeholder="Nhập ID người dùng..."
            autoFocus
          />
        </div>
      </CustomModal>

      {/* Modal: Xác nhận xóa thành viên */}
      <CustomModal
        isOpen={isRemoveOpen}
        onClose={() => setIsRemoveOpen(false)}
        title="Xác nhận xóa"
        confirmText="Xác nhận xóa"
        onConfirm={handleRemoveSubmit}
        isLoading={isLoading}
      >
        <p className="text-slate-600 leading-relaxed">
          Bạn có chắc chắn muốn mời{" "}
          <span className="font-bold text-slate-900">
            {memberToRemove?.displayName}
          </span>{" "}
          rời khỏi nhóm này không?
        </p>
      </CustomModal>

      {/* Lightbox Media Zoom */}
      {zoomMedia && (
        <div
          className="fixed inset-0 z-[1000] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200"
          onClick={() => setZoomMedia(null)}
        >
          <button className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors">
            <X size={32} />
          </button>
          <div
            className="max-w-5xl max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {zoomMedia.type === "image" ? (
              <img
                src={zoomMedia.url}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                alt="Zoom"
              />
            ) : (
              <video
                src={zoomMedia.url}
                controls
                autoPlay
                className="max-w-full max-h-full rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
              />
            )}
          </div>
        </div>
      )}

      {/* ================= UI HEADER ================= */}
      <div className="px-6 py-5 flex justify-between items-center border-b border-slate-50">
        <h3 className="font-bold text-slate-800 text-[13px] uppercase tracking-[0.15em]">
          Thông tin cuộc họp
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
        {/* PROFILE CARD */}
        <div className="py-10 px-6 text-center border-b border-slate-50">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-3xl font-bold shadow-xl shadow-blue-100 ring-4 ring-white">
              {(chatData.name || "C").charAt(0)}
            </div>
            {isAdmin && (
              <button
                onClick={() => {
                  setNewName(chatData.name || "");
                  setIsRenameOpen(true);
                }}
                className="absolute -bottom-1 -right-1 p-2 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-600 hover:text-blue-600 transition-all hover:scale-110"
              >
                <Settings size={14} />
              </button>
            )}
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
            {chatData.name || "Cuộc trò chuyện"}
          </h2>
        </div>

        {/* MEMBER LIST SECTION */}
        <div className="p-6 border-b border-slate-50">
          <div className="flex justify-between items-center mb-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] flex items-center gap-2">
              <Users size={14} className="text-blue-500" /> Thành viên (
              {chatData.members?.length || 0})
            </p>
            {isAdmin && (
              <button
                onClick={() => setIsAddMemberOpen(true)}
                className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
              >
                <UserPlus size={16} />
              </button>
            )}
          </div>

          <div className="space-y-5">
            {chatData.members?.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={
                        member.avatar ||
                        `https://ui-avatars.com/api/?name=${
                          member.fullname || "U"
                        }&background=f1f5f9&color=64748b`
                      }
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-transparent group-hover:ring-blue-50 transition-all"
                      alt={member.displayName}
                    />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 leading-none mb-1">
                      {member._id === myAccountId
                        ? `Bạn`
                        : member.displayName || "Người dùng"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Thành viên nhóm
                    </span>
                  </div>
                </div>

                {/* Actions cho từng member */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                  {member._id !== myAccountId && (
                    <button
                      onClick={() => onStartPrivateChat(member)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Nhắn tin riêng"
                    >
                      <MessageSquare size={16} />
                    </button>
                  )}
                  {isAdmin && member._id !== myAccountId && (
                    <button
                      onClick={() => {
                        setMemberToRemove(member);
                        setIsRemoveOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
                      title="Xóa khỏi nhóm"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SHARED MEDIA SECTION */}
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <div className="flex justify-between items-center mb-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] flex items-center gap-2">
              <ImageIcon size={14} className="text-amber-500" /> Media đã gửi (
              {mediaItems.length})
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {mediaItems.slice(0, 6).map((item, idx) => (
              <div
                key={idx}
                className="aspect-square bg-slate-200 rounded-xl overflow-hidden group cursor-pointer relative shadow-sm"
                onClick={() =>
                  setZoomMedia({ url: item.media.url, type: item.media.type })
                }
              >
                {item.media.type === "image" ? (
                  <img
                    src={item.media.url}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt=""
                  />
                ) : (
                  <div className="w-full h-full relative">
                    <video
                      src={item.media.url}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                      <Play className="text-white fill-white" size={16} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SHARED FILES SECTION */}
        <div className="p-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-4 flex items-center gap-2">
            <FileText size={14} className="text-indigo-500" /> Tệp đính kèm (
            {fileItems.length})
          </p>
          <div className="space-y-3">
            {fileItems.slice(0, 5).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-[16px] hover:border-blue-100 transition-all group/file shadow-sm shadow-slate-100/50"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="p-2.5 bg-slate-50 text-slate-500 group-hover/file:bg-blue-50 group-hover/file:text-blue-600 rounded-xl transition-colors">
                    <FileText size={16} />
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-xs font-bold text-slate-700 truncate max-w-[140px]">
                      {item.media.fileName}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                      Tài liệu
                    </span>
                  </div>
                </div>
                <a
                  href={item.media.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-slate-300 hover:text-blue-600 transition-colors"
                >
                  <Download size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ChatDetailSidebar;

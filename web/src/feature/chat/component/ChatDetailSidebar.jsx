import React, { useState, useMemo, useEffect } from "react";
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
  Search,
  Check,
  Loader2,
} from "lucide-react";
import ConversationService from "../service/ConversationService";
import CustomModal from "./CustomModal";
import DefaultAvatar from "../../../core/assets/images/avatar.png";
import { defAvatar } from "../../../core/assets/images";
import apiClient from "../../../utils/api";
import customCache from "../../../utils/customCache";

const ChatDetailSidebar = ({
  chatData,
  messages,
  myAccountId,
  isAdmin,
  onClose,
  onStartPrivateChat,
  onConversationUpdated,
}) => {
  const [zoomMedia, setZoomMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [memberSearchTerm, setMemberSearchTerm] = useState("");

  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);

  // Lấy và lưu loại tài khoản để kiểm tra quyền Quản trị viên
  const myAccountType = useMemo(() => {
    try {
      const account = JSON.parse(localStorage.getItem("my_account"));
      return account?.type;
    } catch (e) {
      return null;
    }
  }, []);

  // API Tìm kiếm người dùng để thêm vào nhóm
  useEffect(() => {
    if (!isAddMemberOpen) return;
    let active = true;

    const fetchUsers = async () => {
      try {
        setIsSearching(true);
        const { success, data } = await apiClient.get("/api/members");
        if (!active) return;

        const myAccount = customCache.myAccount.get();
        const chapterId = myAccount?.chapter?._id;

        if (success && data?.members) {
          let res = data.members.filter(
            (item) => item.chapterId?._id === chapterId
          );

          if (userSearchTerm.trim()) {
            const term = userSearchTerm.toLowerCase();
            res = res.filter(
              (u) =>
                u.accountId?.displayName?.toLowerCase().includes(term) ||
                u.position?.toLowerCase().includes(term)
            );
          }

          const existingMemberIds = chatData.members?.map((m) => m._id) || [];
          const filtered = res.filter(
            (u) =>
              u.accountId &&
              !existingMemberIds.includes(u.accountId._id) &&
              u.accountId._id !== myAccountId
          );
          setAvailableUsers(filtered);
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách người dùng:", err);
      } finally {
        if (active) setIsSearching(false);
      }
    };

    const timer = setTimeout(fetchUsers, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [userSearchTerm, isAddMemberOpen, chatData.members, myAccountId]);

  // Xử lý đổi tên nhóm
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
        onConversationUpdated({ ...chatData, name: res.conversation.name });
        setIsRenameOpen(false);
      }
    } catch (err) {
      alert("Không thể đổi tên nhóm");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý thêm thành viên
  const handleAddMemberSubmit = async () => {
    if (!selectedUserId) return;
    try {
      setIsLoading(true);
      const res = await ConversationService.addMember(
        chatData._id,
        selectedUserId
      );
      if (res.success) {
        onConversationUpdated(res.conversation);
        setIsAddMemberOpen(false);
        setSelectedUserId(null);
        setUserSearchTerm("");
      }
    } catch (err) {
      alert("Lỗi khi thêm thành viên");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý xóa thành viên
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
      alert("Lỗi khi xóa thành viên");
    } finally {
      setIsLoading(false);
      setMemberToRemove(null);
    }
  };

  // Lọc danh sách thành viên hiện tại trong nhóm
  const filteredMembers = useMemo(() => {
    if (!chatData.members) return [];
    const term = memberSearchTerm.toLowerCase();
    return chatData.members.filter((m) =>
      (m.displayName || m.fullname || "").toLowerCase().includes(term)
    );
  }, [chatData.members, memberSearchTerm]);

  const mediaItems = useMemo(
    () =>
      messages?.filter(
        (m) => m.media && (m.media.type === "image" || m.media.type === "video")
      ) || [],
    [messages]
  );
  const fileItems = useMemo(
    () => messages?.filter((m) => m.media && m.media.type === "file") || [],
    [messages]
  );

  return (
    <aside className="w-full bg-white h-full flex flex-col relative shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)] border-l border-slate-100">
      
      {/* MODAL THÊM THÀNH VIÊN - FIXED HEIGHT */}
      <CustomModal
        isOpen={isAddMemberOpen}
        onClose={() => {
          setIsAddMemberOpen(false);
          setSelectedUserId(null);
          setUserSearchTerm("");
        }}
        title="Thêm thành viên"
        onConfirm={handleAddMemberSubmit}
        isLoading={isLoading}
        disabled={!selectedUserId}
      >
        <div className="flex flex-col h-[450px]">
          <div className="relative mb-4">
            {isSearching ? (
              <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" size={16} />
            ) : (
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            )}
            <input
              type="text"
              placeholder="Tìm theo tên hoặc chức vụ..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all"
            />
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-1">
            {availableUsers.length > 0 ? (
              availableUsers.map((user) => (
                <div
                  key={user.accountId._id}
                  onClick={() => setSelectedUserId(user.accountId._id)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border-2 ${
                    selectedUserId === user.accountId._id
                      ? "border-blue-500 bg-blue-50"
                      : "border-transparent hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.accountId?.avatar?.url || defAvatar}
                      className="w-11 h-11 rounded-full object-cover shadow-sm ring-2 ring-white"
                      alt=""
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">
                        {user.accountId?.displayName}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {user.position || "Thành viên"}
                      </span>
                    </div>
                  </div>
                  {selectedUserId === user.accountId._id && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white">
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}
                </div>
              ))
            ) : (
              !isSearching && (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
                  Không tìm thấy kết quả phù hợp
                </div>
              )
            )}
          </div>
        </div>
      </CustomModal>

      {/* MODAL ĐỔI TÊN - FIXED HEIGHT */}
      <CustomModal
        isOpen={isRenameOpen}
        onClose={() => setIsRenameOpen(false)}
        title="Đổi tên nhóm"
        onConfirm={handleRenameSubmit}
        isLoading={isLoading}
      >
        <div className="h-[120px] flex flex-col justify-center space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
            Tên nhóm mới
          </label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none transition-all"
            autoFocus
          />
        </div>
      </CustomModal>

      {/* MODAL XÓA - FIXED HEIGHT */}
      <CustomModal
        isOpen={isRemoveOpen}
        onClose={() => setIsRemoveOpen(false)}
        title="Xác nhận xóa"
        onConfirm={handleRemoveSubmit}
        isLoading={isLoading}
      >
        <div className="h-[80px] flex items-center">
          <p className="text-slate-600">
            Bạn có chắc muốn mời{" "}
            <span className="font-bold text-slate-900">
              {memberToRemove?.displayName}
            </span>{" "}
            rời khỏi nhóm?
          </p>
        </div>
      </CustomModal>

      {/* ZOOM MEDIA */}
      {zoomMedia && (
        <div
          className="fixed inset-0 z-[1000] bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in"
          onClick={() => setZoomMedia(null)}
        >
          <button className="absolute top-8 right-8 text-white/70 hover:text-white">
            <X size={32} />
          </button>
          <div className="max-w-5xl max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            {zoomMedia.type === "image" ? (
              <img
                src={zoomMedia.url}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border-4 border-white/10"
                alt="Zoom"
              />
            ) : (
              <video
                src={zoomMedia.url}
                controls
                autoPlay
                className="max-w-full max-h-full rounded-lg shadow-2xl"
              />
            )}
          </div>
        </div>
      )}

      {/* SIDEBAR HEADER */}
      <div className="px-6 py-5 flex justify-between items-center border-b border-slate-50">
        <h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-[0.2em]">
          Thông tin chi tiết
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
        {/* GROUP INFO */}
        <div className="py-10 px-6 text-center border-b border-slate-50">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-[32px] overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl ring-4 ring-white">
              <img
                src={chatData.avatar?.url || defAvatar}
                className="w-full h-full object-cover"
                alt="Group"
              />
            </div>
            {isAdmin && (
              <button
                onClick={() => {
                  setNewName(chatData.name || "");
                  setIsRenameOpen(true);
                }}
                className="absolute -bottom-1 -right-1 p-2 bg-white border rounded-xl shadow-sm text-slate-600 hover:text-blue-600 transition-all hover:scale-110"
              >
                <Settings size={14} />
              </button>
            )}
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
            {chatData.name || "Cuộc trò chuyện"}
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">
            Group Conversation
          </p>
        </div>

        {/* MEMBERS LIST */}
        <div className="p-6 border-b border-slate-50">
          <div className="flex justify-between items-center mb-4">
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
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Tìm thành viên..."
              value={memberSearchTerm}
              onChange={(e) => setMemberSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-200"
            />
          </div>
          <div className="space-y-5">
            {filteredMembers.map((member) => (
              <div key={member._id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={member.avatar?.url || DefaultAvatar}
                      className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-100"
                      alt=""
                    />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 leading-none mb-1">
                      {member._id === myAccountId ? "Bạn" : member.displayName || "Người dùng"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium tracking-tight">
                      {chatData.members?.length > 2 &&
                      member._id === myAccountId &&
                      myAccountType === "chapter"
                        ? "Quản trị viên"
                        : "Thành viên nhóm"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  {member._id !== myAccountId && (
                    <button
                      onClick={() => onStartPrivateChat(member)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
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
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MEDIA SECTION */}
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-4 flex items-center gap-2">
            <ImageIcon size={14} className="text-amber-500" /> Ảnh & Video (
            {mediaItems.length})
          </p>
          <div className="grid grid-cols-3 gap-2">
            {mediaItems.slice(0, 6).map((item, idx) => (
              <div
                key={idx}
                className="aspect-square bg-slate-200 rounded-xl overflow-hidden group cursor-pointer relative"
                onClick={() => setZoomMedia({ url: item.media.url, type: item.media.type })}
              >
                {item.media.type === "image" ? (
                  <img
                    src={item.media.url}
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                    alt=""
                  />
                ) : (
                  <div className="w-full h-full relative">
                    <video src={item.media.url} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40">
                      <Play className="text-white fill-white" size={16} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FILES SECTION */}
        <div className="p-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-4 flex items-center gap-2">
            <FileText size={14} className="text-indigo-500" /> Tệp đính kèm ({fileItems.length})
          </p>
          <div className="space-y-3">
            {fileItems.slice(0, 5).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-2xl hover:border-blue-100 group shadow-sm transition-all"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="p-2.5 bg-slate-50 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 rounded-xl">
                    <FileText size={16} />
                  </div>
                  <div className="flex flex-col truncate pr-4">
                    <span className="text-xs font-bold text-slate-700 truncate max-w-[140px]">
                      {item.media.fileName}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                      Tài liệu
                    </span>
                  </div>
                </div>
                <a
                  href={item.media.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-slate-300 hover:text-blue-600"
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
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  ImageIcon,
  X,
  Loader2,
  MoreHorizontal,
  Trash2,
  Edit3,
  AlertCircle,
  Smile,
  User,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-toastify";
import EventService from "../service/EventService";
import { onUpload } from "../../../utils/cloudinary.js";
import { formatRelativeTime } from "../../../utils/date.js";
import { base_url } from "../../../utils/api.js";

const CommentSection = ({ postId, initialComments = [] }) => {
  // --- States ---
  const [comments, setComments] = useState(initialComments);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [myAccountId, setMyAccountId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // --- Refs ---
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);
  const emojiRef = useRef(null);
  const textareaRef = useRef(null);

  // --- Initialization ---
  useEffect(() => {
    const stored = localStorage.getItem("my_account");
    if (stored) {
      try {
        const acc = JSON.parse(stored);
        setMyAccountId(acc?._id);
      } catch (err) {
        console.error("Auth error:", err);
      }
    }
    fetchComments();
  }, [postId]);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setActiveMenu(null);
      if (emojiRef.current && !emojiRef.current.contains(e.target))
        setShowEmojiPicker(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Logic Functions ---
  const fetchComments = async () => {
    if (!postId) return;
    try {
      const res = await EventService.getCommentByPostId(postId);
      const data = res?.data?.comments || res || [];
      setComments(
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    } catch (err) {
      toast.error("Không thể tải danh sách bình luận");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      toast.error("Vui lòng chọn tệp ảnh hợp lệ");
    }
  };

  const clearForm = () => {
    setCommentText("");
    setEditingCommentId(null);
    setSelectedImage(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setShowEmojiPicker(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const checkBeforeSubmit = async (payload) => {
    try {
      const res = await fetch(`${base_url}/check-content`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
     const json = await res.json()
      return json;
    } catch (err) {
      toast.error("Không thể kiểm duyệt nội dung lúc này");
      return { success: false };
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!commentText.trim() && !selectedImage) return;

    setIsSubmitting(true);

    try {
      // 1️⃣ Chuẩn bị payload kiểm duyệt (CHƯA upload ảnh)
      const moderationPayload = {
        content: commentText,
        image: selectedImage ? "image_attached" : null,
      };

      // 2️⃣ GỌI API KIỂM DUYỆT
      const moderationRes = await checkBeforeSubmit(moderationPayload);

      if (!moderationRes?.success) {
        toast.error(moderationRes?.message || "Nội dung không hợp lệ");
        setIsSubmitting(false);
        return; // ❌ DỪNG TẠI ĐÂY
      }

      // 3️⃣ SAU KHI HỢP LỆ → upload ảnh
      let uploadedImage = null;
      if (selectedImage) {
        uploadedImage = await onUpload(selectedImage);
      }

      // 4️⃣ Tạo payload comment thật
      const payload = {
        comment: commentText,
        image: uploadedImage,
      };

      // 5️⃣ Create / Update comment
      if (editingCommentId) {
        await EventService.updateComment(editingCommentId, payload);
        toast.success("Cập nhật thành công");
      } else {
        await EventService.createComment(postId, payload);
        toast.success("Đã đăng bình luận");
      }

      clearForm();
      fetchComments();
    } catch (err) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) return;
    try {
      await EventService.deleteComment(id);
      setComments((prev) => prev.filter((c) => c._id !== id));
      toast.success("Đã xóa");
    } catch {
      toast.error("Không thể xóa lúc này");
    }
  };

  // --- Render Helpers ---
  const onEmojiClick = (emojiData) => {
    setCommentText((prev) => prev + emojiData.emoji);
    textareaRef.current?.focus();
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* FORM: INPUT AREA */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 ring-8 ring-slate-50/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
          <h3 className="font-black text-slate-800 uppercase tracking-tighter text-sm">
            {editingCommentId ? "Chỉnh sửa phản hồi" : "Thảo luận sự kiện"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <textarea
              ref={textareaRef}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhấn Enter để gửi, Shift + Enter để xuống dòng..."
              className="w-full min-h-[120px] bg-slate-50 rounded-2xl p-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white border-2 border-transparent focus:border-blue-100 transition-all resize-none shadow-inner"
            />

            {/* Emoji & Image Toggle */}
            <div className="absolute right-4 bottom-4 flex items-center gap-2">
              <div className="relative" ref={emojiRef}>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`p-2 rounded-full transition-colors ${
                    showEmojiPicker
                      ? "bg-blue-100 text-blue-600"
                      : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  }`}
                >
                  <Smile size={20} />
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-full right-0 mb-4 z-[100] shadow-2xl rounded-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
                    <EmojiPicker
                      onEmojiClick={onEmojiClick}
                      width={320}
                      height={400}
                      theme="light"
                      searchPlaceholder="Tìm cảm xúc..."
                    />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-all"
              >
                <ImageIcon size={20} />
              </button>
            </div>
          </div>

          {/* Preview Image */}
          {imagePreview && (
            <div className="relative inline-block group/preview">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={imagePreview}
                  className="w-full h-full object-cover"
                  alt="upload"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedImage(null);
                  setImagePreview(null);
                }}
                className="absolute -top-2 -right-2 bg-rose-500 text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-50">
            <p className="text-[11px] text-slate-400 font-medium italic">
              Quy tắc: Không dùng ngôn từ gây thù ghét.
            </p>
            <div className="flex items-center gap-3">
              {editingCommentId && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="px-6 py-2.5 text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest"
                >
                  Hủy bỏ
                </button>
              )}
              <button
                type="submit"
                disabled={
                  isSubmitting || (!commentText.trim() && !selectedImage)
                }
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-8 py-2.5 rounded-xl flex items-center gap-2 font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-200 active:scale-95 transition-all"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                {editingCommentId ? "Lưu thay đổi" : "Gửi bình luận"}
              </button>
            </div>
          </div>
          <input
            hidden
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </form>
      </div>

      {/* LIST: COMMENTS FEED */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-16 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100 text-slate-300">
              <Smile size={32} />
            </div>
            <p className="text-slate-400 text-sm font-medium">
              Chưa có thảo luận nào. Hãy bắt đầu ngay!
            </p>
          </div>
        ) : (
          comments.map((item) => {
            const isMyComment =
              String(item.accountId?._id || item.accountId) ===
              String(myAccountId);
            return (
              <div
                key={item._id}
                className="group relative flex gap-4 animate-in slide-in-from-left-4 duration-500"
              >
                {/* Avatar Area */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                    {item.accountId?.avatar ? (
                      <img
                        src={item.accountId.avatar}
                        className="w-full h-full object-cover"
                        alt="avatar"
                      />
                    ) : (
                      <User className="text-slate-400" size={24} />
                    )}
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                  <div className="bg-white p-5 rounded-3xl rounded-tl-none border border-slate-100 shadow-sm group-hover:shadow-md group-hover:border-blue-100 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-black text-slate-800 text-[13px] flex items-center gap-2 uppercase tracking-tight">
                          {item.accountId?.displayName || "Thành viên"}
                          {isMyComment && (
                            <span className="bg-emerald-50 text-emerald-600 text-[9px] px-2 py-0.5 rounded-md border border-emerald-100 font-bold">
                              Bạn
                            </span>
                          )}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          {formatRelativeTime(item.createdAt)}
                        </span>
                      </div>

                      {/* Dropdown Menu */}
                      <div
                        className="relative"
                        ref={activeMenu === item._id ? menuRef : null}
                      >
                        <button
                          onClick={() =>
                            setActiveMenu(
                              activeMenu === item._id ? null : item._id
                            )
                          }
                          className="p-1.5 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
                        >
                          <MoreHorizontal size={18} />
                        </button>
                        {activeMenu === item._id && (
                          <div className="absolute right-0 mt-2 w-44 bg-white shadow-2xl rounded-2xl border border-slate-100 z-50 py-2 overflow-hidden animate-in zoom-in-95">
                            {isMyComment ? (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingCommentId(item._id);
                                    setCommentText(item.comment);
                                    setActiveMenu(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Edit3 size={14} /> Chỉnh sửa
                                </button>
                                <button
                                  onClick={() => handleDelete(item._id)}
                                  className="w-full px-4 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-50"
                                >
                                  <Trash2 size={14} /> Xóa bình luận
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => {
                                  toast.info("Đã gửi báo cáo");
                                  setActiveMenu(null);
                                }}
                                className="w-full px-4 py-2.5 text-xs font-bold text-amber-600 hover:bg-amber-50 flex items-center gap-2"
                              >
                                <AlertCircle size={14} /> Báo cáo nội dung
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-medium">
                      {item.comment}
                    </p>

                    {item.image?.url && (
                      <div className="mt-4 rounded-2xl overflow-hidden border border-slate-50 shadow-sm inline-block">
                        <img
                          src={item.image.url}
                          className="max-h-[350px] w-auto object-contain bg-slate-50"
                          alt="attachment"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommentSection;

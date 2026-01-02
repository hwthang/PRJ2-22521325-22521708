import React, { useState, useRef } from "react";
import { Send, Image as ImageIcon, X } from "lucide-react";
import { defAvatar } from "../../../core/assets/images";
import { onUpload } from "../../../utils/cloudinary";
import apiClient from "../../../utils/api";

const CommentSection = ({ open, avatar = defAvatar }) => {
  const [comments, setComments] = useState(
    [...Array(5)].map((_, i) => ({
      id: i + 1,
      author: `Người dùng ${i + 1}`,
      content: `Đây là bình luận số ${i + 1}.`,
      imageUrl: null,
    }))
  );

  const [input, setInput] = useState("");
  const [pendingImage, setPendingImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [moderationError, setModerationError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // ⭐ popup thành công

  const fileInputRef = useRef(null);

  // ==========================
  // HÀM GỌI API KIỂM DUYỆT
  // ==========================
  const moderateContent = async (payload) => {
    const response = await apiClient.post("/", payload);
    // tuỳ theo cấu trúc apiClient, nếu response.data mới là payload:
    // return response.data;
    return response;
  };

  // ==========================
  // UPLOAD ẢNH COMMENT
  // ==========================
  const handleSelectImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const asset = await onUpload(file, "image");
      setPendingImage(asset);
    } catch (err) {
      console.error("Upload comment image error:", err);
      setModerationError(err?.message || "Upload hình ảnh thất bại");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setPendingImage(null);
  };

  // ==========================
  // GỬI BÌNH LUẬN (TEXT + IMAGE)
  // ==========================
  const handleComment = async () => {
    const text = input.trim();
    const imageUrl = pendingImage?.url;

    if (!text && !imageUrl) return;

    try {
      setSubmitting(true);
      setModerationError(null);
      setSuccessMessage(null);

      // 1. kiểm duyệt TEXT nếu có
      if (text) {
        const res = await moderateContent({
          type: "text",
          data: text,
        });

        const result = res.data || res; // tuỳ apiClient mà lấy data cho đúng
        if (!result.success) {
          setModerationError(
            result.message || "Nội dung bình luận không hợp lệ."
          );
          return;
        }
      }

      // 2. kiểm duyệt IMAGE nếu có
      if (imageUrl) {
        const res = await moderateContent({
          type: "imageUrl",
          data: imageUrl,
        });

        const result = res.data || res;
        if (!result.success) {
          setModerationError(result.message || "Hình ảnh không hợp lệ.");
          return;
        }
      }

      // 3. Nếu qua kiểm duyệt thì thêm comment
      const newComment = {
        id: Date.now(),
        author: "Bạn",
        content: text || "",
        imageUrl: imageUrl || null,
      };

      setComments((prev) => [newComment, ...prev]);
      setInput("");
      setPendingImage(null);

      // ⭐ Popup thành công
      setSuccessMessage("Bình luận của bạn đã được gửi và chấp thuận.");
    } catch (err) {
      console.error("Comment error:", err);
      setModerationError(
        err?.message || "Có lỗi xảy ra khi gửi bình luận."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleComment();
    }
  };

  if (!open) return null;

  const disableSend =
    submitting || uploading || (!input.trim() && !pendingImage);

  return (
    <div className="mt-4 animate-fadeIn">
      {/* Modal cảnh báo kiểm duyệt */}
      {moderationError && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-sm">
            <h3 className="font-semibold text-red-600 mb-2">
              Cảnh báo kiểm duyệt
            </h3>
            <p className="text-sm text-gray-700 mb-4">{moderationError}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setModerationError(null)}
                className="px-4 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal thông báo thành công */}
      {successMessage && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-sm border border-green-200">
            <h3 className="font-semibold text-green-600 mb-2">
              Gửi bình luận thành công
            </h3>
            <p className="text-sm text-gray-700 mb-4">{successMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setSuccessMessage(null)}
                className="px-4 py-1.5 text-sm rounded bg-green-600 text-white hover:bg-green-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input comment */}
      <div className="flex items-start gap-3 mb-4">
        <img
          src={avatar}
          className="h-9 w-9 rounded-full object-cover mt-1"
          alt="avatar"
        />

        <div className="flex-1">
          {/* Text + actions */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Viết bình luận..."
              className="flex-1 bg-transparent text-sm focus:outline-none"
            />

            {/* Nút chọn ảnh */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-full hover:bg-gray-200 transition"
              title="Đính kèm ảnh"
            >
              <ImageIcon size={16} className="text-gray-600" />
            </button>

            {/* Input file ẩn */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleSelectImage}
            />

            {/* Nút gửi */}
            <button
              onClick={handleComment}
              disabled={disableSend}
              className="p-1.5 rounded-full hover:bg-gray-200 transition disabled:opacity-50"
            >
              <Send
                size={16}
                className={disableSend ? "text-gray-400" : "text-blue-600"}
              />
            </button>
          </div>

          {/* Preview ảnh chuẩn bị gửi */}
          {pendingImage && (
            <div className="mt-2 inline-flex items-center gap-2 bg-gray-100 rounded-xl p-2">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                <img
                  src={pendingImage.url}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
                {uploading && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="text-xs text-white">Đang upload...</span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="p-1 rounded-full hover:bg-gray-200"
                title="Xoá ảnh"
              >
                <X size={14} className="text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comment List */}
      <div className="space-y-3">
        {comments.map((cmt) => (
          <div key={cmt.id} className="flex gap-3">
            <img
              src={avatar}
              className="h-8 w-8 rounded-full object-cover"
              alt="avatar"
            />
            <div className="bg-gray-100 px-3 py-2 rounded-xl shadow-sm max-w-full">
              <div className="font-semibold text-sm">{cmt.author}</div>
              {cmt.content && (
                <div className="text-sm text-gray-700 whitespace-pre-line">
                  {cmt.content}
                </div>
              )}
              {cmt.imageUrl && (
                <div className="mt-2">
                  <img
                    src={cmt.imageUrl}
                    alt="comment-attachment"
                    className="max-h-48 rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;

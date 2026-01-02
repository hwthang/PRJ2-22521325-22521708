import React, { useState, useEffect, useCallback } from "react";
import EventService from "../service/EventService";
import { Trash2, AlertTriangle, User, MessageSquare, Clock, ShieldCheck } from "lucide-react";

const CommentManagerSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hàm tải danh sách bình luận
  const fetchComments = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const res = await EventService.getCommentByPostId(postId);
      const data = res.data?.comments || res.data || [];
      setComments(data);
    } catch (error) {
      console.error("Lỗi khi tải bình luận:", error);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Hàm xóa bình luận (Dành cho Quản lý - Xóa bất kỳ ai)
  const handleDelete = async (commentId) => {
    if (window.confirm("HÀNH ĐỘNG QUẢN TRỊ: Bạn có chắc chắn muốn xóa bình luận này không?")) {
      try {
        await EventService.deleteComment(commentId);
        // Cập nhật UI ngay lập tức
        setComments(comments.filter((c) => c._id !== commentId));
        alert("Đã xóa bình luận thành công.");
      } catch (error) {
        alert("Lỗi: Không thể xóa bình luận. Vui lòng thử lại sau.");
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mt-8">
      {/* Header Quản Lý */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 rounded-lg">
            <ShieldCheck size={20} className="text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Quản lý bình luận</h3>
            <p className="text-xs text-gray-500">Tổng cộng {comments.length} đóng góp từ người dùng</p>
          </div>
        </div>
        <button 
          onClick={fetchComments}
          className="text-xs font-medium text-blue-600 hover:underline"
        >
          Làm mới
        </button>
      </div>

      {/* Danh sách bình luận */}
      <div className="divide-y divide-gray-100 max-h-[700px] overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium text-sm">Đang đồng bộ dữ liệu...</p>
          </div>
        ) : comments.length > 0 ? (
          comments.map((item) => (
            <div key={item._id} className="p-5 group hover:bg-red-50/20 transition-all duration-200">
              <div className="flex gap-4">
                {/* Avatar người dùng */}
                <div className="h-12 w-12 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0 shadow-sm border border-white">
                  {item.accountId?.avatar?.path ? (
                    <img src={item.accountId.avatar.path} alt="avt" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <User size={20} />
                    </div>
                  )}
                </div>

                {/* Nội dung chính */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="mb-2">
                      <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        {item.accountId?.displayName || "Người dùng ẩn danh"}
                        {item.reports > 0 && (
                          <span className="flex items-center gap-1 bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded-full uppercase">
                            <AlertTriangle size={10} /> {item.reports} Báo cáo
                          </span>
                        )}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <Clock size={12} />
                        <span>{new Date(item.createdAt).toLocaleString("vi-VN")}</span>
                      </div>
                    </div>

                    {/* Nút Xóa luôn hiển thị cho Quản lý */}
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-100 text-red-600 rounded-lg text-xs font-bold shadow-sm hover:bg-red-600 hover:text-white transition-all duration-200"
                    >
                      <Trash2 size={14} />
                      Xóa nội dung
                    </button>
                  </div>

                  {/* Bubble text */}
                  <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm inline-block min-w-[200px] max-w-full">
                    <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">
                      {item.comment}
                    </p>

                    {/* Ảnh đính kèm */}
                    {item.image?.url && (
                      <div className="mt-3 relative group/img cursor-zoom-in">
                        <img 
                          src={item.image.url} 
                          alt="attach" 
                          className="rounded-lg max-h-80 w-auto border border-gray-100"
                          onClick={() => window.open(item.image.url, "_blank")}
                        />
                        <div className="absolute inset-0 bg-black/5 group-hover/img:bg-transparent transition-all pointer-events-none rounded-lg" />
                      </div>
                    )}
                  </div>
                  
                  {/* Meta data ẩn cho quản lý */}
                  <div className="mt-2 text-[10px] text-gray-400 italic">
                    ID: {item._id} | User ID: {item.accountId?._id || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-20 flex flex-col items-center justify-center text-gray-400 gap-4">
             <MessageSquare size={40} className="text-gray-200" />
             <p className="text-sm italic">Không có bình luận nào cần quản lý.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentManagerSection;
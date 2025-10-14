import React, { useState } from "react";
import { EllipsisVertical } from "lucide-react";

export default function Comment({ comments, onAddComment }) {
  const [newComment, setNewComment] = useState("");
  const [openMenu, setOpenMenu] = useState(null); // theo dõi menu đang mở

  const handleAdd = () => {
    if (!newComment.trim()) return;
    onAddComment(newComment);
    setNewComment("");
  };

  return (
    <div className="mt-3 border-t border-gray-200 pt-3">
      {/* Danh sách bình luận */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm">Chưa có bình luận nào.</p>
        ) : (
          comments.map((cmt, i) => (
            <div key={i} className="flex gap-3 items-start relative group">
              <img
                src={cmt.avatar}
                alt={cmt.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="bg-gray-100 rounded-xl px-3 py-2 flex-1">
                <p className="text-sm font-medium text-gray-800">{cmt.name}</p>
                <p className="text-sm text-gray-600">{cmt.text}</p>
              </div>

              {/* Dấu ba chấm */}
              <button
                onClick={() => setOpenMenu(openMenu === i ? null : i)}
                className="p-1 rounded-full hover:bg-gray-200 transition"
              >
                <EllipsisVertical className="w-4 h-4 text-gray-500" />
              </button>

              {/* Menu Báo cáo */}
              {openMenu === i && (
                <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-md text-sm w-28 z-10">
                  <button
                    onClick={() => {
                      alert(`Đã báo cáo bình luận của ${cmt.name}`);
                      setOpenMenu(null);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 text-red-500"
                  >
                    Báo cáo
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Ô nhập bình luận */}
      <div className="flex items-center gap-2 mt-3 border-t border-gray-100 pt-3">
        <img
          src="/images/avatar1.jpg"
          alt="user"
          className="w-8 h-8 rounded-full object-cover"
        />
        <input
          type="text"
          placeholder="Viết bình luận..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 text-sm border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:border-blue-400"
        />
        <button
          onClick={handleAdd}
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          Gửi
        </button>
      </div>
    </div>
  );
}

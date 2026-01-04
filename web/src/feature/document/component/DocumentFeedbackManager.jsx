import React, { useState, useMemo } from "react";
import { MessageSquare, Search, Trash2, ShieldAlert, Clock, User, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { base_url } from "../../../utils/api"; // Đảm bảo đường dẫn này đúng với dự án của bạn

const DocumentFeedbackManager = ({ feedbacks = [], onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(null); // Lưu ID feedback đang chờ xóa để hiện popup
  const [loading, setLoading] = useState(false);

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((fb) => {
      const s = searchTerm.toLowerCase();
      const userName = fb.accountId?.displayName?.toLowerCase() || "";
      const commentText = fb.comment?.toLowerCase() || "";
      const email = fb.accountId?.email?.toLowerCase() || "";
      return userName.includes(s) || commentText.includes(s) || email.includes(s);
    });
  }, [feedbacks, searchTerm]);

  // Hàm xử lý xóa feedback qua API
  const handleDelete = async (feedbackId) => {
    try {
      setLoading(true);
      const res = await fetch(`${base_url}/api/comments/${feedbackId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // Thêm token nếu API của bạn yêu cầu Authorization
          // "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
      });

      const json = await res.json();

      if (res.ok && json.success) {
        toast.success("Đã xóa bình luận thành công");
        setIsDeleting(null);
        if (onRefresh) onRefresh(); // Gọi hàm refresh để load lại dữ liệu từ cha
      } else {
        toast.error(json.message || "Không thể xóa bình luận");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi hệ thống khi xóa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
      {/* Search & Header */}
      <div className="p-5 bg-gray-50/50 border-b flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <MessageSquare size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Quản lý góp ý</h3>
            <p className="text-xs text-gray-500">Tổng cộng {feedbacks.length} bình luận</p>
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm theo tên, nội dung, email..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/30 text-gray-400 text-[11px] uppercase tracking-widest font-bold">
              <th className="px-6 py-4">Thành viên</th>
              <th className="px-6 py-4">Nội dung góp ý</th>
              <th className="px-6 py-4">Thời gian</th>
              <th className="px-6 py-4 text-center">Báo cáo</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredFeedbacks.length > 0 ? (
              filteredFeedbacks.map((item) => (
                <tr key={item._id} className="hover:bg-indigo-50/30 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {item.accountId?.avatar?.path ? (
                        <img src={item.accountId.avatar.path} alt="avatar" className="h-9 w-9 rounded-full object-cover border border-gray-200" />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                          <User size={16} />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{item.accountId?.displayName}</div>
                        <div className="text-[10px] text-gray-400">{item.accountId?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 max-w-xs break-words font-medium italic">"{item.comment}"</p>
                  </td>
                  <td className="px-6 py-4 text-[12px] text-gray-500">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock size={12} /> {new Date(item.createdAt).toLocaleString("vi-VN")}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.reports > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-600 text-[10px] font-bold uppercase animate-pulse">
                        <ShieldAlert size={10} /> {item.reports} Vi phạm
                      </span>
                    ) : (
                      <span className="text-gray-300 text-[10px] uppercase font-bold">Sạch</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Xóa bình luận"
                        onClick={() => setIsDeleting(item._id)} // Mở popup
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-20 text-center text-gray-400 italic font-medium">Chưa có góp ý nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* POPUP XÁC NHẬN XÓA (MODAL) */}
      {isDeleting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
                <AlertTriangle size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Xác nhận xóa?</h4>
              <p className="text-gray-500 text-sm mt-2">
                Hành động này sẽ xóa vĩnh viễn bình luận này và không thể khôi phục lại. Bạn có chắc chắn?
              </p>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                disabled={loading}
                onClick={() => setIsDeleting(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                disabled={loading}
                onClick={() => handleDelete(isDeleting)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Xóa ngay"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DocumentFeedbackManager;
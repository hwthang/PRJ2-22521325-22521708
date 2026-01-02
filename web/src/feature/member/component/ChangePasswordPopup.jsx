import { useState } from "react";
import apiClient from "../../../utils/api";

const ChangePasswordPopup = ({ isOpen, onClose, accountId }) => {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });

  const handleRecover = async () => {
    if (!newPassword || newPassword.length < 6) {
      setMessage({ type: "error", content: "Mật khẩu phải từ 6 ký tự trở lên" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", content: "" });
    try {
      await apiClient.patch(`/api/accounts/${accountId}/recover-password`, {
        password: newPassword,
      });
      setMessage({ type: "success", content: "Đổi mật khẩu thành công!" });
      setTimeout(() => {
        onClose();
        setNewPassword("");
        setMessage({ type: "", content: "" });
      }, 1500);
    } catch (error) {
      setMessage({
        type: "error",
        content: error.response?.data?.message || "Không thể đổi mật khẩu",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Đặt lại mật khẩu</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <SquareX className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Mật khẩu mới</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới..."
              className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
          </div>

          {message.content && (
            <div className={`p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
              message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}>
              {message.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {message.content}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleRecover}
              disabled={loading}
              className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 disabled:bg-gray-400"
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <RotateCcwKey className="w-4 h-4" />}
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
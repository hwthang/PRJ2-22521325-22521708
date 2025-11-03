import React from "react";
import { X } from "lucide-react";

function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null; // ẩn khi không bật

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative animate-fadeIn">
        {/* Nút đóng */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {/* Tiêu đề */}
        <h2 className="text-xl font-semibold mb-2">{title || "Xác nhận"}</h2>

        {/* Nội dung */}
        <p className="text-gray-600 mb-6">
          {message || "Bạn có chắc muốn thực hiện hành động này?"}
        </p>

        {/* Nút hành động */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold"
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;

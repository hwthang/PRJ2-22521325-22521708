import React from "react";
import { X } from "lucide-react";

const CustomModal = ({ isOpen, onClose, title, children, onConfirm, confirmText = "Xác nhận", isLoading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>
        <div className="p-6">{children}</div>
        <div className="flex items-center justify-end gap-3 p-6 bg-slate-50">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Hủy
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-200 disabled:opacity-50 transition-all"
          >
            {isLoading ? "Đang xử lý..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
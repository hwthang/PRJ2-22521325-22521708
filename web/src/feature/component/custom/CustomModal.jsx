import React from 'react';
import { X } from 'lucide-react';

/**
 * CustomModal Component
 * Dùng để hiển thị nội dung modal với lớp phủ nền.
 * @param {boolean} open - Trạng thái mở/đóng modal.
 * @param {function} onClose - Hàm được gọi khi người dùng muốn đóng modal.
 * @param {string} title - Tiêu đề của modal.
 * @param {React.ReactNode} children - Nội dung bên trong modal.
 */
const CustomModal = ({ open, onClose, title, children }) => {
    if (!open) return null;

    // Ngăn chặn đóng modal khi click vào nội dung bên trong modal
    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        // Lớp phủ nền (Backdrop)
        <div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={onClose} // Đóng khi click ra ngoài lớp phủ
        >
            {/* Hộp Modal */}
            <div
                className="bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-lg transition-all transform duration-300 ease-out"
                onClick={handleContentClick} // Ngăn chặn đóng khi click vào box
            >
                {/* Header Modal */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Nội dung Modal */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CustomModal;
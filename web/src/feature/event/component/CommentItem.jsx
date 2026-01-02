import React from "react";
import { formatDistanceToNowStrict } from 'date-fns';
import vi from 'date-fns/locale/vi';

// Icon Check Circle (Duyệt)
const CheckCircleIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

// Icon Báo cáo
const FlagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.244 8l2.556 3.4A1 1 0 0116 13H6a3 3 0 01-3-3V6z" clipRule="evenodd" />
    </svg>
);

// Icon Người dùng (dùng cho avatar mặc định)
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916l.126.041A8.932 8.932 0 0010 15c-1.35 0-2.613-.26-3.774-.754l.126-.041A5 5 0 0010 11z" clipRule="evenodd" />
    </svg>
);

const MAX_REPORTS = 10; // Ngưỡng ẩn bình luận

export const CommentItem = ({ comment, onApprove, isApproved, onReportManually }) => {
    const authorName = comment.author?.name || comment.accountId?.username || 'Người dùng ẩn danh';
    const avatarUrl = comment.author?.avatar?.path || comment.accountId?.avatar?.path;
    const commentTime = new Date(comment.createdAt);
    const timeAgo = formatDistanceToNowStrict(commentTime, { addSuffix: true, locale: vi });
    
    // Lấy số lượt báo cáo từ prop comment
    const currentReports = comment.reports || 0;
    
    // Kiểm tra trạng thái ẩn
    const isHidden = currentReports >= MAX_REPORTS;

    return (
        <div className={`flex space-x-3 p-3 rounded-lg border transition-all duration-300 
            ${isApproved ? 'bg-green-50 border-green-200 opacity-70' : 'bg-white border-gray-200 hover:shadow-sm'}
            ${isHidden ? 'bg-red-50 border-red-300 opacity-50' : ''}` // Thêm style cho bình luận bị ẩn
        }>
            {/* Avatar */}
            <div className="flex-shrink-0">
                {avatarUrl ? (
                    <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={avatarUrl}
                        alt={authorName}
                    />
                ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <UserIcon />
                    </div>
                )}
            </div>

            <div className="min-w-0 flex-1">
                {/* Tên, Thời gian và Trạng thái */}
                <div className="flex justify-between items-start">
                    <p className="text-sm font-semibold text-gray-900">
                        {authorName}
                        {isApproved && !isHidden && (
                             <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircleIcon className="w-3 h-3 mr-1" /> Đã duyệt
                             </span>
                        )}
                        {isHidden && (
                             <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Bị Ẩn
                             </span>
                        )}
                    </p>
                    <p className="text-xs text-gray-500 flex-shrink-0" title={commentTime.toLocaleString('vi-VN')}>
                        {timeAgo}
                    </p>
                </div>
                
                {/* Nội dung bình luận */}
                <p className={`text-sm mt-1 ${isApproved ? 'text-gray-600' : 'text-gray-800'} ${isHidden ? 'italic text-red-700' : ''}`}>
                    {isHidden ? '***Bình luận này đã bị ẩn do quá nhiều báo cáo***' : comment.comment}
                </p>

                {/* Số lượt báo cáo */}
                <div className="mt-2 flex space-x-4 items-center">
                    <span className={`inline-flex items-center text-xs font-medium ${currentReports > 5 ? 'text-red-600' : 'text-yellow-600'}`}>
                        <FlagIcon />
                        <span className="ml-1">Báo cáo: {currentReports}</span>
                    </span>

                    {/* Nút Duyệt Thủ công */}
                    {!isApproved && !isHidden && (
                        <button
                            onClick={() => onApprove(comment._id)}
                            className="inline-flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-800"
                        >
                            <CheckCircleIcon className="w-4 h-4 mr-1" />
                            Duyệt Thủ công
                        </button>
                    )}
                    
                    {/* Nút Hành động Báo cáo (Mô phỏng) */}
                    <button 
                        onClick={() => onReportManually(comment._id, 1)} // Báo cáo thêm 1 lần
                        className="inline-flex items-center text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
                        disabled={isHidden}
                    >
                        Báo cáo thêm
                    </button>
                    
                </div>
            </div>
        </div>
    );
};
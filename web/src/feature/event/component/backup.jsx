import React, { useState, useCallback } from "react";
import CustomSection from "../../chapter/shared/CustomSection"; 
import { CommentItem } from "./CommentItem";
// Import CommentItem (Giả định đã được import hoặc định nghĩa ở trên)
// import CommentItem from './CommentItem'; 

// Icon cho nút Duyệt Nhanh
const FastForwardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M11.933 13.921l2.053-2.053a1 1 0 000-1.414l-2.053-2.053a1 1 0 00-1.732.707v4.106a1 1 0 001.732.707zM5.933 13.921l2.053-2.053a1 1 0 000-1.414L5.933 8.451a1 1 0 00-1.732.707v4.106a1 1 0 001.732.707z" />
    </svg>
);

const MAX_REPORTS = 10; // Ngưỡng ẩn bình luận

const CommentSection = ({ comments: initialComments=[
            {
                "_id": "691b873ab10f06986bd400a3",
                "postId": "691b86a9326f09608bc49364",
                "accountId": {
                    "_id": "691b1f089142d32cb2479944",
                    "avatar": {
                        "fieldname": "avatar",
                        "originalname": "491943227_1713156972953183_9150722420275444410_n.jpg",
                        "encoding": "7bit",
                        "mimetype": "image/jpeg",
                        "path": "https://res.cloudinary.com/diz9pqlzo/image/upload/v1763326801/cds/491943227_1713156972953183_9150722420275444410_n.jpg",
                        "size": 143062,
                        "filename": "cds/491943227_1713156972953183_9150722420275444410_n"
                    },
                    "username": "admin",
                    "email": "admin@qldv.com",
                    "phoneNumber": "0909090909",
                    "password": "$2b$10$0m9BcnJUfhUPLIxMuXKJCuqC75vUi2kSYsY4m8u7vWsMTaY93yC6e",
                    "type": "member",
                    "status": "active",
                    "createdAt": "2025-11-17T13:11:36.548Z",
                    "updatedAt": "2025-11-17T20:50:34.358Z",
                    "__v": 0
                },
                "comment": "Mệt",
                "reports": 0,
                "createdAt": "2025-11-17T20:36:10.719Z",
                "updatedAt": "2025-11-17T20:36:10.719Z",
                "__v": 0,
                "author": {
                    "type": "member",
                    "name": "Đặng Hữu Thắng",
                    "avatar": {
                        "fieldname": "avatar",
                        "originalname": "491943227_1713156972953183_9150722420275444410_n.jpg",
                        "encoding": "7bit",
                        "mimetype": "image/jpeg",
                        "path": "https://res.cloudinary.com/diz9pqlzo/image/upload/v1763326801/cds/491943227_1713156972953183_9150722420275444410_n.jpg",
                        "size": 143062,
                        "filename": "cds/491943227_1713156972953183_9150722420275444410_n"
                    }
                }
            },
            {
                "_id": "691b873cb10f06986bd400a6",
                "postId": "691b86a9326f09608bc49364",
                "accountId": {
                    "_id": "691b1f089142d32cb2479944",
                    "avatar": {
                        "fieldname": "avatar",
                        "originalname": "491943227_1713156972953183_9150722420275444410_n.jpg",
                        "encoding": "7bit",
                        "mimetype": "image/jpeg",
                        "path": "https://res.cloudinary.com/diz9pqlzo/image/upload/v1763326801/cds/491943227_1713156972953183_9150722420275444410_n.jpg",
                        "size": 143062,
                        "filename": "cds/491943227_1713156972953183_9150722420275444410_n"
                    },
                    "username": "admin",
                    "email": "admin@qldv.com",
                    "phoneNumber": "0909090909",
                    "password": "$2b$10$0m9BcnJUfhUPLIxMuXKJCuqC75vUi2kSYsY4m8u7vWsMTaY93yC6e",
                    "type": "member",
                    "status": "active",
                    "createdAt": "2025-11-17T13:11:36.548Z",
                    "updatedAt": "2025-11-17T20:50:34.358Z",
                    "__v": 0
                },
                "comment": "Mệt",
                "reports": 0,
                "createdAt": "2025-11-17T20:36:12.064Z",
                "updatedAt": "2025-11-17T20:36:12.064Z",
                "__v": 0,
                "author": {
                    "type": "member",
                    "name": "Đặng Hữu Thắng",
                    "avatar": {
                        "fieldname": "avatar",
                        "originalname": "491943227_1713156972953183_9150722420275444410_n.jpg",
                        "encoding": "7bit",
                        "mimetype": "image/jpeg",
                        "path": "https://res.cloudinary.com/diz9pqlzo/image/upload/v1763326801/cds/491943227_1713156972953183_9150722420275444410_n.jpg",
                        "size": 143062,
                        "filename": "cds/491943227_1713156972953183_9150722420275444410_n"
                    }
                }
            },
            {
                "_id": "691b873cb10f06986bd400a9",
                "postId": "691b86a9326f09608bc49364",
                "accountId": {
                    "_id": "691b1f089142d32cb2479944",
                    "avatar": {
                        "fieldname": "avatar",
                        "originalname": "491943227_1713156972953183_9150722420275444410_n.jpg",
                        "encoding": "7bit",
                        "mimetype": "image/jpeg",
                        "path": "https://res.cloudinary.com/diz9pqlzo/image/upload/v1763326801/cds/491943227_1713156972953183_9150722420275444410_n.jpg",
                        "size": 143062,
                        "filename": "cds/491943227_1713156972953183_9150722420275444410_n"
                    },
                    "username": "admin",
                    "email": "admin@qldv.com",
                    "phoneNumber": "0909090909",
                    "password": "$2b$10$0m9BcnJUfhUPLIxMuXKJCuqC75vUi2kSYsY4m8u7vWsMTaY93yC6e",
                    "type": "member",
                    "status": "active",
                    "createdAt": "2025-11-17T13:11:36.548Z",
                    "updatedAt": "2025-11-17T20:50:34.358Z",
                    "__v": 0
                },
                "comment": "Mệt",
                "reports": 0,
                "createdAt": "2025-11-17T20:36:12.931Z",
                "updatedAt": "2025-11-17T20:36:12.931Z",
                "__v": 0,
                "author": {
                    "type": "member",
                    "name": "Đặng Hữu Thắng",
                    "avatar": {
                        "fieldname": "avatar",
                        "originalname": "491943227_1713156972953183_9150722420275444410_n.jpg",
                        "encoding": "7bit",
                        "mimetype": "image/jpeg",
                        "path": "https://res.cloudinary.com/diz9pqlzo/image/upload/v1763326801/cds/491943227_1713156972953183_9150722420275444410_n.jpg",
                        "size": 143062,
                        "filename": "cds/491943227_1713156972953183_9150722420275444410_n"
                    }
                }
            }
        ] }) => {
    
    // State quản lý toàn bộ bình luận (bao gồm reports và isApproved)
    const [comments, setComments] = useState(() => 
        initialComments.map(c => ({
            ...c,
            // Khởi tạo trạng thái duyệt (có thể dùng trường reports để suy ra)
            isApproved: false, 
            // Đảm bảo trường reports luôn có giá trị (0 nếu null/undefined)
            reports: c.reports || 0 
        }))
    );

    // ----------------------------------------------------------------------
    // LOGIC KIỂM TRA & CẬP NHẬT
    // ----------------------------------------------------------------------

    /**
     * Hàm kiểm tra nội dung ngẫu nhiên: trả về TRUE (Ổn) / FALSE (Không ổn)
     * Tỷ lệ 70% là ổn, 30% là không ổn.
     */
    const checkContentRandomly = useCallback(() => {
        return Math.random() < 0.7; 
    }, []);

    // Hàm cập nhật trạng thái chung (duyệt/báo cáo thủ công)
    const updateCommentState = useCallback((commentId, updates) => {
        setComments(prevComments => 
            prevComments.map(comment => 
                comment._id === commentId ? { ...comment, ...updates } : comment
            )
        );
    }, []);

    // Hàm duyệt thủ công (cho 1 bình luận)
    const handleApprove = useCallback((commentId) => {
        updateCommentState(commentId, { isApproved: true });
        console.log(`Bình luận ID ${commentId} đã được duyệt thủ công.`);
    }, [updateCommentState]);
    
    // Hàm báo cáo thủ công
    const handleReportManually = useCallback((commentId, amount) => {
        setComments(prevComments => 
            prevComments.map(comment => {
                if (comment._id === commentId) {
                    const newReports = (comment.reports || 0) + amount;
                    return { 
                        ...comment, 
                        reports: newReports,
                    };
                }
                return comment;
            })
        );
    }, []);
    
    // Hàm duyệt nhanh tất cả (Kiểm tra nội dung ngẫu nhiên)
    const handleApproveAll = useCallback(() => {
        let approvedCount = 0;
        let reportedCount = 0;
        
        setComments(prevComments => 
            prevComments.map(comment => {
                if (comment.isApproved || comment.reports >= MAX_REPORTS) {
                    // Bỏ qua nếu đã duyệt hoặc đã bị ẩn
                    return comment;
                }

                // 1. Áp dụng kiểm tra nội dung ngẫu nhiên
                const isContentSafe = checkContentRandomly(); 

                if (isContentSafe) {
                    // Nội dung ổn: Duyệt
                    approvedCount++;
                    return { ...comment, isApproved: true };
                } else {
                    // Nội dung KHÔNG ổn: Tăng 10 lượt báo cáo và ẩn
                    reportedCount++;
                    return { 
                        ...comment, 
                        reports: (comment.reports || 0) + MAX_REPORTS, // Tăng 10 reports
                        // isApproved: false (giữ nguyên trạng thái chưa duyệt)
                    };
                }
            })
        );
        
        console.log(`Duyệt nhanh: ${approvedCount} bình luận được duyệt. ${reportedCount} bình luận bị gắn cờ và ẩn.`);
    }, [checkContentRandomly]);
    
    // Đếm số bình luận cần duyệt (chưa duyệt VÀ chưa bị ẩn)
    const pendingCount = comments.filter(c => !c.isApproved && c.reports < MAX_REPORTS).length;
    
    return (
        <CustomSection className="col-span-12 pt-4">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
                <div className="font-bold text-xl text-gray-800">
                    Bình luận ({comments.length}) 💬
                </div>
                
                {/* Nút Duyệt Nhanh Ngẫu nhiên */}
                {pendingCount > 0 && (
                    <button
                        onClick={handleApproveAll}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <FastForwardIcon className="w-5 h-5 mr-2" />
                        Duyệt Nhanh Ngẫu Nhiên ({pendingCount})
                    </button>
                )}
            </div>

            {/* Hiển thị danh sách bình luận */}
            <div className="space-y-4">
                {comments.map((comment) => (
                    <CommentItem
                        key={comment._id}
                        comment={comment}
                        onApprove={handleApprove}
                        onReportManually={handleReportManually}
                        isApproved={comment.isApproved}
                    />
                ))}
            </div>
            
            {comments.length === 0 && (
                <div className="text-center py-8 text-gray-500 border rounded-lg bg-gray-50">
                    Chưa có bình luận nào.
                </div>
            )}
        </CustomSection>
    );
};

export default CommentSection;
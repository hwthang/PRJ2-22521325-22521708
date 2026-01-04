// File: SurveyItem.jsx
import React from "react";
// Bỏ import Pencil
import { Link } from "react-router-dom"; // Thêm import Link
import { surveyStatuses } from "../page/SurveyListPage"; // Đảm bảo import đúng
import { CustomLabel } from "../../component/custom/CustomLabel";
import { formatForDatetimeLocal, formatVietnamDatetimeAMPM } from "../../../utils/date";

// Bỏ onEdit vì không còn dùng
export const SurveyItem = ({ data }) => { 
    const statusInfo = surveyStatuses[data.status];

    // Định dạng ngày tháng
    const formatTime = (dateString) => 
        dateString ? new Date(dateString).toLocaleDateString("vi-VN") : "--";

    return (
        // BỌC TOÀN BỘ ITEM BẰNG LINK
        <Link 
            to={data._id} // Điều hướng đến trang chi tiết
            className="block cursor-pointer hover:bg-gray-50 rounded-md shadow-sm border border-gray-200 mb-2"
        >
            <div className="h-full flex flex-col md:grid md:grid-cols-12 gap-4 p-4 md:items-center flex-wrap">

                {/* TÊN KHẢO SÁT (col-span-6) */}
                <div className="flex flex-col gap-1 md:col-span-6 border-l-2 pl-2 md:pl-0 md:border-none">
                    <span className="font-medium text-blue-600 hover:text-blue-800">{data.name}</span>
                </div>

                {/* BẮT ĐẦU (col-span-2) */}
                <div className="flex flex-col gap-1 md:col-span-2 border-l-2 pl-2 md:pl-0 md:border-none">
                    <span className="font-medium text-gray-500 text-xs md:hidden">BẮT ĐẦU</span>
                    <span className="md:text-center text-sm">{formatVietnamDatetimeAMPM(data.startedAt)}</span>
                </div>

                {/* KẾT THÚC (col-span-2) */}
                <div className="flex flex-col gap-1 md:col-span-2 border-l-2 pl-2 md:pl-0 md:border-none">
                    <span className="font-medium text-gray-500 text-xs md:hidden">KẾT THÚC</span>
                    <span className="md:text-center text-sm">{formatVietnamDatetimeAMPM(data.endedAt)}</span>
                </div>

                {/* TRẠNG THÁI (col-span-2) */}
                <div className="flex justify-start md:justify-center items-center md:col-span-2 border-l-2 pl-2 md:pl-0 md:border-none">
                    {/* Custom Label cho Trạng thái */}
                    {statusInfo && (
                        <CustomLabel
                            label={statusInfo.label}
                            icon={statusInfo.icon}
                            color={statusInfo.color}
                            selected
                            clickable={false}
                        />
                    )}
                    
                    {/* Icon Edit đã bị loại bỏ */}
                </div>
            </div>
        </Link>
    );
};
import React, { useState, useCallback } from "react";
import QRCode from "react-qr-code"; // 👈 Sử dụng thư viện 'react-qr-code'
import AttendanceItem from "./AttendanceItem";
import CustomSection from "../../chapter/shared/CustomSection";

// --- Component Logic chính ---
const AttendanceListSection = ({ eventId }) => {
    const QR_SIZE = 90; // Kích thước cố định cho QR Code
    
    // State quản lý trạng thái điểm danh
    const [isAttendanceActive, setIsAttendanceActive] = useState(false); 
    
    // State dùng để tạo mã QR mới mỗi khi bắt đầu
    const [qrSessionKey, setQrSessionKey] = useState(0); 

    // Giá trị Mã QR (Chỉ thay đổi khi Bắt đầu/Kết thúc)
    const qrValue = eventId
        ? `event-checkin-${eventId}-${qrSessionKey}`
        : "default-token";

    // Hàm xử lý bắt đầu điểm danh
    const handleStartAttendance = useCallback(() => {
        setIsAttendanceActive(true);
        // Tăng key để đảm bảo tạo ra một mã QR mới, độc nhất cho phiên này
        setQrSessionKey((prevKey) => prevKey + 1); 
        console.log("Bắt đầu điểm danh. Mã QR mới được tạo.");
    }, []);

    // Hàm xử lý kết thúc điểm danh
    const handleStopAttendance = useCallback(() => {
        setIsAttendanceActive(false);
        console.log("Kết thúc điểm danh.");
    }, []);

    // Giả lập danh sách đoàn viên tham gia
    const mockAttendanceList = [1, 2, 3].map((id) => ({
        _id: id,
        memberId: {
            fullName: `Đoàn viên ${id}`,
            position: `Vị trí ${id}`,
        },
        status: id === 1 ? "pending" : "present",
    }));

    return (
        <CustomSection className={"col-span-12 pt-4 border-t border-gray-200"}>
            <div className="flex justify-between items-center mb-6">
                <div className="font-bold text-2xl text-gray-800">
                    Danh sách đoàn viên tham gia 👥
                </div>
                
                {/* Nút Bắt đầu/Kết thúc */}
                {isAttendanceActive ? (
                    <button
                        onClick={handleStopAttendance}
                        className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        Kết thúc Điểm danh 🛑
                    </button>
                ) : (
                    <button
                        onClick={handleStartAttendance}
                        className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        Bắt đầu Điểm danh ▶️
                    </button>
                )}
            </div>

            {/* Khu vực Mã QR */}
            <div className={`p-4 mb-8 border rounded-lg shadow-md transition duration-300 ${isAttendanceActive ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-200'}`}>
                
                {isAttendanceActive ? (
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        {/* 1. QR Code */}
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-white border border-gray-300 rounded-lg shadow-inner">
                                <QRCode
                                    title={`Mã điểm danh sự kiện: ${qrValue}`}
                                    value={qrValue} 
                                    size={QR_SIZE} 
                                />
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-indigo-700">Mã QR Đang Hoạt động</p>
                                <p className="text-sm text-gray-600">Mã sẽ được duy trì cho đến khi bạn bấm Kết thúc.</p>
                            </div>
                        </div>

                        {/* 2. KHÔNG CÓ BỘ ĐẾM NGƯỢC */}
                        <div className="flex-shrink-0 mt-4 md:mt-0 md:ml-4 text-right">
                             <div className="text-lg font-medium text-green-700 bg-green-100 px-3 py-1 rounded-md inline-block">
                                Đang hoạt động
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Vô hiệu hóa bằng nút **Kết thúc**.</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-6 text-gray-500">
                        <p className="text-xl font-medium">Chế độ điểm danh hiện đang **TẠM DỪNG**.</p>
                        <p className="text-sm mt-1">Bấm **Bắt đầu Điểm danh** để tạo Mã QR mới và cho phép tự điểm danh.</p>
                    </div>
                )}
            </div>

            {/* Danh sách Đoàn viên */}
            <div className="flex flex-col gap-3">
                {/* Tiêu đề cột (Giữ nguyên) */}
                <div className="hidden lg:grid grid-cols-12 text-sm font-semibold text-gray-500 pb-2 border-b border-gray-100">
                    <div className="col-span-3">Đoàn viên</div>
                    <div className="col-span-4">Chi đoàn tổ chức</div>
                    <div className="col-span-1">Trạng thái</div>
                    <div className="col-span-4 text-right">Thao tác thủ công</div>
                </div>

                {mockAttendanceList.map((attendance) => (
                    <AttendanceItem
                        key={attendance._id}
                        // attendance={attendance}
                        onManualAttendance={() =>
                            console.log(`Điểm danh thủ công cho ID: ${attendance._id}`)
                        }
                    />
                ))}
            </div>
        </CustomSection>
    );
};

export default AttendanceListSection;
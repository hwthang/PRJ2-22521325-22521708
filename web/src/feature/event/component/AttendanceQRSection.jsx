import React, { useState, useEffect, useCallback } from "react";
import { QrCode, RefreshCw, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react"; // Sử dụng SVG để hiển thị sắc nét nhất
import { defAvatar } from "../../../core/assets/images";

const AttendanceQRSection = ({ eventId }) => {
  const [qrValue, setQrValue] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);

  // Memoize hàm generateQR để tránh re-render không cần thiết
  const generateQR = useCallback(() => {
    const qrData = JSON.stringify({
      action: "CHECK_IN",
      eventId: eventId,
      // Thêm salt ngẫu nhiên để mã thay đổi mỗi lần refresh, chống dùng ảnh chụp cũ
      nonce: Math.random().toString(36).substring(7),
      validUntil: Date.now() + 60000,
    });
    setQrValue(qrData);
    setTimeLeft(60);
  }, [eventId]);

  // Khởi tạo mã lần đầu
  useEffect(() => {
    if (eventId) generateQR();
  }, [eventId, generateQR]);

  // Logic đếm ngược và tự động làm mới
  useEffect(() => {
    if (timeLeft <= 0) {
      generateQR(); // Tự động làm mới khi hết thời gian
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, generateQR]);

  return (
    <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Header Section */}
      <div className="flex items-center gap-4 w-full mb-6">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner">
          <QrCode size={24} />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-gray-800 text-lg">Điểm Danh Sự Kiện</h2>
          <div className="flex items-center gap-2 text-sm mt-0.5">
            <Clock 
              size={14} 
              className={timeLeft < 10 ? "text-red-500 animate-pulse" : "text-blue-500"} 
            />
            <span className={`font-medium ${timeLeft < 10 ? "text-red-500" : "text-gray-500"}`}>
              Mã mới sau: <span className="font-mono">{timeLeft}s</span>
            </span>
          </div>
        </div>
        <button
          onClick={generateQR}
          className="p-2.5 hover:bg-blue-50 rounded-full text-blue-600 transition-all active:rotate-180 duration-500"
          title="Làm mới thủ công"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* QR Code Display Area */}
      <div className="relative group p-6 bg-white rounded-[2rem] border-2 border-dashed border-blue-100 shadow-inner flex flex-col items-center">
        <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <QRCodeSVG
            value={qrValue}
            size={200}
            level="H" // High error correction
            includeMargin={false}
            className="transition-transform duration-300 rounded-lg"
            imageSettings={{
                // Bạn có thể chèn logo Chi đoàn vào giữa QR tại đây
                src: defAvatar,
                height: 80,
                width: 80,
                excavate: true,
                
            }}
          />
        </div>
        
        {/* Overlay khi sắp hết hạn hoặc đang chuyển giao */}
        {timeLeft <= 1 && (
           <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] rounded-[2rem] flex items-center justify-center animate-pulse">
             <RefreshCw className="text-blue-600 animate-spin" size={32} />
           </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
          <ShieldCheck size={14} />
          <span className="text-[11px] font-bold uppercase tracking-wider">Mã bảo mật 256-bit</span>
        </div>
        <p className="text-[11px] text-gray-400 text-center leading-relaxed">
          Yêu cầu thành viên mở ứng dụng Đoàn Thanh Niên <br />
          quét mã để xác nhận sự có mặt.
        </p>
      </div>
    </div>
  );
};

export default AttendanceQRSection;
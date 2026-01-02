import React, { useState, useEffect } from "react";
import { QrCode, RefreshCw, Clock, CheckCircle2 } from "lucide-react";

const AttendanceQRSection = ({ eventId }) => {
  const [qrValue, setQrValue] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);

  const generateQR = () => {
    const qrData = JSON.stringify({
      action: "CHECK_IN",
      eventId: eventId,
      validUntil: Date.now() + 60000 
    });
    setQrValue(qrData);
    setTimeLeft(60);
  };

  useEffect(() => {
    generateQR();
  }, [eventId]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-4 w-full mb-6">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
          <QrCode size={24} />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-gray-800">Mã QR Điểm Danh Trực Tiếp</h2>
          <div className="flex items-center gap-2 text-sm">
            <Clock size={14} className={timeLeft < 10 ? "text-red-500 animate-pulse" : "text-blue-500"} />
            <span className={timeLeft < 10 ? "text-red-500 font-bold" : "text-gray-500"}>
              Tự động làm mới sau: {timeLeft}s
            </span>
          </div>
        </div>
        <button 
          onClick={generateQR}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
          title="Làm mới thủ công"
        >
          <RefreshCw size={20} />
        </button>
      </div>
      
      <div className="relative group p-4 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <div className={timeLeft === 0 ? "blur-md opacity-20 transition-all" : "transition-all"}>
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrValue)}`} 
            alt="QR Code" 
            className="w-40 h-40 md:w-48 md:h-48"
          />
        </div>
        
        {timeLeft === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button 
              onClick={generateQR}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg hover:bg-blue-700 transition-all"
            >
              <RefreshCw size={18} /> Cấp mã mới
            </button>
          </div>
        )}
      </div>

      <p className="mt-4 text-[11px] text-gray-400 uppercase tracking-widest font-bold">
        Thành viên quét mã này để xác nhận tham gia
      </p>
    </div>
  );
};

export default AttendanceQRSection;
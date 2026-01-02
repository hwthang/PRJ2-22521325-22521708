import React, { useState, useEffect, useMemo } from "react";
import { Users, Mail, Clock, Phone, Briefcase, Search, CheckCircle2, UserCheck } from "lucide-react";
import EventService from "../service/EventService";

const ParticipantListSection = ({ eventId }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchParticipants = async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const res = await EventService.getAttendanceByEventId(eventId);
      if (res.success) {
        setParticipants(res.data.attendances);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách tham gia:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [eventId]);

  // Xử lý điểm danh thủ công
  const handleManualCheckIn = async (memberId, currentStatus) => {
    if (currentStatus === "attended") return;
    
    if (window.confirm("Xác nhận điểm danh thủ công cho thành viên này?")) {
      try {
        const res = await EventService.checkInEvent(eventId, memberId); // Lưu ý: API cần eventId và memberId
        if (res.success) {
          // Cập nhật state cục bộ để UI thay đổi ngay lập tức
          setParticipants(prev => 
            prev.map(item => 
              item.memberId?._id === memberId 
              ? { ...item, status: "attended" } 
              : item
            )
          );
        }
      } catch (error) {
        alert("Lỗi điểm danh thủ công");
      }
    }
  };

  // Logic tìm kiếm
  const filteredParticipants = useMemo(() => {
    return participants.filter((item) => {
      const s = searchTerm.toLowerCase();
      const member = item.memberId || {};
      const account = member.accountId || {};
      
      return (
        member.fullName?.toLowerCase().includes(s) ||
        account.email?.toLowerCase().includes(s) ||
        account.phoneNumber?.toLowerCase().includes(s)
      );
    });
  }, [participants, searchTerm]);

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header & Search Bar */}
      <div className="p-5 bg-gray-50/50 border-b flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <Users size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Danh sách tham gia</h3>
            <p className="text-xs text-gray-500">Tìm thấy {filteredParticipants.length} kết quả</p>
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tên, email hoặc số điện thoại..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/30 text-gray-400 text-[11px] uppercase tracking-widest">
              <th className="px-6 py-4 font-bold">Thành viên / Chức vụ</th>
              <th className="px-6 py-4 font-bold">Thông tin liên hệ</th>
              <th className="px-6 py-4 font-bold">Thời gian đăng ký</th>
              <th className="px-6 py-4 font-bold text-center">Trạng thái</th>
              <th className="px-6 py-4 font-bold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-20 text-center"><div className="animate-spin inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" /></td></tr>
            ) : filteredParticipants.length > 0 ? (
              filteredParticipants.map((item) => (
                <tr key={item._id} className="group hover:bg-blue-50/30 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.memberId?.accountId?.avatar?.path || "https://via.placeholder.com/40"} 
                        className="h-10 w-10 rounded-xl object-cover border-2 border-white shadow-sm"
                        alt="avatar"
                      />
                      <div>
                        <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{item.memberId?.fullName || "N/A"}</div>
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 italic">
                          <Briefcase size={10} /> {item.memberId?.position || "Thành viên"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-[13px] text-gray-600">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 font-medium"><Mail size={12} className="text-gray-400"/> {item.memberId?.accountId?.email}</div>
                      <div className="flex items-center gap-1.5"><Phone size={12} className="text-gray-400"/> {item.memberId?.accountId?.phoneNumber || "N/A"}</div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-[12px] text-gray-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-gray-400"/>
                      {new Date(item.createdAt).toLocaleString("vi-VN", { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      item.status === "attended" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-orange-100 text-orange-700"
                    }`}>
                      {item.status === "attended" ? <CheckCircle2 size={10} /> : null}
                      {item.status === "attended" ? "Đã điểm danh" : "Chờ điểm danh"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    {item.status !== "attended" ? (
                      <button
                        onClick={() => handleManualCheckIn(item.memberId?._id, item.status)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1 ml-auto text-xs font-bold"
                        title="Điểm danh thủ công"
                      >
                        <UserCheck size={16} /> Check-in
                      </button>
                    ) : (
                      <span className="text-green-500 p-2 block"><CheckCircle2 size={20} className="ml-auto" /></span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="px-6 py-20 text-center text-gray-400 italic">Không tìm thấy thành viên phù hợp.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ParticipantListSection;
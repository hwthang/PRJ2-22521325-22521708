import React, { useEffect, useState } from "react";
import {
  Calendar,
  ClipboardCheck,
  ArrowRight,
  Clock,
  CheckCircle2,
  Loader2,
  Trash2,
  AlertTriangle, // Thêm icon cảnh báo
  X,
} from "lucide-react";
import SurveyService from "../../survey/service/SurveyService";
import { Link } from "react-router-dom";
import EventService from "../../event/service/EventService";
import { formatVietnamDatetimeAMPM } from "../../../utils/date";
import { base_url } from "../../../utils/api";

export const RegistrationPage = () => {
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [doneSurveys, setDoneSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State cho Modal
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    eventId: null,
    isProcessing: false,
  });

  const fetchRegistrationEvent = async () => {
    const res = await EventService.fetchAllEventForMember();
    const joined = res
      .filter((item) => item.hadRegistered)
      .map((item) => ({
        id: item._id,
        name: item.name,
        date: formatVietnamDatetimeAMPM(item.startedAt),
      }));
    setJoinedEvents(joined);
  };

  const fetchDoneSurvey = async () => {
    try {
      setIsLoading(true);
      const res = await SurveyService.fetchMemberDone();
      if (res && res.success) {
        setDoneSurveys(res.data.surveys);
      }
    } catch (error) {
      console.error("Lỗi khi tải khảo sát:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mở modal xác nhận
  const openConfirmModal = (e, eventId) => {
    e.preventDefault();
    setModalConfig({ ...modalConfig, isOpen: true, eventId });
  };

  // Đóng modal
  const closeModal = () => {
    setModalConfig({ isOpen: false, eventId: null, isProcessing: false });
  };

  // Xử lý hủy đăng ký thực tế
  const handleConfirmUnregister = async () => {
    setModalConfig((prev) => ({ ...prev, isProcessing: true }));
    try {
      const myAccount = JSON.parse(localStorage.getItem("my_account"));
      await fetch(`${base_url}/api/attendances`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: modalConfig.eventId,
          memberId: myAccount.member._id,
        }),
      });
      fetchRegistrationEvent();
      closeModal();
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể hủy đăng ký. Vui lòng thử lại.");
      setModalConfig((prev) => ({ ...prev, isProcessing: false }));
    }
  };

  useEffect(() => {
    fetchDoneSurvey();
    fetchRegistrationEvent();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8faff] p-6 md:p-10 font-sans relative">
      {/* CUSTOM MODAL COMPONENT */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Xác nhận hủy</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Bạn có chắc chắn muốn hủy đăng ký tham gia sự kiện này không? Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="flex gap-3 p-6 bg-slate-50">
              <button
                onClick={closeModal}
                disabled={modalConfig.isProcessing}
                className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-all disabled:opacity-50"
              >
                Bỏ qua
              </button>
              <button
                onClick={handleConfirmUnregister}
                disabled={modalConfig.isProcessing}
                className="flex-[1.5] px-6 py-4 rounded-2xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {modalConfig.isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Đang xử lý...
                  </>
                ) : (
                  "Xác nhận hủy"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-10">
        <header>
          <h1 className="text-3xl font-black text-slate-800">Hoạt động của tôi</h1>
          <p className="text-slate-500 font-medium">Theo dõi các sự kiện và khảo sát bạn đã tham gia</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SECTION 1: SỰ KIỆN ĐÃ THAM GIA */}
          <section className="bg-white rounded-[2rem] p-8 shadow-xl shadow-blue-100/50 border border-white">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                  <Calendar size={24} />
                </div>
                <h2 className="text-xl font-black text-slate-800">Sự kiện đã tham gia</h2>
              </div>
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-1 rounded-full">
                {joinedEvents.length}
              </span>
            </div>

            <div className="space-y-4">
              {joinedEvents.map((event) => (
                <div key={event.id} className="group relative flex items-center gap-2">
                  <Link
                    to={`/app/member/events?id=${event.id}`}
                    className="flex-1 flex items-center justify-between p-5 rounded-2xl bg-slate-50 hover:bg-blue-600 transition-all duration-300"
                  >
                    <div className="flex flex-col gap-1">
                      <h3 className="font-bold text-slate-700 group-hover:text-white line-clamp-1">
                        {event.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-400 group-hover:text-blue-100">
                        <Clock size={14} /> <span>{event.date}</span>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-slate-300 group-hover:text-white" />
                  </Link>
                  <button
                    onClick={(e) => openConfirmModal(e, event.id)}
                    className="p-4 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 2: KHẢO SÁT ĐÃ LÀM */}
          <section className="bg-white rounded-[2rem] p-8 shadow-xl shadow-blue-100/50 border border-white">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                  <ClipboardCheck size={24} />
                </div>
                <h2 className="text-xl font-black text-slate-800">Khảo sát đã hoàn thành</h2>
              </div>
              <span className="text-sm font-bold text-purple-600 bg-purple-50 px-4 py-1 rounded-full">
                {doneSurveys.length}
              </span>
            </div>
            {/* ... Rest of survey rendering ... */}
            <div className="space-y-4 min-h-[100px] relative">
              {isLoading ? (
                <div className="flex flex-col items-center py-10 text-slate-400">
                  <Loader2 className="animate-spin mb-2" />
                  <p className="text-sm font-bold">Đang tải dữ liệu...</p>
                </div>
              ) : doneSurveys.map((survey) => (
                <div key={survey._id} className="flex items-center gap-4 p-5 rounded-2xl border-2 border-slate-50 hover:border-purple-100 hover:bg-purple-50/30 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                    <CheckCircle2 size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-700">{survey.name}</h3>
                    <p className="text-sm text-slate-400 font-medium">Hoàn thành: {formatVietnamDatetimeAMPM(survey.createdAt)}</p>
                  </div>
                  <Link to={`/app/member/surveys/results/${survey._id}`} className="text-xs font-black text-purple-600 bg-purple-50 px-3 py-2 rounded-xl hover:bg-purple-600 hover:text-white transition-all uppercase tracking-tighter">
                    Xem lại
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
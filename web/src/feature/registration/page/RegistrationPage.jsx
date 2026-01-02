import React, { useEffect, useState } from "react";
import {
  Calendar,
  ClipboardCheck,
  ArrowRight,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import SurveyService from "../../survey/service/SurveyService";
import { Link } from "react-router-dom";
import EventService from "../../event/service/EventService";
import { formatVietnamDatetimeAMPM } from "../../../utils/date";

export const RegistrationPage = () => {
  // State cho sự kiện (giữ nguyên mock hoặc cập nhật sau)
  const [joinedEvents, setJoinedEvents] = useState([
    {
      id: 1,
      name: "Chiến dịch Mùa hè xanh 2025",
      date: "20/12/2025",
      status: "Đã tham gia",
    },
  ]);

  // State cho khảo sát thực tế
  const [doneSurveys, setDoneSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchRegistrationEvent = async () => {
    const res = await EventService.fetchAllEventForMember();

    const joinedEvents = res
      .filter((item) => item.hadRegistered)
      .map((item) => ({
        id: item._id,
        name: item.name,
        date: formatVietnamDatetimeAMPM(item.startedAt),
      }));

    setJoinedEvents(joinedEvents);
  };
  // Hàm fetch dữ liệu từ API
  const fetchDoneSurvey = async () => {
    try {
      setIsLoading(true);
      const res = await SurveyService.fetchMemberDone();

      if (res && res.success) {
        // Ánh xạ data từ API (res.data.surveys) vào state
        setDoneSurveys(res.data.surveys);
      }
    } catch (error) {
      console.error("Lỗi khi tải khảo sát:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoneSurvey();
    fetchRegistrationEvent();
  }, []);

  // Hàm helper định dạng ngày tháng
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#f8faff] p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        <header>
          <h1 className="text-3xl font-black text-slate-800">
            Hoạt động của tôi
          </h1>
          <p className="text-slate-500 font-medium">
            Theo dõi các sự kiện và khảo sát bạn đã tham gia
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SECTION 1: SỰ KIỆN ĐÃ THAM GIA */}
          <section className="bg-white rounded-[2rem] p-8 shadow-xl shadow-blue-100/50 border border-white">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                  <Calendar size={24} />
                </div>
                <h2 className="text-xl font-black text-slate-800">
                  Sự kiện đã tham gia
                </h2>
              </div>
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-1 rounded-full">
                {joinedEvents.length}
              </span>
            </div>
            {/* ... Render joinedEvents giống như cũ ... */}
            <div className="space-y-4">
              {joinedEvents.map((event) => (
                <Link
                  to={`/app/member/events?id=${event?.id}`}
                  key={event.id}
                  className="group flex items-center justify-between p-5 rounded-2xl bg-slate-50 hover:bg-blue-600 transition-all duration-300"
                >
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-slate-700 group-hover:text-white">
                      {event.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400 group-hover:text-blue-100">
                      <Clock size={14} /> <span>{event.date}</span>
                    </div>
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-slate-300 group-hover:text-white"
                  />
                </Link>
              ))}
            </div>
          </section>

          {/* SECTION 2: KHẢO SÁT ĐÃ LÀM (Dữ liệu thực tế) */}
          <section className="bg-white rounded-[2rem] p-8 shadow-xl shadow-blue-100/50 border border-white">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                  <ClipboardCheck size={24} />
                </div>
                <h2 className="text-xl font-black text-slate-800">
                  Khảo sát đã hoàn thành
                </h2>
              </div>
              <span className="text-sm font-bold text-purple-600 bg-purple-50 px-4 py-1 rounded-full">
                {doneSurveys.length}
              </span>
            </div>

            <div className="space-y-4 min-h-[100px] relative">
              {isLoading ? (
                <div className="flex flex-col items-center py-10 text-slate-400">
                  <Loader2 className="animate-spin mb-2" />
                  <p className="text-sm font-bold">Đang tải dữ liệu...</p>
                </div>
              ) : doneSurveys.length > 0 ? (
                doneSurveys.map((survey) => (
                  <div
                    key={survey._id}
                    className="flex items-center gap-4 p-5 rounded-2xl border-2 border-slate-50 hover:border-purple-100 hover:bg-purple-50/30 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                      <CheckCircle2 size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-700">
                        {survey.name}
                      </h3>
                      <p className="text-sm text-slate-400 font-medium">
                        Hoàn thành: {formatDate(survey.createdAt)}
                      </p>
                    </div>
                    <Link
                      to={`/app/member/surveys/results/${survey._id}`}
                      className="text-xs font-black text-purple-600 bg-purple-50 px-3 py-2 rounded-xl hover:bg-purple-600 hover:text-white transition-all uppercase tracking-tighter"
                    >
                      Xem lại
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-slate-50 rounded-2xl">
                  <p className="text-slate-400 font-bold italic">
                    Bạn chưa thực hiện khảo sát nào.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

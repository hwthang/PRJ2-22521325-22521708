import React, { useEffect, useState } from "react";
import SurveyService from "../service/SurveyService";
import { Clock, ChevronRight, ClipboardCheck, MapPin, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const SurveyPostPage = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    try {
      // SỬ DỤNG HÀM MỚI: Trả về array đã có biến isDone
      const res = await SurveyService.fetchSurveyForMember();
      setSurveys(res);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khảo sát:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faff]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faff] p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Danh sách <span className="text-blue-600">Khảo sát</span>
          </h1>
          <p className="text-slate-500 font-medium">Bạn có {surveys.length} khảo sát trong chi đoàn</p>
        </div>

        <div className="grid gap-6">
          {surveys.length > 0 ? (
            surveys.map((post) => (
              <div 
                key={post._id} 
                className={`bg-white rounded-3xl p-6 shadow-sm border transition-all group ${
                  post.isDone ? "border-emerald-100 opacity-80" : "border-slate-100 hover:border-blue-100 hover:shadow-md"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  {/* Cột trái: Thông tin chính */}
                  <div className="flex gap-5 items-start">
                    <div className={`p-4 rounded-2xl transition-colors ${
                      post.isDone ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                    }`}>
                      {post.isDone ? <CheckCircle2 size={28} /> : <ClipboardCheck size={28} />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-xl font-bold transition-colors ${
                          post.isDone ? "text-slate-500" : "text-slate-800 group-hover:text-blue-600"
                        }`}>
                          {post.name || "Khảo sát không tiêu đề"}
                        </h3>
                        {post.isDone && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-black uppercase">Đã hoàn thành</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} /> {post.chapterId?.name || "Chi đoàn"}
                        </span>
                        {!post.isDone ? (
                          <span className="flex items-center gap-1 text-rose-500">
                            <Clock size={14} /> Hạn: {formatDate(post.endedAt)}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-emerald-500">
                            <CheckCircle2 size={14} /> Nộp: {formatDate(post.submittedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cột phải: Action */}
                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-4 md:pt-0">
                    {post.isDone ? (
                      // NÚT XEM LẠI NẾU ĐÃ XONG
                      <Link to={`results/${post._id}`} className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl font-bold hover:bg-emerald-600 hover:text-white transition-all active:scale-95">
                        Xem kết quả
                        <ChevronRight size={18} />
                      </Link>
                    ) : (
                      // NÚT LÀM NGAY NẾU CHƯA XONG
                      <Link to={`take/${post._id}`} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 active:scale-95">
                        Làm ngay
                        <ChevronRight size={18} />
                      </Link>
                    )}
                  </div>

                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold">Hiện không có khảo sát nào dành cho bạn.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyPostPage;
import React, { useEffect, useState } from "react";
import {
  User,
  Calendar,
  Clock,
  CheckCircle,
  ChevronLeft,
  FileText,
  UserCheck,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import SurveyService from "../service/SurveyService";

const SurveyDetailResultPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [result, setResult] = useState();
  const [member, setMember] = useState();
  const [answers, setAnswers] = useState();

  const fetchData = async () => {
    const result = await SurveyService.fetchMemberResult(id);
    console.log("ok")
    console.log(result)
    setMember(result.member || {});
    setAnswers(result.answers || []);
    setResult(result);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#f8faff] p-6 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Nút quay lại */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors mb-8"
        >
          <ChevronLeft size={20} /> Quay lại danh sách
        </button>

        {/* 1. Header & Member Info Card */}
        <section className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-blue-100/50 border border-white mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Avatar Placeholder */}
            <div className="w-24 h-24 bg-blue-100 rounded-[2rem] flex items-center justify-center text-blue-600 shrink-0">
              <User size={48} strokeWidth={1.5} />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-black text-slate-800">
                  {member?.fullName}
                </h1>
                <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
                  {member?.position || "Đoàn viên"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-slate-500 font-medium text-sm">
                <div className="flex items-center gap-2">
                  <UserCheck size={16} /> <span>Mã: {member?.memberCode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />{" "}
                  <span>
                    Sinh ngày:{" "}
                    {new Date(member?.dateOfBirth).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText size={16} />{" "}
                  <span>Học vấn: {member?.education}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-500">
                  <Clock size={16} />{" "}
                  <span>
                    Nộp lúc:{" "}
                    {new Date(result?.completedAt).toLocaleString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. List of Answers */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-3 px-4">
            Chi tiết câu trả lời
            <span className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              {answers?.length} câu hỏi
            </span>
          </h2>

          {answers?.map((item, index) => (
            <div
              key={item.questionId}
              className="bg-white rounded-[2rem] p-8 shadow-md border-2 border-transparent hover:border-blue-100 transition-all"
            >
              <div className="flex gap-4">
                <span className="text-2xl font-black text-slate-200">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 leading-snug">
                    {item?.question}
                  </h3>

                  {/* Hiển thị câu trả lời dựa theo Type */}
                  <div className="space-y-3">
                    {item?.type === "text" ? (
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 font-medium leading-relaxed italic">
                        "{item.answer || "Không có nội dung"}"
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        {Array.isArray(item.answer) &&
                          item.answer.map((ans, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 font-bold"
                            >
                              <CheckCircle size={18} className="shrink-0" />
                              <span>{ans}</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Loại câu hỏi badge */}
                  <div className="mt-6 pt-4 border-t border-slate-50 flex justify-end">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-slate-300">
                      Loại:{" "}
                      {item.type === "text"
                        ? "Tự luận"
                        : item.type === "single"
                        ? "Một lựa chọn"
                        : "Nhiều lựa chọn"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        {/* <div className="mt-12 mb-20 flex justify-center">
          <button
            onClick={() => window.print()}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg hover:bg-black transition-all flex items-center gap-3"
          >
            Xuất báo cáo PDF
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default SurveyDetailResultPage;

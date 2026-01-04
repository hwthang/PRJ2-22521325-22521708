import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Send,
  ClipboardList,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { base_url } from "../../../utils/api";

const TakeSurveyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // States
  const [surveyInfo, setSurveyInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch & Normalize Data
  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${base_url}/api/surveys/${id}`);
        const json = await res.json();

        if (json.success && json.data.survey) {
          const rawSurvey = json.data.survey;
          setSurveyInfo({
            name: rawSurvey.name,
            chapter: rawSurvey.chapterId?.name,
          });

          const normalizedQuestions = Object.keys(rawSurvey)
            .filter((key) => !isNaN(key))
            .map((key) => rawSurvey[key]);

          setQuestions(normalizedQuestions);
        }
      } catch (err) {
        toast.error("Không thể tải dữ liệu khảo sát");
      } finally {
        setLoading(false);
      }
    };
    fetchSurveyData();
  }, [id]);

  // 2. Logic cập nhật câu trả lời
  const handleAnswerChange = (questionId, value, type) => {
    setAnswers((prev) => {
      const indexStr = value.toString();
      if (type === "multiple") {
        const currentArr = prev[questionId]?.options || [];
        const newArr = currentArr.includes(indexStr)
          ? currentArr.filter((i) => i !== indexStr)
          : [...currentArr, indexStr];
        return { ...prev, [questionId]: { options: newArr, text: "" } };
      }
      if (type === "single") {
        return { ...prev, [questionId]: { options: [indexStr], text: "" } };
      }
      return { ...prev, [questionId]: { text: value, options: [] } };
    });
  };

  // 3. KIỂM TRA CÂU HỎI HIỆN TẠI ĐÃ TRẢ LỜI CHƯA
  const isCurrentQuestionAnswered = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return false;

    const ans = answers[currentQ._id];
    if (!ans) return false;

    if (currentQ.type === "text") {
      return ans.text && ans.text.trim().length > 0;
    }
    
    // Đối với single/multiple: mảng options phải có phần tử
    return ans.options && ans.options.length > 0;
  };

  // 4. Submit logic
  const submitAllAnswers = async () => {
    if (!isCurrentQuestionAnswered()) {
        return toast.warning("Vui lòng hoàn thành câu hỏi cuối cùng");
    }

    setSubmitting(true);
    try {
      const accountStr = localStorage.getItem("my_account");
      const account = JSON.parse(accountStr);
      const memberId = account?.member?._id;

      if (!memberId) return toast.error("Vui lòng đăng nhập lại");

      const apiCalls = questions.map((q) => {
        const ans = answers[q._id];
        return fetch(`${base_url}/api/answers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionId: q._id,
            memberId: memberId,
            text: ans.text || "",
            options: ans.options || [""],
          }),
        });
      });

      await Promise.all(apiCalls);
      setIsFinished(true);
      toast.success("Nộp khảo sát thành công!");
    } catch (error) {
      toast.error("Có lỗi khi gửi khảo sát!");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8faff] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="text-slate-500 font-bold">Đang tải câu hỏi...</p>
    </div>
  );

  if (isFinished) return <SuccessState navigate={navigate} id={id} />;
  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const canGoNext = isCurrentQuestionAnswered(); // Biến kiểm tra để active nút

  return (
    <div className="min-h-screen bg-[#f8faff] p-6 flex items-center justify-center font-sans">
      <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-xl shadow-blue-100/40 overflow-hidden border border-white">
        
        {/* Progress Bar */}
        <div className="h-2 bg-slate-50 w-full relative">
          <div
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-10 md:p-14">
          <header className="flex justify-between items-start mb-10">
            <div>
              <p className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-1">
                Câu hỏi {currentIndex + 1} / {questions.length}
              </p>
              <h1 className="text-sm font-bold text-slate-400 truncate max-w-[200px]">
                {surveyInfo?.name}
              </h1>
            </div>
            {/* Nhãn bắt đầu nhắc nhở nếu chưa chọn */}
            {!canGoNext && (
                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-50 px-3 py-1 rounded-full animate-pulse">
                   <AlertCircle size={12} /> Bắt buộc
                </div>
            )}
          </header>

          <main className="min-h-[280px]">
            <h2 className="text-2xl font-black text-slate-800 mb-8 leading-snug">
              {currentQuestion.question}
            </h2>

            <div className="space-y-3">
              {currentQuestion.type === "text" && (
                <textarea
                  className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[2rem] outline-none transition-all font-medium text-slate-700 min-h-[150px] shadow-inner"
                  placeholder="Nhập câu trả lời của bạn..."
                  value={answers[currentQuestion._id]?.text || ""}
                  onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value, "text")}
                />
              )}

              {(currentQuestion.type === "single" || currentQuestion.type === "multiple") && (
                <div className="grid gap-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = answers[currentQuestion._id]?.options?.includes(idx.toString());
                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerChange(currentQuestion._id, idx, currentQuestion.type)}
                        className={`p-5 rounded-[1.5rem] border-2 text-left font-bold transition-all flex justify-between items-center group ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-100/50"
                            : "border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200 hover:bg-white shadow-sm"
                        }`}
                      >
                        <span className="flex-1">{option}</span>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected ? "border-blue-500 bg-blue-500 text-white" : "border-slate-200 bg-white"
                        }`}>
                          {isSelected && <CheckCircle size={14} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </main>

          <footer className="mt-12 flex gap-4">
            {currentIndex > 0 && (
              <button
                onClick={() => setCurrentIndex(currentIndex - 1)}
                className="p-5 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {currentIndex < questions.length - 1 ? (
              <button
                disabled={!canGoNext} // KHÓA NẾU CHƯA TRẢ LỜI
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className={`flex-1 p-5 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                    canGoNext 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700" 
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                Tiếp tục <ChevronRight size={24} />
              </button>
            ) : (
              <button
                disabled={submitting || !canGoNext} // KHÓA NẾU CHƯA TRẢ LỜI
                onClick={submitAllAnswers}
                className={`flex-1 p-5 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                    canGoNext 
                    ? "bg-slate-900 text-white hover:bg-black shadow-slate-200" 
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                {submitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>Hoàn thành khảo sát <Send size={20} /></>
                )}
              </button>
            )}
          </footer>
        </div>
      </div>
    </div>
  );
};

const SuccessState = ({ navigate, id }) => (
  <div className="min-h-screen bg-[#f8faff] p-6 flex items-center justify-center text-center font-sans">
    <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-100/50">
        <CheckCircle size={48} strokeWidth={3} />
      </div>
      <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Cảm ơn bạn!</h1>
      <p className="text-slate-500 font-bold mb-10 leading-relaxed px-4">
        Ý kiến của bạn đóng vai trò rất quan trọng trong việc xây dựng cộng đồng Đoàn vững mạnh.
      </p>
      <button
        onClick={() => navigate(`/app/member/surveys/results/${id}`)}
        className="w-full p-5 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
      >
        Xem kết quả
      </button>
    </div>
  </div>
);

export default TakeSurveyPage;
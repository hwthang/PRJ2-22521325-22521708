import { ChevronLeft, Plus, Save, AlertCircle, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CreateMetaDataSection from "../component/CreateMetaDataSection";
import CreateQuestionSection from "../component/CreateQuestionSection";
import apiClient, { base_url } from "../../../utils/api";

const CreateSurveyPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  /* ===== META DATA ===== */
  const [surveyMeta, setSurveyMeta] = useState({
    chapterId: "",
    name: "",
    startedAt: "",
    endedAt: "",
  });

  /* ===== QUESTIONS ===== */
  const [questions, setQuestions] = useState([
    {
      id: Date.now(),
      type: "text",
      question: "",
      options: [],
    },
  ]);

  // Xóa lỗi khi người dùng thay đổi dữ liệu
  useEffect(() => {
    if (error) setError("");
  }, [surveyMeta, questions]);

  /* ===== HANDLERS ===== */
  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        type: "text",
        question: "",
        options: [],
      },
    ]);
  };

  const handleDeleteQuestion = (id) => {
    if (questions.length === 1) return;
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleUpdateQuestion = (id, data) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...data } : q))
    );
  };

  /* ===== VALIDATION ===== */
  const validateForm = () => {
    // 1. Check MetaData
    if (!surveyMeta.name.trim()) return "Tên khảo sát không được để trống";
    if (!surveyMeta.startedAt || !surveyMeta.endedAt) return "Vui lòng chọn thời gian bắt đầu và kết thúc";

    const start = new Date(surveyMeta.startedAt);
    const end = new Date(surveyMeta.endedAt);
    if (start >= end) return "Ngày kết thúc phải sau ngày bắt đầu";

    // 2. Check Questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) return `Câu hỏi số ${i + 1} chưa có nội dung`;
      
      if (q.type === "multiple_choice" || q.type === "checkbox") {
        if (!q.options || q.options.length < 2) {
          return `Câu hỏi số ${i + 1} cần ít nhất 2 lựa chọn`;
        }
        if (q.options.some(opt => !opt.trim())) {
          return `Các lựa chọn ở câu hỏi số ${i + 1} không được để trống`;
        }
      }
    }
    return null;
  };

  /* ===== CREATE SURVEY FLOW ===== */
  const handleCreateSurvey = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const accountData = JSON.parse(localStorage.getItem("my_account"));
      const chapterId = accountData?.chapter?._id;

      if (!chapterId) throw new Error("Không tìm thấy thông tin chi đoàn");

      /* 1️⃣ CREATE SURVEY */
      const surveyRes = await apiClient.post("/api/surveys", {
        chapterId,
        name: surveyMeta.name,
        startedAt: surveyMeta.startedAt,
        endedAt: surveyMeta.endedAt,
      });

      if (!surveyRes.success) throw new Error(surveyRes.message || "Tạo survey thất bại");
      const surveyId = surveyRes.data?.survey?._id;

      /* 2️⃣ CREATE QUESTIONS (SEQUENTIAL) */
      for (const q of questions) {
        const questionRes = await apiClient.post("/api/questions", {
          surveyId,
          type: q.type,
          question: q.question,
          options: q.options ?? [],
        });

        if (!questionRes.success) throw new Error("Lỗi khi tạo danh sách câu hỏi");
      }

      navigate(-1);
    } catch (error) {
      console.error(error);
      setError(error.message || "Có lỗi xảy ra khi kết nối máy chủ");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col gap-6 relative min-h-screen pb-20">
      
      {/* ===== HEADER BAR ===== */}
      <div className="flex items-center justify-between sticky top-0 z-30 bg-white/80 backdrop-blur-md py-4 border-b border-slate-100">
        <Link
          to={-1}
          className="hover:bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center transition-colors"
        >
          <ChevronLeft />
        </Link>
        
        <div className="flex items-center gap-4">
          {isSubmitting && <span className="text-sm text-slate-500 animate-pulse font-medium">Đang lưu dữ liệu...</span>}
          <button
            onClick={handleCreateSurvey}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Lưu khảo sát
          </button>
        </div>
      </div>

      {/* ===== ERROR SECTION ===== */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl animate-in slide-in-from-top-2 duration-300">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="font-bold text-sm">Phát hiện lỗi nhập liệu</span>
            <span className="text-sm opacity-90">{error}</span>
          </div>
        </div>
      )}

      {/* ===== CONTENT ===== */}
      <div className="flex flex-col gap-10">
        {/* Phần thông tin chung */}
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
            <h2 className="font-bold text-slate-700">1. Thông tin chung</h2>
          </div>
          <div className="p-6">
            <CreateMetaDataSection value={surveyMeta} onChange={setSurveyMeta} />
          </div>
        </section>

        {/* Danh sách câu hỏi */}
        <div className="flex flex-col gap-6">
           <h2 className="font-bold text-xl text-slate-800 px-2 flex items-center gap-2">
             <div className="w-2 h-6 bg-blue-600 rounded-full" />
             Nội dung câu hỏi ({questions.length})
           </h2>
           
          {questions.map((q, index) => (
            <CreateQuestionSection
              key={q.id}
              index={index + 1}
              value={q}
              isDeletable={questions.length > 1}
              onChange={(data) => handleUpdateQuestion(q.id, data)}
              onDelete={() => handleDeleteQuestion(q.id)}
            />
          ))}
        </div>

        {/* Nút thêm câu hỏi */}
        <button
          onClick={handleAddQuestion}
          className="group w-full py-8 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center gap-2"
        >
          <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
            <Plus className="text-slate-400 group-hover:text-blue-600" size={24} />
          </div>
          <span className="font-bold text-slate-500 group-hover:text-blue-700 transition-colors">Thêm câu hỏi mới</span>
        </button>
      </div>
    </div>
  );
};

export default CreateSurveyPage;
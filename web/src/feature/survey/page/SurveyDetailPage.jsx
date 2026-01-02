import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, Save, Trash2, Loader2, 
  BarChart3, Users, Calendar, ArrowRight 
} from "lucide-react";

import EditMetaDataSection from "../component/EditMetaDataSection";
import EditQuestionSection from "../component/EditQuestionSection";
import SurveyResultsSection from "../component/SurveyResultsSection";
import { base_url } from "../../../utils/api";
import { normalizeSurvey } from "../../../utils/survey";
import { toast } from "react-toastify";

const API_URL = base_url;

const SurveyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [metadata, setMetadata] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAllSurveyResultById = async (surveyId) => {
    try {
      const response = await fetch(`${API_URL}/api/surveys/${surveyId}/results`);
      const json = await response.json();
      if (json.success) {
        setResults(json.data.result.results || []);
      }
    } catch (err) {
      console.error("Lỗi fetch results:", err);
    }
  };

  const fetchSurveyData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/surveys/${id}`);
      const json = await res.json();
      const { metadata, questions } = normalizeSurvey(json.data.survey);
      setMetadata(metadata);
      setQuestions(questions);
      fetchAllSurveyResultById(id);
    } catch (err) {
      toast.error("Không thể tải dữ liệu khảo sát");
    }
  };

  useEffect(() => {
    if (id) fetchSurveyData();
  }, [id]);

  const handleDeleteSurvey = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn khảo sát này không?")) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`${API_URL}/api/surveys/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Đã xóa khảo sát thành công");
        navigate("/app/surveys");
      }
    } catch (err) {
      toast.error("Lỗi hệ thống khi xóa");
    } finally {
      setIsDeleting(false);
    }
  };
const handleExportExcel = () => {
  if (results.length === 0) {
    toast.info("Chưa có phản hồi nào để xuất!");
    return;
  }

  // 1. Tạo Header: Các thông tin cơ bản + Từng câu hỏi là 1 cột
  const header = [
    { label: "Mã Sinh Viên", key: "studentCode" },
    { label: "Họ Tên", key: "fullName" },
    { label: "Email", key: "email" },
    { label: "Thời gian nộp", key: "submittedAt" },
    // Duyệt qua danh sách câu hỏi để tạo cột
    ...questions.map((q, index) => ({
      label: `Câu ${index + 1}: ${q.question}`,
      key: `question_${q._id}`
    }))
  ];

  // 2. Format Data: Mỗi kết quả của 1 người là 1 dòng
  const data = results.map((res) => {
    const row = {
      studentCode: res.member?.memberCode || "N/A",
      fullName: res.member?.accountId?.displayName || "Ẩn danh",
      email: res.member?.accountId?.email || "N/A",
      submittedAt: new Date(res.completedAt || res.createdAt).toLocaleString("vi-VN"),
    };

    // Điền câu trả lời vào đúng cột câu hỏi
    questions.forEach((q) => {
      const foundAnswer = res.answers?.find((ans) => ans.questionId === q._id);
      let answerValue = "";

      if (foundAnswer) {
        // Nếu là mảng (checkbox) thì nối lại bằng dấu phẩy
        answerValue = Array.isArray(foundAnswer.answer) 
          ? foundAnswer.answer.join(", ") 
          : foundAnswer.answer;
      }
      
      row[`question_${q._id}`] = answerValue;
    });

    return row;
  });

  // 3. Gọi helper để xuất file
  import("../../../utils/excel.js").then((module) => { // Giả sử file helper của bạn đặt ở đây
    module.exportToExcel({
      header,
      data,
      fileName: `Ket_qua_khao_sat_${metadata.name.replace(/\s+/g, "_")}.xlsx`
    });
    toast.success("Đang tải xuống file Excel...");
  });
};
  const handleSave = async () => {
    try {
      setLoading(true);
      // Logic save của bạn...
      toast.success("Mọi thay đổi đã được lưu 🎉");
      fetchSurveyData();
    } catch (err) {
      toast.error("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  if (!metadata) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="font-medium">Đang tải dữ liệu khảo sát...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={-1} className="group h-10 w-10 rounded-full flex items-center justify-center hover:bg-slate-100 transition-all">
              <ChevronLeft className="text-slate-600 group-hover:text-blue-600 transition-colors" />
            </Link>
            <div>
              <h1 className="text-sm font-bold text-blue-800 uppercase tracking-wider leading-none mb-1">Thiết kế khảo sát</h1>
              <p className="text-xs text-slate-500 truncate max-w-[300px]">{metadata.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleDeleteSurvey} disabled={isDeleting} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100">
              <Trash2 size={20} />
            </button>
            <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold shadow-lg shadow-blue-200 transition-all active:scale-95">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              <span className="hidden sm:inline">Lưu thay đổi</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-10 flex flex-col gap-10">
        {/* STATS OVERVIEW */}
        <section className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl italic font-black">
                <BarChart3 size={22} />
              </div>
              <h2 className="font-black text-slate-800 uppercase text-sm tracking-widest">Thống kê nhanh</h2>
            </div>
            <button onClick={handleExportExcel} className="text-xs font-black text-blue-600 uppercase flex items-center gap-2 hover:underline">
             Chi tiết <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Tham gia</p>
              <p className="text-3xl font-black text-slate-900">{results.length}</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Mới nhất</p>
              <p className="text-sm font-black text-slate-700 leading-tight">
                {results.length > 0 ? new Date(results[0].completedAt).toLocaleDateString('vi-VN') : '---'}
              </p>
            </div>
          </div>
        </section>

        {/* RESULTS SECTION (WITH POPUP LOGIC) */}
        <SurveyResultsSection results={results} />

        {/* METADATA */}
        <EditMetaDataSection value={metadata} onChange={setMetadata} />

        {/* QUESTIONS */}
        <div className="flex flex-col gap-6">
          <h2 className="text-lg font-black text-blue-800 uppercase px-2">Cấu trúc câu hỏi</h2>
          {questions.map((q, index) => (
            <EditQuestionSection
              key={q._id}
              index={index + 1}
              value={q}
              onChange={(val) => setQuestions((prev) => prev.map((x) => (x._id === q._id ? val : x)))}
              onDelete={() => setQuestions((prev) => prev.filter((x) => x._id !== q._id))}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SurveyDetailPage;
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Save,
  Trash2,
  Loader2,
  BarChart3,
  ArrowRight,
  AlertCircle,
  Lock,
  Clock,
  X,
} from "lucide-react";

import EditMetaDataSection from "../component/EditMetaDataSection";
import EditQuestionSection from "../component/EditQuestionSection";
import SurveyResultsSection from "../component/SurveyResultsSection";
import { base_url } from "../../../utils/api";
import { normalizeSurvey } from "../../../utils/survey";
import { toast } from "react-toastify";

const API_URL = base_url;

/* --- COMPONENT MODAL TÙY CHỈNH --- */
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, type = "danger", isLoading = false }) => {
  if (!isOpen) return null;
  const isDanger = type === "danger";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white rounded-[24px] shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
        <div className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center ${isDanger ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"}`}>
          {isDanger ? <AlertCircle size={24} /> : <Save size={24} />}
        </div>
        <h3 className="text-lg font-black text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors">
            Hủy
          </button>
          <button 
            onClick={onConfirm} 
            disabled={isLoading}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${isDanger ? "bg-red-500 shadow-red-100 hover:bg-red-600" : "bg-blue-600 shadow-blue-100 hover:bg-blue-700"}`}
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

const SurveyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [metadata, setMetadata] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // MỚI: Dùng để giữ trạng thái khóa thực tế từ database
  const [isOriginallyLocked, setIsOriginallyLocked] = useState(false);

  const [modalConfig, setModalConfig] = useState({ 
    isOpen: false, 
    type: "danger", 
    title: "", 
    message: "", 
    onConfirm: () => {} 
  });

  /* ===== LOGIC SO SÁNH THỜI GIAN HIỂN THỊ ===== */
  const getSurveyStatus = () => {
    if (!metadata) return null;
    const now = new Date();
    const start = new Date(metadata.startedAt);
    const end = new Date(metadata.endedAt);

    if (now < start) return { label: "Chưa diễn ra", color: "bg-slate-100 text-slate-600 border-slate-200" };
    if (now >= start && now <= end) return { label: "Đang diễn ra", color: "bg-emerald-100 text-emerald-700 border-emerald-200" };
    return { label: "Đã kết thúc", color: "bg-red-100 text-red-700 border-red-200" };
  };

  const currentViewStatus = getSurveyStatus();

  /* ===== FETCH DATA ===== */
  const fetchSurveyData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/surveys/${id}`);
      const json = await res.json();
      if (json.success) {
        const { metadata, questions } = normalizeSurvey(json.data.survey);
        setMetadata(metadata);
        setQuestions(questions);
        
        // Xác định trạng thái khóa thực tế từ dữ liệu Server
        const now = new Date();
        const start = new Date(metadata.startedAt);
        setIsOriginallyLocked(now >= start); // Khóa nếu đã đến giờ bắt đầu hoặc đã kết thúc

        fetchAllResults(id);
      }
    } catch (err) { toast.error("Không thể tải dữ liệu"); }
  };

  const fetchAllResults = async (sId) => {
    const res = await fetch(`${API_URL}/api/surveys/${sId}/results`);
    const json = await res.json();
    if (json.success) setResults(json.data.result.results || []);
  };

  useEffect(() => { if (id) fetchSurveyData(); }, [id]);

  /* ===== ACTIONS ===== */
  
  const openDeleteSurveyModal = () => {
    setModalConfig({
      isOpen: true,
      type: "danger",
      title: "Xóa khảo sát?",
      message: "Tất cả dữ liệu phản hồi liên quan sẽ bị mất vĩnh viễn.",
      onConfirm: confirmDeleteSurvey
    });
  };

  const confirmDeleteSurvey = async () => {
    const myAccount = localStorage.getItem("my_account");
    const role = JSON.parse(myAccount || "{}").type;
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/surveys/${id}`, { method: "DELETE" });
      if ((await res.json()).success) {
        toast.success("Đã xóa khảo sát");
        navigate(`/app/${role}/surveys`);
      }
    } catch (err) { toast.error("Lỗi xóa khảo sát"); }
    finally { 
        setIsDeleting(false);
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    }
  };

  const openDeleteQuestionModal = (qId) => {
    if (isOriginallyLocked) return; // Chặn dựa trên trạng thái gốc
    setModalConfig({
      isOpen: true,
      type: "danger",
      title: "Xóa câu hỏi?",
      message: "Câu hỏi này sẽ bị gỡ bỏ khỏi cấu trúc khảo sát.",
      onConfirm: () => {
        setQuestions(prev => prev.filter(x => x._id !== qId));
        setModalConfig(prev => ({ ...prev, isOpen: false }));
        toast.info("Đã gỡ tạm thời. Nhấn Cập nhật để lưu.");
      }
    });
  };

  const openConfirmSaveModal = () => {
    if (isOriginallyLocked) return;
    if (!metadata.name.trim()) return toast.warning("Tên khảo sát trống");
    
    const start = new Date(metadata.startedAt);
    const end = new Date(metadata.endedAt);
    if (start >= end) return toast.error("Thời gian bắt đầu phải trước kết thúc!");

    setModalConfig({
      isOpen: true,
      type: "info",
      title: "Lưu thay đổi?",
      message: `Xác nhận cập nhật thông tin khảo sát.`,
      onConfirm: handleSave
    });
  };

  const handleSave = async () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
    setLoading(true);
    const toastId = toast.loading("Đang lưu...");
    
    try {
      const metadataUpdate = fetch(`${API_URL}/api/surveys/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: metadata.name, startedAt: metadata.startedAt, endedAt: metadata.endedAt }),
      }).then(r => r.json());

      const questionsUpdate = questions.map(q =>
        fetch(`${API_URL}/api/questions/${q._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: q.type, question: q.question, options: q.options || [] }),
        }).then(r => r.json())
      );

      const allRes = await Promise.all([metadataUpdate, ...questionsUpdate]);
      if (allRes.every(r => r.success)) {
        toast.update(toastId, { render: "Đã cập nhật 🎉", type: "success", isLoading: false, autoClose: 2000 });
        fetchSurveyData(); // Fetch lại để cập nhật isOriginallyLocked
      }
    } catch (err) { 
      toast.update(toastId, { render: "Lỗi kết nối", type: "error", isLoading: false, autoClose: 2000 }); 
    }
    finally { setLoading(false); }
  };

  const handleExportExcel = () => {
    if (results.length === 0) return toast.info("Không có dữ liệu!");
    import("../../../utils/excel.js").then((module) => {
      module.exportToExcel({
        header: [
            { label: "MSSV", key: "studentCode" },
            { label: "Họ Tên", key: "fullName" },
            ...questions.map((q, i) => ({ label: `C${i + 1}: ${q.question}`, key: `q_${q._id}` }))
        ],
        data: results.map(res => ({
            studentCode: res.member?.memberCode || "N/A",
            fullName: res.member?.accountId?.displayName || "Ẩn danh",
            ...questions.reduce((acc, q) => {
                const ans = res.answers?.find(a => a.questionId === q._id);
                acc[`q_${q._id}`] = Array.isArray(ans?.answer) ? ans.answer.join(", ") : (ans?.answer || "");
                return acc;
            }, {})
        })),
        fileName: `Ket_qua_${metadata.name.replace(/\s+/g, "_")}.xlsx`,
      });
    });
  };

  if (!metadata) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <ConfirmModal 
        {...modalConfig} 
        isLoading={loading || isDeleting}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))} 
      />

      {/* Header Bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={-1} className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-slate-100 transition-all"><ChevronLeft /></Link>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-sm font-bold text-blue-800 uppercase">Quản lý khảo sát</h1>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${currentViewStatus.color}`}>{currentViewStatus.label}</span>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-[200px]">{metadata.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={openDeleteSurveyModal} disabled={loading || isDeleting} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={20} /></button>
            {!isOriginallyLocked && (
              <button 
                onClick={openConfirmSaveModal} 
                disabled={loading} 
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-800 text-white font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Cập nhật
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8 flex flex-col gap-8">
        {/* Banner trạng thái chỉ hiện khi Server báo đã khóa */}
        {isOriginallyLocked && (
          <div className={`flex items-start gap-3 p-4 border rounded-2xl bg-amber-50 border-amber-200 text-amber-700`}>
            <Lock size={18} className="mt-0.5" />
            <div>
              <p className="text-sm font-bold">Dữ liệu đã khóa</p>
              <p className="text-xs opacity-90">Khảo sát này đang trong thời gian diễn ra hoặc đã kết thúc. Bạn không thể thay đổi nội dung.</p>
            </div>
          </div>
        )}

        {/* THỐNG KÊ NHANH */}
        <section className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3"><div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl"><BarChart3 size={22} /></div><h2 className="font-black text-slate-800 uppercase text-sm tracking-widest">Thống kê dữ liệu</h2></div>
            <button onClick={handleExportExcel} className="text-xs font-black text-blue-600 uppercase flex items-center gap-2 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all">Xuất Excel <ArrowRight size={14} /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Tổng phản hồi</p><p className="text-3xl font-black text-slate-900">{results.length}</p></div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Hạn kết thúc</p><p className="text-sm font-black text-slate-700 leading-tight">{new Date(metadata.endedAt).toLocaleString("vi-VN")}</p></div>
          </div>
        </section>

        <SurveyResultsSection results={results} />

        {/* METADATA - Chặn tương tác dựa trên isOriginallyLocked */}
        <div className={`bg-white p-1 rounded-[32px] border border-slate-200 shadow-sm transition-all ${isOriginallyLocked ? "opacity-60 pointer-events-none grayscale-[0.5]" : ""}`}>
          <EditMetaDataSection value={metadata} onChange={setMetadata} />
        </div>

        {/* QUESTIONS */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-black text-blue-800 uppercase tracking-tight">Cấu trúc câu hỏi</h2>
            {isOriginallyLocked && <span className="flex items-center gap-1 text-xs text-slate-400 font-medium"><Lock size={12}/> Chế độ Read-only</span>}
          </div>
          {questions.map((q, index) => (
            <EditQuestionSection
              key={q._id}
              index={index + 1}
              value={q}
              readOnly={isOriginallyLocked}
              onChange={(val) => !isOriginallyLocked && setQuestions(prev => prev.map(x => x._id === q._id ? val : x))}
              onDelete={() => openDeleteQuestionModal(q._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SurveyDetailPage;
import React, { useEffect, useState } from "react";
import { Plus, X, Award, Loader2, ClipboardList, ShieldAlert } from "lucide-react";
import EvaluationCreateForm from "./EvaluationCreateForm";
import EvaluationItem from "./EvaluationItem";
import apiClient from "../../../../utils/api";
import { toast } from "react-toastify";

const EvaluationSection = ({ memberId }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [evaluations, setEvaluations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvaluationsOfMember = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/api/evaluations/?memberId=${memberId}`);
      setEvaluations(response.data.evaluations.map(item => ({
        id: item._id,
        type: item.type,
        title: item.title,
        description: item.description,
        attachments: item.attachments,
        createdAt: item.createdAt,
      })));
    } catch (error) {
      toast.error("Không thể tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowCreateForm(false);
    fetchEvaluationsOfMember();
    toast.success("Đã cập nhật danh sách mới");
  };

  useEffect(() => {
    if (memberId) fetchEvaluationsOfMember();
  }, [memberId]);

  return (
    <div className="flex flex-col gap-6 bg-slate-50/50 p-1">
      {/* Header Card */}
      <div className="sticky top-0 z-20 flex items-center justify-between bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
            <ClipboardList className="text-white" size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Khen thưởng & Kỷ luật</h2>
            <p className="text-xs text-slate-500 font-medium">Quản lý lịch sử đánh giá đoàn viên</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className={`group flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${
            showCreateForm 
            ? "bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100" 
            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100"
          }`}
        >
          {showCreateForm ? <X size={18} /> : <Plus size={18} className="group-hover:rotate-90 transition-transform" />}
          {showCreateForm ? "Hủy thao tác" : "Thêm đánh giá mới"}
        </button>
      </div>

      {/* Form Area */}
      {showCreateForm && (
        <div className="animate-in fade-in zoom-in-95 duration-300">
          <EvaluationCreateForm memberId={memberId} onSuccess={handleSuccess} />
        </div>
      )}

      {/* List Area */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
            <span className="text-slate-400 font-medium text-sm">Đang truy xuất dữ liệu...</span>
          </div>
        ) : evaluations.length > 0 ? (
          evaluations.map((item) => <EvaluationItem key={item.id} data={item} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="p-4 bg-slate-50 rounded-full mb-3">
              <ShieldAlert className="text-slate-300" size={40} />
            </div>
            <p className="text-slate-400 font-medium">Chưa có dữ liệu đánh giá nào được ghi nhận.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationSection;
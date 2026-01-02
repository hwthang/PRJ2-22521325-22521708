import React, { useState } from "react";
import { Check, Award, XCircle, Loader2, CloudUpload, FileText, Trash2 } from "lucide-react";
import CustomInput from "../../../component/custom/CustomInput";
import CustomTextArea from "../../../component/custom/CustomTextArea";
import DragDropUpload from "../../../component/DragDropUpload";
import useForm from "../../../../core/hooks/useForm";
import apiClient from "../../../../utils/api";
import { toast } from "react-toastify";

const EvaluationCreateForm = ({ memberId, onSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const formInstance = useForm({ type: "reward", title: "", description: "" });

  const handleSubmit = async () => {
    if (!formInstance.form.title || !formInstance.form.description) {
      return toast.warning("Vui lòng nhập đầy đủ thông tin");
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("memberId", memberId);
      formData.append("type", formInstance.form.type);
      formData.append("title", formInstance.form.title);
      formData.append("description", formInstance.form.description);
      selectedFiles.forEach(file => formData.append("attachments", file));

      await apiClient.post("/api/evaluations", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSuccess();
    } catch (error) {
      toast.error("Lỗi hệ thống, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-8">
          <CustomInput
            label="Tiêu đề đánh giá"
            name="title"
            value={formInstance.form.title}
            onChange={(e) => formInstance.handleChangeFieldInForm("title", e.target.value)}
            placeholder="Ví dụ: Khen thưởng chiến dịch tình nguyện hè..."
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <label className="block text-sm font-bold text-slate-700 mb-2">Phân loại</label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            {[{v: 'reward', l: 'Khen', c: 'bg-emerald-500'}, {v: 'discipline', l: 'Kỷ luật', c: 'bg-rose-500'}].map(opt => (
              <button
                key={opt.v}
                onClick={() => formInstance.handleChangeFieldInForm("type", opt.v)}
                className={`py-2 rounded-lg text-sm font-bold transition-all ${
                  formInstance.form.type === opt.v ? `${opt.c} text-white shadow-sm` : "text-slate-500 hover:bg-white/50"
                }`}
              >
                {opt.l}
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-12">
          <CustomTextArea
            label="Nội dung chi tiết"
            name="description"
            rows={4}
            value={formInstance.form.description}
            onChange={(e) => formInstance.handleChangeFieldInForm("description", e.target.value)}
            placeholder="Nhập chi tiết lý do khen thưởng hoặc nội dung kỷ luật..."
          />
        </div>

        <div className="col-span-12">
          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
            <CloudUpload size={18} className="text-slate-400" /> Hồ sơ đính kèm
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DragDropUpload onFile={(fs) => setSelectedFiles([...selectedFiles, ...fs])} multiple={true} />
            <div className="space-y-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
              {selectedFiles.map((f, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 truncate">
                    <FileText size={16} className="text-indigo-500" />
                    <span className="text-xs font-medium text-slate-600 truncate">{f.name}</span>
                  </div>
                  <button onClick={() => setSelectedFiles(selectedFiles.filter((_, idx) => idx !== i))} className="text-rose-500 hover:bg-rose-50 p-1 rounded-md">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 flex justify-end gap-3 mt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-10 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 disabled:opacity-50 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
            {loading ? "Đang xử lý dữ liệu..." : "Xác nhận lưu hồ sơ"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationCreateForm;
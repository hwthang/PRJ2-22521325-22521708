import React from "react";
import { Trash2, Plus, List, HelpCircle } from "lucide-react";
import CustomInput from "../../component/custom/CustomInput";

const QUESTION_TYPES = [
  { label: "Trả lời ngắn", value: "text" },
  { label: "Một lựa chọn", value: "single" },
  { label: "Nhiều lựa chọn", value: "multiple" },
];

const CreateQuestionSection = ({ index, value, onChange, onDelete, isDeletable }) => {
  const update = (data) => onChange({ ...value, ...data });

  const updateOption = (idx, val) => {
    const newOptions = [...(value.options || [])];
    newOptions[idx] = val;
    update({ options: newOptions });
  };

  const addOption = () => update({ options: [...(value.options || []), ""] });

  const removeOption = (idx) => {
    update({ options: value.options.filter((_, i) => i !== idx) });
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Header: Số thứ tự câu hỏi */}
      <div className="bg-slate-50/50 px-6 py-3 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-800 text-white text-sm font-bold">
            {index}
          </span>
          <h3 className="font-bold text-blue-800">Câu hỏi mới</h3>
        </div>
        {isDeletable && (
          <button
            onClick={onDelete}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Xóa câu hỏi"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="p-6 flex flex-col gap-6">
        {/* Nội dung câu hỏi */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 ml-1">
            <HelpCircle size={16} className="text-blue-800" />
            <label className="text-sm font-bold text-blue-800">Nội dung câu hỏi</label>
          </div>
          <CustomInput
            placeholder="Ví dụ: Bạn cảm thấy dịch vụ của chúng tôi thế nào?"
            value={value.question}
            onChange={(e) => update({ question: e.target.value })}
            className="focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Loại câu hỏi */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 ml-1">
            <List ordered size={16} className="text-blue-800" />
            <label className="text-sm font-bold text-blue-800">Loại câu hỏi</label>
          </div>
          <select
            value={value.type}
            onChange={(e) => update({ type: e.target.value, options: e.target.value === 'text' ? [] : [""] })}
            className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all cursor-pointer"
          >
            {QUESTION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Phần Options (nếu không phải text) */}
        {(value.type === "single" || value.type === "multiple") && (
          <div className="space-y-3 pt-2">
            <label className="text-xs uppercase tracking-wider font-black text-slate-400 ml-1">
              Các lựa chọn trả lời
            </label>

            <div className="grid gap-3">
              {value.options?.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2">
                  <div className={`w-5 h-5 border-2 border-slate-300 ${value.type === 'single' ? 'rounded-full' : 'rounded-md'} bg-slate-100 flex-shrink-0`} />
                  <input
                    value={opt}
                    onChange={(e) => updateOption(idx, e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 h-10 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                    placeholder={`Lựa chọn ${idx + 1}`}
                  />
                  <button
                    onClick={() => removeOption(idx)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addOption}
              className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-blue-800 hover:bg-blue-50 border border-dashed border-blue-200 transition-all w-full justify-center"
            >
              <Plus size={16} />
              Thêm lựa chọn
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateQuestionSection;
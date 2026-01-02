import React from "react";
import { Trash2, Plus, Settings2, AlignLeft } from "lucide-react";
import CustomInput from "../../component/custom/CustomInput";

const QUESTION_TYPES = [
  { label: "Trả lời ngắn", value: "text" },
  { label: "Một lựa chọn", value: "single" },
  { label: "Nhiều lựa chọn", value: "multiple" },
];

const EditQuestionSection = ({ index, value, onChange, onDelete }) => {
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
    <div className="bg-white rounded-2xl border border-blue-100 shadow-sm ring-1 ring-blue-50 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-800 px-6 py-3 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <Settings2 size={18} />
          <span className="font-bold text-sm tracking-wide uppercase">Chỉnh sửa câu hỏi {index}</span>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6">
        {/* Câu hỏi */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-blue-800 ml-1">Nội dung câu hỏi</label>
          <CustomInput
            value={value.question || ""}
            onChange={(e) => update({ question: e.target.value })}
            className="w-full focus:ring-blue-100"
          />
        </div>

        {/* Loại */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-blue-800 ml-1">Loại câu hỏi</label>
          <select
            value={value.type}
            onChange={(e) => update({
              type: e.target.value,
              options: e.target.value === "text" ? [] : (value.options || [""])
            })}
            className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all bg-slate-50/50"
          >
            {QUESTION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Options */}
        {(value.type === "single" || value.type === "multiple") && (
          <div className="bg-slate-50/50 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <AlignLeft size={16} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-500 uppercase">Danh sách lựa chọn</span>
            </div>
            
            <div className="space-y-3">
              {value.options?.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${value.type === 'single' ? 'bg-blue-400' : 'bg-indigo-400'}`} />
                  <input
                    value={opt}
                    onChange={(e) => updateOption(idx, e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 h-10 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition-all shadow-sm"
                  />
                  <button onClick={() => removeOption(idx)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addOption}
              className="mt-3 text-sm font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 transition-colors ml-1"
            >
              <Plus size={16} /> Thêm phương án
            </button>
          </div>
        )}
      </div>

      {/* Footer Action */}
      <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
        <button
          onClick={onDelete}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
        >
          <Trash2 size={16} />
          Xóa câu hỏi này
        </button>
      </div>
    </div>
  );
};

export default EditQuestionSection;
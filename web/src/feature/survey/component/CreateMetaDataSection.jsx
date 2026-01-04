import React from "react";
import { Calendar, PenLine, Info, Clock } from "lucide-react";
import CustomInput from "../../component/custom/CustomInput";

const CreateMetaDataSection = ({ value, onChange }) => {
  const handleChange = (field, val) => {
    onChange({
      ...value,
      [field]: val,
    });
  };

  // Lấy thời gian hiện tại định dạng ISO (YYYY-MM-DDTHH:mm) để làm mốc 'min'
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const minDateTime = getCurrentDateTime();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
        <div className="p-2.5 bg-blue-50 rounded-xl">
          <Info className="w-6 h-6 text-blue-800" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-blue-800 tracking-tight">
            Thông tin khảo sát
          </h2>
          <p className="text-sm font-medium text-slate-500">
            Cung cấp các thông tin cơ bản để bắt đầu chiến dịch khảo sát
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-12 gap-x-6 gap-y-8">
        {/* Tên khảo sát */}
        <div className="col-span-12 lg:col-span-6">
          <label className="flex items-center gap-2 mb-2.5 text-sm font-bold text-blue-800 ml-1">
            <PenLine className="w-4 h-4" />
            Tên khảo sát
          </label>
          <CustomInput
            placeholder="Nhập tên khảo sát của bạn..."
            className="w-full border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
            value={value.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        {/* Ngày bắt đầu */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <label className="flex items-center gap-2 mb-2.5 text-sm font-bold text-blue-800 ml-1">
            <Clock className="w-4 h-4 text-blue-700" />
            Thời gian bắt đầu
          </label>
          <CustomInput
            type="datetime-local" // Sử dụng datetime-local để chọn cả ngày và giờ
            min={minDateTime}     // Chặn chọn thời gian trong quá khứ
            className="w-full border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
            value={value.startedAt || ""}
            onChange={(e) => handleChange("startedAt", e.target.value)}
          />
        </div>

        {/* Ngày kết thúc */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <label className="flex items-center gap-2 mb-2.5 text-sm font-bold text-blue-800 ml-1">
            <Calendar className="w-4 h-4 text-blue-700" />
            Thời gian kết thúc
          </label>
          <CustomInput
            type="datetime-local"
            // Ngày kết thúc tối thiểu phải là Ngày bắt đầu (nếu đã chọn) hoặc Hiện tại
            min={value.startedAt || minDateTime} 
            className="w-full border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
            value={value.endedAt || ""}
            onChange={(e) => handleChange("endedAt", e.target.value)}
          />
        </div>
      </div>

      {/* Helper Text cho người dùng */}
      {(value.startedAt && value.endedAt && new Date(value.startedAt) >= new Date(value.endedAt)) && (
        <div className="mt-4 flex items-center gap-2 text-red-600 text-xs font-bold animate-pulse">
          <Info size={14} />
          <span>Lưu ý: Thời gian kết thúc phải sau thời gian bắt đầu ít nhất 1 phút.</span>
        </div>
      )}
    </div>
  );
};

export default CreateMetaDataSection;
import React from "react";
import { Calendar, FileText, Settings2 } from "lucide-react"; // Sử dụng lucide-react cho icon
import CustomInput from "../../component/custom/CustomInput";

const EditMetaDataSection = ({ value, onChange }) => {
  const handleChange = (field, val) => {
    onChange({
      ...value,
      [field]: val,
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 transition-all duration-300 text-blue-800">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-50 rounded-2xl">
          <Settings2 className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">
            Thông tin khảo sát
          </h2>
          <p className="text-sm font-medium text-slate-400">
            Cấu hình các thông số cơ bản cho chiến dịch
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-12 gap-y-6 gap-x-4">
        <div className="col-span-12 lg:col-span-6 group">
          <div className="flex items-center gap-2 mb-2 ml-1">
            <FileText className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <span className="text-sm font-semibold text-slate-600">Tên khảo sát</span>
          </div>
          <CustomInput
            placeholder="Nhập tên khảo sát..."
            className="w-full transition-all duration-200 focus:ring-4 focus:ring-blue-100"
            value={value.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-3 group">
          <div className="flex items-center gap-2 mb-2 ml-1">
            <Calendar className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <span className="text-sm font-semibold text-slate-600">Ngày bắt đầu</span>
          </div>
          <CustomInput
            type="date"
            className="w-full transition-all duration-200 focus:ring-4 focus:ring-blue-100"
            value={value.startedAt || ""}
            onChange={(e) => handleChange("startedAt", e.target.value)}
          />
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-3 group">
          <div className="flex items-center gap-2 mb-2 ml-1">
            <Calendar className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <span className="text-sm font-semibold text-slate-600">Ngày kết thúc</span>
          </div>
          <CustomInput
            type="date"
            className="w-full transition-all duration-200 focus:ring-4 focus:ring-blue-100"
            value={value.endedAt || ""}
            onChange={(e) => handleChange("endedAt", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default EditMetaDataSection;
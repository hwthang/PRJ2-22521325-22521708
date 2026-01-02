import React from "react";
import { Calendar, PenLine, Info } from "lucide-react";
import CustomInput from "../../component/custom/CustomInput";

const CreateMetaDataSection = ({ value, onChange }) => {
  const handleChange = (field, val) => {
    onChange({
      ...value,
      [field]: val,
    });
  };

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
            <Calendar className="w-4 h-4 text-blue-700" />
            Ngày bắt đầu
          </label>
          <CustomInput
            type="date"
            className="w-full border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
            value={value.startedAt || ""}
            onChange={(e) => handleChange("startedAt", e.target.value)}
          />
        </div>

        {/* Ngày kết thúc */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <label className="flex items-center gap-2 mb-2.5 text-sm font-bold text-blue-800 ml-1">
            <Calendar className="w-4 h-4 text-blue-700" />
            Ngày kết thúc
          </label>
          <CustomInput
            type="date"
            className="w-full border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
            value={value.endedAt || ""}
            onChange={(e) => handleChange("endedAt", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateMetaDataSection;
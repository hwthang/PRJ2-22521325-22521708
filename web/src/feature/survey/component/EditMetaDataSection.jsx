import React, { useEffect } from "react";
import { Calendar, FileText, Settings2, Clock } from "lucide-react";
import CustomInput from "../../component/custom/CustomInput";
import { formatForDatetimeLocal } from "../../../utils/date";

const EditMetaDataSection = ({ value, onChange }) => {
  const handleChange = (field, val) => {
    onChange({
      ...value,
      [field]: val,
    });
  };

  // Hàm lấy thời gian hiện tại định dạng YYYY-MM-DDTHH:mm để làm mốc 'min'
  const getCurrentDateTime = () => {
    const now = new Date();
    // Điều chỉnh múi giờ địa phương để hiển thị đúng định dạng input yêu cầu
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const minDateTime = getCurrentDateTime();
  useEffect(() => {
    console.log(value);
  }, []);
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
            Cấu hình các thông số cơ bản và thời gian chiến dịch
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-12 gap-y-6 gap-x-4">
        {/* Tên khảo sát */}
        <div className="col-span-12 lg:col-span-12 group">
          <div className="flex items-center gap-2 mb-2 ml-1">
            <FileText className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <span className="text-sm font-semibold text-slate-600">
              Tên khảo sát
            </span>
          </div>
          <CustomInput
            placeholder="Nhập tên khảo sát..."
            className="w-full transition-all duration-200 focus:ring-4 focus:ring-blue-100"
            value={value.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        {/* Ngày bắt đầu */}
        <div className="col-span-12 sm:col-span-6 group">
          <div className="flex items-center gap-2 mb-2 ml-1">
            <Clock className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <span className="text-sm font-semibold text-slate-600">
              Thời gian bắt đầu
            </span>
          </div>
          <CustomInput
            type="datetime-local"
            min={minDateTime} // Không cho phép chọn thời gian trong quá khứ
            className="w-full transition-all duration-200 focus:ring-4 focus:ring-blue-100"
            value={formatForDatetimeLocal(value.startedAt) || ""}
            onChange={(e) => handleChange("startedAt", e.target.value)}
          />
        </div>

        {/* Ngày kết thúc */}
        <div className="col-span-12 sm:col-span-6 group">
          <div className="flex items-center gap-2 mb-2 ml-1">
            <Calendar className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <span className="text-sm font-semibold text-slate-600">
              Thời gian kết thúc
            </span>
          </div>
          <CustomInput
            type="datetime-local"
            // Ràng buộc: Ngày kết thúc phải sau ngày bắt đầu (nếu có) hoặc sau hiện tại
            min={value.startedAt || minDateTime}
            className="w-full transition-all duration-200 focus:ring-4 focus:ring-blue-100"
            value={formatForDatetimeLocal(value.endedAt) || ""}
            onChange={(e) => handleChange("endedAt", e.target.value)}
          />
        </div>
      </div>

      {/* Cảnh báo lỗi logic nếu cần (Tùy chọn) */}
      {value.startedAt &&
        value.endedAt &&
        new Date(value.startedAt) >= new Date(value.endedAt) && (
          <p className="mt-4 text-xs font-bold text-red-500 flex items-center gap-1">
            ⚠️ Thời gian kết thúc phải lớn hơn thời gian bắt đầu.
          </p>
        )}
    </div>
  );
};

export default EditMetaDataSection;

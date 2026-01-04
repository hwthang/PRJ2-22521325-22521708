import React from "react";
import {
  User,
  Lock,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

/* ---------------- Data Field Component ---------------- */
const DataField = ({ icon: Icon, label, value, highlight = false, sensitive = false, error }) => (
  <div className="flex flex-col">
    <div className="flex items-start">
      <Icon className="w-4 h-4 text-gray-500 mr-2 mt-1" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-400 truncate">{label}</p>
        <p
          className={[
            "text-md break-words font-medium text-gray-800",
            highlight && "text-blue-600 font-semibold",
            sensitive && "font-mono text-gray-700",
          ].join(" ")}
        >
          {value || "---"}
        </p>
      </div>
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

/* ---------------- Status Badge UI ---------------- */
const StatusBadge = ({ status, message }) => {
  const baseClass =
    "inline-flex items-center px-2.5 py-0.5 text-base font-medium rounded-full ring-1 ring-inset";

  const badgeMap = {
    pending: {
      icon: Loader2,
      color: "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
      label: "Chờ xác thực",
    },
    success: {
      icon: CheckCircle2,
      color: "bg-green-50 text-green-700 ring-green-600/20",
      label: "Tạo thành công",
    },
    error: {
      icon: XCircle,
      color: "bg-red-50 text-red-700 ring-red-600/20",
      label: message || "Lỗi",
    },
  };

  const Icon = badgeMap[status].icon;

  return (
    <span className={`${baseClass} ${badgeMap[status].color}`}>
      <Icon className="h-4 w-4 mr-1" />
      {badgeMap[status].label}
    </span>
  );
};

/* ---------------- Main Component ---------------- */
const MemberImportExcelItem = ({ data, status = "pending", message = "", errors = {} }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN");
    } catch {
      return dateString;
    }
  };

  const fields = [
    { key: "fullName", label: "Họ và tên", value: data.fullName, icon: User, highlight: true },
    { key: "username", label: "Tên tài khoản", value: data.username, icon: User },
    { key: "password", label: "Mật khẩu", value: data.password, icon: Lock, sensitive: true },
    { key: "email", label: "Email", value: data.email, icon: Mail },
    { key: "phoneNumber", label: "Số điện thoại", value: data.phoneNumber, icon: Phone },
    { key: "memberCode", label: "Mã đoàn viên", value: data.memberCode, icon: User },
    { key: "gender", label: "Giới tính", value: data.gender, icon: User },
    { key: "dateOfBirth", label: "Ngày sinh", value: formatDate(data.dateOfBirth), icon: Calendar },
    { key: "hometown", label: "Quê quán", value: data.hometown, icon: MapPin },
    { key: "address", label: "Địa chỉ", value: data.address, icon: MapPin },
    { key: "ethnicity", label: "Dân tộc", value: data.ethnicity, icon: User },
    { key: "religion", label: "Tôn giáo", value: data.religion, icon: User },
    { key: "education", label: "Học vấn", value: data.education, icon: User },
    { key: "professionalLevel", label: "Trình độ chuyên môn", value: data.professionalLevel, icon: User },
    { key: "politicalTheory", label: "Lý luận chính trị", value: data.politicalTheory, icon: User },
    { key: "joinedAt", label: "Ngày vào Đoàn", value: formatDate(data.joinedAt), icon: Calendar },
    { key: "position", label: "Chức vụ", value: data.position, icon: User },
  ];

  return (
    <div className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200 hover:shadow-md transition duration-200">
      {/* HEADER */}
      <div className="mb-3 pb-3 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-blue-700 leading-snug">
          {data.fullName || "Chưa có tên"}
        </h3>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {fields.map((field) => (
          <DataField
            key={field.key}
            {...field}
            error={errors[field.key]} // truyền lỗi validate xuống DataField
          />
        ))}
      </div>

      {/* FOOTER – STATUS */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
        <StatusBadge status={status} message={message} />
      </div>
    </div>
  );
};

export default MemberImportExcelItem;

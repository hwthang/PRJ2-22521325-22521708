export const ROLE = [
  { value: "admin", label: "Quản trị", style: "bg-violet-100 text-violet-800" },
  { value: "manager", label: "Quản lý", style: "bg-cyan-100 tex-cyan-800" },
  { value: "member", label: "Đoàn viên", style: "bg-blue-100 text-blue-800" },
];

export const STATUS = [
  { value: "active", label: "Hoạt động", style: "bg-green-100 text-green-800" },
  { value: "locked", label: "Khóa", style: "bg-red-100 text-red-800" },
  {
    value: "pending",
    label: "Chờ duyệt",
    style: "bg-yellow-100 text-yellow-800",
  },
];

export const GENDER = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
];

export const POSITION = [
  { value: "bi_thu", label: "Bí thư" },
  { value: "pho_bi_thu", label: "Phó Bí thư" },
  { value: "uy_vien", label: "Ủy viên" },
  { value: "doan_vien", label: "Đoàn viên" },
];

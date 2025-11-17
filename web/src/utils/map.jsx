import { Ban, CircleCheck, ClockFading } from "lucide-react";

export const ROLE = [
  {
    value: "admin",
    label: "Quản trị",
    style: "bg-purple-200 text-purple-800",
  },
  {
    value: "manager",
    label: "Quản lý",
    style: "bg-teal-200 text-teal-800",
  },
  {
    value: "member",
    label: "Đoàn viên",
    style: "bg-cyan-200 text-cyan-800",
  },
];

export const STATUS = [
  {
    value: "active",
    label: "Hoạt động",
    style: "bg-green-200 text-green-800",
  },
  {
    value: "locked",
    label: "Khóa",
    style: "bg-red-200 text-red-800",
  },
  {
    value: "pending",
    label: "Chờ duyệt",
    style: "bg-yellow-200 text-yellow-800",
  },
];

export const GENDER = [
  {
    value: "male",
    label: "Nam",
    style: "bg-blue-200 text-blue-800",
  },
  {
    value: "female",
    label: "Nữ",
    style: "bg-pink-200 text-pink-800",
  },
];

export const POSITION = [
  {
    value: "bt",
    label: "Bí thư",
    style: "bg-amber-200 text-amber-800",
  },
  {
    value: "pbt",
    label: "Phó Bí thư",
    style: "bg-orange-200 text-orange-800",
  },
  {
    value: "uv",
    label: "Ủy viên",
    style: "bg-indigo-200 text-indigo-800",
  },
  {
    value: "dv",
    label: "Đoàn viên",
    style: "bg-cyan-200 text-cyan-800",
  },
];

export const STATUS_MAP = {
  active: {
    icon: <CircleCheck />,
    label: "Hoạt động",
    color: "bg-green-100 text-green-500", // Giảm độ đậm của nền để chữ nổi hơn
  },
  pending: {
    icon: <ClockFading />,
    label: "Chờ duyệt",
    color: "bg-yellow-100 text-yellow-700",
  },
  locked: {
    icon: <Ban />,
    label: "Đã khóa",
    color: "bg-red-100 text-red-700",
  },
};

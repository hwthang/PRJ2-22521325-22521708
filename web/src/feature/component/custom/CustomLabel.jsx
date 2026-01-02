import * as Icons from "lucide-react";

export const CustomLabel = ({
  label,
  color = "gray",
  icon,
  selected = false,
  disabled = false,
  clickable = true,
  onClick = () => {},
}) => {
  const colorClasses = {
    red: { bg: "bg-red-100", border: "border-red-500", text: "text-red-600" },
    orange: { bg: "bg-orange-100", border: "border-orange-500", text: "text-orange-600" },
    amber: { bg: "bg-amber-100", border: "border-amber-500", text: "text-amber-600" },
    yellow: { bg: "bg-yellow-100", border: "border-yellow-400", text: "text-yellow-600" },
    lime: { bg: "bg-lime-100", border: "border-lime-500", text: "text-lime-600" },
    green: { bg: "bg-green-100", border: "border-green-500", text: "text-green-600" },
    emerald: { bg: "bg-emerald-100", border: "border-emerald-500", text: "text-emerald-600" },
    teal: { bg: "bg-teal-100", border: "border-teal-500", text: "text-teal-600" },
    cyan: { bg: "bg-cyan-100", border: "border-cyan-500", text: "text-cyan-600" },
    sky: { bg: "bg-sky-100", border: "border-sky-500", text: "text-sky-600" },
    blue: { bg: "bg-blue-100", border: "border-blue-500", text: "text-blue-600" },
    indigo: { bg: "bg-indigo-100", border: "border-indigo-500", text: "text-indigo-600" },
    violet: { bg: "bg-violet-100", border: "border-violet-500", text: "text-violet-600" },
    purple: { bg: "bg-purple-100", border: "border-purple-500", text: "text-purple-600" },
    fuchsia: { bg: "bg-fuchsia-100", border: "border-fuchsia-500", text: "text-fuchsia-600" },
    pink: { bg: "bg-pink-100", border: "border-pink-500", text: "text-pink-600" },
    rose: { bg: "bg-rose-100", border: "border-rose-500", text: "text-rose-600" },
    gray: { bg: "bg-gray-200", border: "border-gray-500", text: "text-gray-600" },
  };

  const colorStyle = selected
    ? colorClasses[color] || colorClasses.gray
    : { bg: "bg-white", border: "border-gray-300", text: "text-gray-700" };

  const IconComponent = icon && Icons[icon] ? Icons[icon] : null;

  const clickableClass = !disabled && clickable ? "cursor-pointer" : "cursor-default";

  return (
    <div
      onClick={!disabled && clickable ? onClick : undefined}
      className={`
        px-3 py-1 rounded-md border h-10 min-w-[110px]
        flex items-center gap-2 justify-center text-sm
        ${colorStyle.bg} ${colorStyle.border} ${colorStyle.text}
        ${disabled ? "opacity-50 cursor-not-allowed" : clickableClass}
      `}
    >
      {IconComponent && <IconComponent size={16} strokeWidth={2} />}
      {label}
    </div>
  );
};

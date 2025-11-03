export const CheckOption = ({ options, value, onChange, colors, disabled = false }) => {
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

  return (
    <div className="flex gap-2 flex-wrap text-sm">
      {options.map((option) => {
        const isSelected = value === option;
        const color = colors[option] || "gray";

        const classes = isSelected
          ? `${colorClasses[color].bg} ${colorClasses[color].border} ${colorClasses[color].text}`
          : "bg-white border-gray-300 text-gray-700";

        const disabledClasses = disabled ? "cursor-not-allowed" : "cursor-pointer";

        return (
          <div
            key={option}
            onClick={() => !disabled && onChange(option)}
            className={`px-2 py-1 rounded-md border h-10 w-20 flex flex-1 items-center justify-center ${classes} ${disabledClasses}`}
          >
            {option}
          </div>
        );
      })}
    </div>
  );
};

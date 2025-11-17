const CustomBox = ({
  className,
  label,
  beforeIcon,
  afterIcon,
  error,
  children,
  ...props
}) => {
  return (
    <div className={`relative ${className}`}>
      <label className="text-sm font-semibold">{label}</label>
      <div
        className={`border h-10 px-2 rounded-lg flex items-center transition-colors
          ${error ? "border-red-500" : "border-gray-300"}
          focus-within:border-blue-400
        `}
      >
        <div className="flex items-center">{beforeIcon}</div>
        {children}
        <div className="flex items-center">{afterIcon}</div>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default CustomBox;

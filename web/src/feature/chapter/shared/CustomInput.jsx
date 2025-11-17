const CustomInput = ({
  className,
  label,
  beforeIcon,
  afterIcon,
  error,
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
        <div className="flex items-center mr-2 text-gray-300">{beforeIcon}</div>
        <input className="outline-none h-full w-full" {...props} />
        <div className="flex items-center ml-2 t">{afterIcon}</div>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default CustomInput;

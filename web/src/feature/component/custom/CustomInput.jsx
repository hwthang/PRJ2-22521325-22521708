const CustomInput = ({ className, label, beforeIcon, afterIcon, error, ...props }) => {
  return (
    <div className={`relative text-sm ${className}`}>
      <label className="text-sm font-semibold">{label}</label>
      <div
        className={`border h-10 rounded-lg flex items-center transition-colors
          ${error ? "border-red-500" : "border-gray-300"} 
          focus-within:${error ? "border-red-500" : "border-blue-400"}
        `}
      >
        <div
          className={`flex items-center ${beforeIcon ? "px-2" : "pr-2"} text-gray-300 peer-focus:text-blue-400`}
        >
          {beforeIcon}
        </div>

        <input className="peer outline-none h-full w-full " {...props} />

        <div
          className={`flex items-center ${afterIcon ? "px-2" : "pr-2"} `}
        >
          {afterIcon}
        </div>
      </div>

      {/* Thông báo lỗi */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CustomInput;

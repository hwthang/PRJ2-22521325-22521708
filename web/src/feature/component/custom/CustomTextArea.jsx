const CustomTextArea = ({ className, label, ...props }) => {
  return (
    <div className={`relative min-h-20 ${className}`}>
      <label className="text-sm font-semibold">{label}</label>
      <div
        className={`border h-40 rounded-lg flex items-center transition-colors
       border-gray-300 focus-within:border-blue-400 text-sm
        `}
      >
        <textarea
          className=" peer p-2 outline-none h-full min-h-20 w-full resize-none"
          {...props}
        ></textarea>
      </div>
    </div>
  );
};

export default CustomTextArea;

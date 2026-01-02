const CustomSection = ({ className, label, children, ...props }) => {
  return (
    <div className={`relative ${className} flex flex-col gap-1`}>
      <label className="text-sm font-semibold">{label}</label>
      {children}
    </div>
  );
};

export default CustomSection;

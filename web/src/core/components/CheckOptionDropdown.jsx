import React, { useState, useRef, useEffect } from "react";
import { CustomLabel } from "../../feature/component/custom/CustomLabel";
import { ChevronDown, Search, X, Check, Trash, Circle, CircleArrowLeft, RotateCcw } from "lucide-react"; 

export const CheckOptionDropdown = ({
  options = {},
  value = [],
  onChange = () => {},
  disabled = false,
  multiple = true,
  placeholder = "Chọn mục...",
  searchPlaceholder = "Tìm kiếm nhanh...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isSelected = (key) =>
    Array.isArray(value) ? value.includes(key) : value === key;

  const handleClick = (key) => {
    if (disabled) return;
    let newValue;
    if (multiple) {
      newValue = isSelected(key) ? value.filter((v) => v !== key) : [...value, key];
    } else {
      newValue = isSelected(key) ? [] : [key];
      setIsOpen(false);
      setSearchTerm("");
    }
    onChange(newValue);
  };

  const filteredOptions = Object.entries(options).filter(([_, opt]) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full font-sans" ref={containerRef}>
      {/* Trigger: Input Area */}
      <div
        className={`group min-h-[44px] p-2 bg-white border rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200 
          ${isOpen ? "border-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]" : "border-gray-200 hover:border-gray-300 shadow-sm"} 
          ${disabled ? "bg-gray-50 opacity-60 cursor-not-allowed" : ""}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-2 items-center">
          {value.length > 0 ? (
            value.map((val) => (
              <div key={val} className="transform transition-transform active:scale-95">
                <CustomLabel
                  label={options[val]?.label}
                  color={options[val]?.color}
                  selected={true}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick(val);
                  }}
                />
              </div>
            ))
          ) : (
            <span className="text-gray-400 text-sm ml-2 select-none">{placeholder}</span>
          )}
        </div>
        
        <div className="flex items-center pr-1 text-gray-400 group-hover:text-gray-600 transition-colors">
          <div className="h-4 w-[1px] bg-gray-200 mx-2" /> {/* Divider */}
          <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Search Box */}
          <div className="sticky top-0 z-10 p-3 bg-white/80 backdrop-blur-md border-b border-gray-50">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <Search size={15} className="text-gray-400" />
              <input
                autoFocus
                className="w-full bg-transparent text-[13px] outline-none text-gray-700 placeholder:text-gray-400"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              {searchTerm && (
                <X 
                  size={14} 
                  className="text-gray-400 hover:text-gray-600 cursor-pointer" 
                  onClick={() => setSearchTerm("")} 
                />
              )}
            </div>
          </div>

          {/* List Content */}
          <div className="max-h-[280px] overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-gray-200">
            <div className="flex flex-wrap gap-2 items-start">
              {filteredOptions.length > 0 ? (
                filteredOptions.map(([key, opt]) => (
                  <div
                    key={key}
                    className={`relative inline-flex items-center transition-all duration-200 active:scale-90
                      ${isSelected(key) ? "opacity-100" : "opacity-80 hover:opacity-100 hover:scale-105"}`}
                    onClick={() => handleClick(key)}
                  >
                    <CustomLabel
                      label={opt.label}
                      color={opt.color}
                      icon={opt.icon}
                      selected={isSelected(key)}
                      clickable={false}
                    />
                    {/* Tick icon nhỏ cho item đã chọn (tùy chọn) */}
                    {isSelected(key) && (
                      <div className="absolute -top-1 -right-1 bg-white rounded-full shadow-sm border border-gray-100 p-[1px]">
                         <Check size={8} className="text-blue-600" strokeWidth={4} />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="w-full py-8 flex flex-col items-center justify-center text-gray-400">
                  <Search size={24} strokeWidth={1} className="mb-2 opacity-20" />
                  <p className="text-xs">Không tìm thấy dữ liệu phù hợp</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer (Optional) */}
          {multiple && filteredOptions.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-50 bg-gray-50/50 flex justify-between items-center">
               <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                 {value.length} đã chọn
               </span>
               <button 
                 onClick={() => onChange([])}
                 className="text-[10px] text-blue-500 hover:text-blue-700 font-medium"
               >
                 <RotateCcw />
               </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
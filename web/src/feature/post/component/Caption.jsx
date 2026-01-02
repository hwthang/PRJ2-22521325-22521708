import React, { useRef, useState, useEffect } from "react";

const Caption = ({ text }) => {
  const captionRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const el = captionRef.current;
    if (el) {
      // Kiểm tra phần nội dung có vượt height giới hạn hay không
      setIsOverflowing(el.scrollHeight > 120);
    }
  }, []);

  return (
    <div>
      {/* Caption */}
      <div
        ref={captionRef}
        className={`text-gray-800 leading-relaxed transition-all duration-300 
          ${expanded ? "max-h-full" : "max-h-[120px] overflow-hidden relative"}`}
      >
        {text}

        {!expanded && isOverflowing && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>

      {/* Nút Xem thêm */}
      {isOverflowing && !expanded && (
        <button
          className="text-blue-600 font-medium mt-2"
          onClick={() => setExpanded(true)}
        >
          Xem thêm
        </button>
      )}

      {expanded && (
        <button
          className="text-blue-600 font-medium mt-2"
          onClick={() => setExpanded(false)}
        >
          Thu gọn
        </button>
      )}
    </div>
  );
};

export default Caption;

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { chiDuongDemo } from "../../../../public/videos";

const PostMedia = ({ items = [] }) => {
  const [index, setIndex] = useState(0);

  if (!items.length) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">Không có hình ảnh hoặc video</p>
      </div>
    );
  }

  const current = items[index];

  const next = () => {
    setIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const prev = () => {
    setIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full h-full rounded-md overflow-hidden bg-black">

      {/* --- BLURRED BACKGROUND --- */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-xl scale-110"
        style={{ backgroundImage: `url(${current.url})` }}
      />

      {/* --- DARK OVERLAY --- */}
      <div className="absolute inset-0 bg-black/40" />

      {/* --- MAIN MEDIA (contain mode) --- */}
      <div className="absolute inset-0 flex items-center justify-center">
        {current.resourceType === "image" ? (
          <img
            src={current.url}
            className="max-h-full w-full object-contain relative z-10"
          />
        ) : (
          <video
            src={chiDuongDemo}
            controls
            className="max-h-full w-full object-contain relative z-10"
          />
        )}
      </div>

      {/* --- PREV BUTTON --- */}
      {items.length > 1 && (
        <button
          onClick={prev}
          className="absolute top-1/2 left-3 -translate-y-1/2 z-20 bg-white/60 backdrop-blur p-2 rounded-full hover:bg-white transition"
        >
          <ChevronLeft />
        </button>
      )}

      {/* --- NEXT BUTTON --- */}
      {items.length > 1 && (
        <button
          onClick={next}
          className="absolute top-1/2 right-3 -translate-y-1/2 z-20 bg-white/60 backdrop-blur p-2 rounded-full hover:bg-white transition"
        >
          <ChevronRight />
        </button>
      )}

      {/* --- INDICATORS --- */}
      {items.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {items.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition ${
                i === index ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostMedia;

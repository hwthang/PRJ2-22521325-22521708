import React, { useState } from "react";

const DragDropUpload = ({ onFile, multiple = false }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && onFile) {
      onFile(multiple ? files : files[0]);   // ✔ fix ở đây
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0 && onFile) {
      onFile(multiple ? files : files[0]);   // ✔ fix ở đây
    }
  };

  return (
    <label
      className={`border-2 border-dashed rounded-xl h-full p-8 flex flex-col items-center justify-center cursor-pointer transition
        ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="hidden"
        onChange={handleFileSelect}
        multiple={multiple}
      />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10 text-gray-500 mb-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 4v16m8-8H4"
        />
      </svg>

      <p className="text-gray-600 text-sm text-nowrap text-center">
        Kéo thả file vào đây hoặc
        <span className="font-semibold "> <br/> bấm để chọn</span>
      </p>
    </label>
  );
};

export default DragDropUpload;

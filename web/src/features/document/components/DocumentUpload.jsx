import React, { useState } from "react";
import { UploadCloud, XCircle } from "lucide-react";

const DocumentUpload = ({ onFileSelect }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      onFileSelect && onFileSelect(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      onFileSelect && onFileSelect(droppedFile);
    }
  };

  const handleRemove = () => {
    setFile(null);
    onFileSelect && onFileSelect(null);
    document.getElementById("documentFile").value = "";
  };

  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl transition-all duration-200 ${
        file
          ? "border-green-400 bg-green-50"
          : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
      }`}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {!file ? (
        <label
          htmlFor="documentFile"
          className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
        >
          <UploadCloud className="w-8 h-8 text-gray-400 mb-1" />
          <span className="text-sm text-gray-600">
            Kéo thả hoặc chọn tệp để tải lên
          </span>
          <span className="text-xs text-gray-400 mt-1">(PDF, DOCX, PNG...)</span>
          <input
            id="documentFile"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div className="flex flex-col items-center justify-center text-center px-4">
          <p className="text-sm text-gray-700 font-medium truncate max-w-[90%]">
            {file.name}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {(file.size / 1024).toFixed(1)} KB
          </p>

          <button
            onClick={handleRemove}
            type="button"
            className="mt-2 flex items-center gap-1 text-red-500 hover:text-red-600 text-sm font-medium"
          >
            <XCircle className="w-4 h-4" /> Xóa tệp
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;

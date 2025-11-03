import React, { useState, useCallback } from "react";
import { FileText, XCircle, Upload } from "lucide-react";

const EventDocumentUpload = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Xử lý khi thêm file
  const handleFiles = useCallback((fileList) => {
    const newFiles = Array.from(fileList).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      file,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  // Chọn file qua input
  const handleChange = (e) => {
    handleFiles(e.target.files);
  };

  // Kéo thả file
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  // Xóa 1 file
  const handleRemove = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Xóa tất cả
  const handleClearAll = () => {
    setFiles([]);
    document.getElementById("eventFile").value = "";
  };

  return (
    <div className="col-span-12 md:col-span-8 md:col-start-3 flex flex-col gap-2">
      <label className="font-semibold text-gray-700 text-base">
        Tài liệu sự kiện
      </label>

      {/* Vùng kéo thả */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-500 hover:bg-blue-50/40"
        }`}
      >
        <Upload className="w-10 h-10 text-gray-400 mb-2" />
        <span className="text-sm text-gray-600 font-medium">
          Kéo thả hoặc chọn tệp để tải lên
        </span>
        <span className="text-xs text-gray-400 mt-1">
          (PDF, DOCX, JPG, PNG...)
        </span>

        <input
          id="eventFile"
          type="file"
          multiple
          onChange={handleChange}
          className="hidden"
        />
        <label
          htmlFor="eventFile"
          className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer transition"
        >
          Chọn tệp
        </label>
      </div>

      {/* Danh sách file đã chọn */}
      {files.length > 0 && (
        <div className="mt-3 border rounded-lg divide-y bg-gray-50 rounded-xl">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 transition rounded-xl"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-700 truncate max-w-[200px]">
                  {file.name}
                </span>
                <span className="text-xs text-gray-400">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(file.id)}
                className="p-1 hover:bg-red-100 rounded-full transition"
              >
                <XCircle className="w-5 h-5 text-red-500" />
              </button>
            </div>
          ))}

          {/* Nút xóa tất cả */}
          <button
            type="button"
            onClick={handleClearAll}
            className="flex items-center justify-center gap-1 w-full py-2 text-sm text-red-600 font-medium transition rounded-xl"
          >
            <XCircle className="w-4 h-4" />
            Xóa tất cả
          </button>
        </div>
      )}
    </div>
  );
};

export default EventDocumentUpload;

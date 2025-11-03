import React, { useState, useCallback, useEffect } from "react";
import { ImagePlus, XCircle } from "lucide-react";

const MOCK_IMAGES = [
  {
    id: "mock1",
    name: "Hình ảnh 1",
    preview: "https://picsum.photos/id/1015/300/200",
  },
  {
    id: "mock2",
    name: "Hình ảnh 2",
    preview: "https://picsum.photos/id/1016/300/200",
  },
  {
    id: "mock3",
    name: "Hình ảnh 3",
    preview: "https://picsum.photos/id/1018/300/200",
  },
];

const EventImageUpload = () => {
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Khi component mount, nếu chưa có ảnh, dùng mock
  useEffect(() => {
    if (images.length === 0) setImages(MOCK_IMAGES);
  }, []);

  const handleFiles = useCallback((files) => {
    const newImages = Array.from(files).map((file) => ({
      id: URL.createObjectURL(file),
      file,
      name: file.name,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const handleFileChange = (e) => handleFiles(e.target.files);

  const handleRemove = (id) => setImages((prev) => prev.filter((img) => img.id !== id));

  const handleClearAll = () => {
    setImages([]);
    document.getElementById("banner-input").value = "";
  };

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

  return (
    <div className="col-span-12 flex flex-col gap-3 md:col-span-8 md:col-start-3">
      <label className="font-semibold text-gray-700 text-base">Ảnh sự kiện</label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer 
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/40"}`}
      >
        <ImagePlus className={`w-10 h-10 mb-2 transition ${isDragging ? "text-blue-500" : "text-blue-400"}`} />
        <p className="text-gray-600 text-sm font-medium">Kéo thả hoặc chọn ảnh để tải lên</p>
        <p className="text-xs text-gray-400 mt-1">Hỗ trợ JPG, PNG, WEBP (tối đa 5MB mỗi ảnh)</p>

        <input id="banner-input" type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
        <label htmlFor="banner-input" className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer transition">
          Chọn ảnh
        </label>
      </div>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-3">
          {images.map((img) => (
            <div key={img.id} className="relative w-40 h-40 rounded-lg overflow-hidden border shadow-sm group">
              <img src={img.preview} alt={img.name} className="w-full h-full object-cover group-hover:brightness-90 transition" />
              <button
                type="button"
                onClick={() => handleRemove(img.id)}
                className="absolute top-1 right-1 bg-white/80 hover:bg-white rounded-full p-1 shadow transition"
              >
                <XCircle className="w-5 h-5 text-red-500" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-white/80 text-xs text-center text-gray-700 truncate px-2 py-1">
                {img.name}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleClearAll}
            className="w-40 h-40 border-2 border-dashed border-red-300 rounded-lg flex flex-col items-center justify-center text-red-500 hover:bg-red-50 transition"
          >
            <XCircle className="w-8 h-8 mb-1" />
            <span className="text-sm">Xóa tất cả</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default EventImageUpload;

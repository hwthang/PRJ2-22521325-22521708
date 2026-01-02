import { ChevronLeft, ChevronRight, ImagePlus, X } from "lucide-react";
import React, { useState, useCallback } from "react";

// Giả định kiểu dữ liệu ảnh (sử dụng subset của data bạn cung cấp)
// type EventImage = { path: string, originalname: string, ... }

// Dữ liệu ảnh mặc định từ yêu cầu của bạn
const initialImages = [
  {
    fieldname: "images",
    originalname: "481476252_1668915110710703_6555620754053989237_n.jpg",
    encoding: "7bit",
    mimetype: "image/jpeg",
    path: "https://res.cloudinary.com/diz9pqlzo/image/upload/v1763326801/cds/481476252_1668915110710703_6555620754053989237_n.jpg",
    size: 161699,
    filename: "cds/481476252_1668915110710703_6555620754053989237_n",
  },
  {
    fieldname: "images",
    originalname: "491943227_1713156972953183_9150722420275444410_n.jpg",
    encoding: "7bit",
    mimetype: "image/jpeg",
    path: "https://res.cloudinary.com/diz9pqlzo/image/upload/v1763326801/cds/491943227_1713156972953183_9150722420275444410_n.jpg",
    size: 143062,
    filename: "cds/491943227_1713156972953183_9150722420275444410_n",
  },
  {
    fieldname: "images",
    originalname: "493263430_1720486412220239_4854355720331859285_n.jpg",
    encoding: "7bit",
    mimetype: "image/jpeg",
    path: "https://res.cloudinary.com/diz9pqlzo/image/upload/v1763326802/cds/493263430_1720486412220239_4854355720331859285_n.jpg",
    size: 171391,
    filename: "cds/493263430_1720486412220239_4854355720331859285_n",
  },
  {
    fieldname: "images",
    originalname: "505246382_1935419673936932_439700580125545410_n.jpg",
    encoding: "7bit",
    mimetype: "image/jpeg",
    path: "https://res.cloudinary.com/diz9pqlzo/image/upload/v1763326801/cds/505246382_1935419673936932_439700580125545410_n.jpg",
    size: 35569,
    filename: "cds/505246382_1935419673936932_439700580125545410_n",
  },
  {
    fieldname: "images",
    originalname: "508249777_1758354395100107_2640869599610545451_n.jpg",
    encoding: "7bit",
    mimetype: "image/jpeg",
    path: "https://res.cloudinary.com/diz9pqlzo/image/upload/v1763346098/cds/508249777_1758354395100107_2640869599610545451_n.jpg",
    size: 75973,
    filename: "cds/508249777_1758354395100107_2640869599610545451_n",
  },
];

/**
 * EventImageSection Component
 * Hiển thị ảnh sự kiện dưới dạng carousel có thể cuộn ngang (Instagram-style).
 */
const EventImageSection = () => {
  const [images, setImages] = useState(initialImages);
  const [currentIndex, setCurrentIndex] = useState(0); // Dùng để theo dõi ảnh đang hiển thị

  // Xử lý logic xóa ảnh
  const handleRemoveImage = useCallback(
    (pathToRemove) => {
      setImages((prevImages) => {
        const updatedImages = prevImages.filter(
          (img) => img.path !== pathToRemove
        );

        // Nếu ảnh bị xóa là ảnh đang được hiển thị, cập nhật currentIndex
        if (prevImages[currentIndex]?.path === pathToRemove) {
          // Đảm bảo currentIndex không vượt quá giới hạn mảng mới
          let newIndex = Math.min(currentIndex, updatedImages.length - 1);

          // Nếu xóa ảnh cuối cùng, quay lại ảnh trước đó (hoặc 0 nếu mảng rỗng)
          if (newIndex < 0) newIndex = 0;

          setCurrentIndex(newIndex);
        } else {
          // Nếu ảnh bị xóa nằm trước currentIndex, giảm currentIndex đi 1
          const indexRemoved = prevImages.findIndex(
            (img) => img.path === pathToRemove
          );
          if (indexRemoved < currentIndex) {
            setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
          }
        }

        console.log("Xóa ảnh:", pathToRemove);
        return updatedImages;
      });
    },
    [currentIndex]
  );

  // Xử lý thêm ảnh mới (giả lập việc upload và nhận URL)
  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      // Trong môi trường thực tế, bạn sẽ gửi file này lên server.
      // Ở đây, ta tạo URL tạm thời cho mục đích hiển thị (dùng URL.createObjectURL)
      const newImagePath = URL.createObjectURL(file);
      const newImage = {
        path: newImagePath,
        originalname: file.name,
        // Thêm các trường dữ liệu khác nếu cần
      };

      setImages((prevImages) => {
        const newImages = [...prevImages, newImage];
        // Sau khi thêm, chuyển đến ảnh mới nhất
        setCurrentIndex(newImages.length - 1);
        return newImages;
      });

      console.log("Thêm ảnh mới:", file.name);

      // Đặt lại input để có thể upload cùng một file lần nữa
      e.target.value = null;
    }
  }, []);

  // Hiển thị nút điều hướng
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  // Kiểm tra xem có ảnh để hiển thị không
  const hasImages = images.length > 0;

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-100 max-w-full w-full mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex justify-between items-center">
        Bộ sưu tập ảnh sự kiện 📸
        <label className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer transition">
          <ImagePlus/>
          <input
            type="file"
            name="imageUpload"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </h2>

      {/* Carousel Container */}
      <div
        className="relative w-full overflow-hidden rounded-lg border border-gray-200"
        style={{ height: "400px" }}
      >
        {/* Image Track (cuộn ngang) */}
        <div
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{
            width: `${images.length * 100}%`,
            transform: `translateX(-${currentIndex * (100 / images.length)}%)`,
          }}
        >
          {!hasImages ? (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg absolute top-0 left-0">
              Chưa có ảnh nào. Bấm "Thêm Ảnh" để bắt đầu.
            </div>
          ) : (
            images.map((image, index) => (
              <div
                key={index}
                className="relative flex-shrink-0 w-full h-full"
                style={{ width: `${100 / images.length}%` }}
              >
                {/* Thẻ ảnh */}
                <img
                  src={image.path}
                  alt={`Ảnh sự kiện ${index + 1}`}
                  className="w-full h-full object-contain bg-black" // object-contain để giữ tỷ lệ
                />

                {/* Nút Xóa (Góc trên bên phải) */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(image.path)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold opacity-90 hover:opacity-100 transition shadow-lg z-10"
                  title={`Xóa ảnh: ${image.originalname}`}
                >
                  <X/>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Navigation Buttons */}
        {hasImages && images.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition disabled:opacity-30 disabled:cursor-not-allowed"
              title="Ảnh trước"
              disabled={currentIndex === 0}
            >
              <ChevronLeft/>
            </button>
            <button
              onClick={goToNext}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition disabled:opacity-30 disabled:cursor-not-allowed"
              title="Ảnh tiếp theo"
              disabled={currentIndex === images.length - 1}
            >
                <ChevronRight/>
            </button>
          </>
        )}

        {/* Indicators (Dấu chấm) */}
        {hasImages && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {images.map((_, index) => (
              <span
                key={index}
                className={`block w-2 h-2 rounded-full cursor-pointer transition ${
                  index === currentIndex
                    ? "bg-indigo-500"
                    : "bg-gray-400 hover:bg-gray-300"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventImageSection;

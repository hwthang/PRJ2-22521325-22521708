import React, { useEffect, useState } from "react";
import { defAvatar } from "../../core/assets/images";
import { Camera, Loader2 } from "lucide-react";
import apiClient from "../../utils/api";
import { onUpload } from "../../utils/cloudinary"; // Đường dẫn đến file upload của bạn

const AccountAvatar = ({ id = "avatar", defaultSrc, onFileSelect }) => {
  const [preview, setPreview] = useState(defAvatar);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (defaultSrc) setPreview(defaultSrc);
    console.log(defaultSrc)
  }, [defaultSrc]);

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Tạo preview tạm thời để UI phản hồi nhanh
    const previewURL = URL.createObjectURL(file);
    const oldPreview = preview;
    setPreview(previewURL);

    try {
      setIsUploading(true);

      // BƯỚC 1: Upload lên Cloudinary để lấy secure_url và publicId
      const media = await onUpload(file, "image");

      // BƯỚC 2: Gửi Object Media về Server của bạn bằng JSON
      // Cấu trúc JSON gửi đi khớp với kết quả từ Cloudinary
      const response = await apiClient.patch(
        `/api/accounts/${id}/change-avatar`,
        {
          avatar: {...media},      // Link ảnh https
           // Để sau này có thể xóa/sửa trên Cloudinary từ BE
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data?.success) {
        // Cập nhật lại preview bằng URL chính thức từ server nếu cần
        setPreview(media.url);
        if (onFileSelect) onFileSelect(media);
        console.log("Cập nhật Avatar thành công via JSON");
      }

    } catch (err) {
      console.error("Lỗi quy trình upload:", err);
      setPreview(oldPreview); // Rollback nếu có lỗi ở bất kỳ bước nào
      alert(err.message || "Không thể cập nhật ảnh đại diện");
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(previewURL);
    }
  };

  return (
    <div className="relative z-0 w-fit group">
      <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-50">
        <img
          src={preview || defAvatar}
          alt="Avatar"
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            isUploading ? "opacity-50" : "opacity-100"
          }`}
        />
        
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}
      </div>

      <label
        htmlFor={id}
        className={`absolute bottom-1 right-1 w-10 h-10 flex items-center justify-center 
        rounded-full shadow-xl border bg-white transition-all duration-200
        ${isUploading ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-110 active:scale-95 hover:bg-gray-50"}`}
      >
        <Camera className="w-5 h-5 text-gray-600" />
        <input
          id={id}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
          disabled={isUploading}
        />
      </label>
    </div>
  );
};

export default AccountAvatar;
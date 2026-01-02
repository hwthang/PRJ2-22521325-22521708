import React, { useEffect, useState } from "react";
import { defAvatar } from "../../core/assets/images";
import { Camera } from "lucide-react";
import apiClient from "../../utils/api";

const AccountAvatar = ({ id = "avatar", defaultSrc, onFileSelect }) => {
  const [preview, setPreview] = useState(defAvatar);

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview ảnh
    const previewURL = URL.createObjectURL(file);
    setPreview(previewURL);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await apiClient.patch(
        `/api/accounts/${id}/change-avatar`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Nếu component cha cần file
      if (onFileSelect) onFileSelect(file);

      console.log("Upload thành công:", response.data);
    } catch (err) {
      console.error("Upload avatar lỗi:", err);
    }
  };

  useEffect(() => {
    setPreview(defaultSrc||defAvatar);
  }, [defaultSrc]);

  return (
    <div className="relative z-0 w-fit">
      {/* Hiển thị avatar */}
      <img
        src={preview}
        className="h-40 w-40 rounded-full object-cover border shadow-sm"
      />

      {/* Nút upload */}
      <label
        htmlFor={id}
        className="absolute bottom-2 right-2 bg-white border cursor-pointer 
        w-10 h-10 flex items-center justify-center rounded-full shadow-md 
        hover:bg-gray-100 transition"
      >
        <Camera className="w-5 h-5" />

        <input
          id={id}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
      </label>
    </div>
  );
};

export default AccountAvatar;

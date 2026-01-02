import React, { useState } from "react";
const cloudinaryName = import.meta.env.VITE_CLOUDINARY_NAME;
const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET;
const useCloudinary = () => {
  const onUpload = async (file, resourceType = "image") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryName}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    if (!res.ok) {
      console.error("Cloudinary upload error:", data);
      throw new Error(data?.error?.message || "Upload Cloudinary thất bại");
    }

    const asset = {
      publicId: data.public_id,
      url: data.secure_url,
      resourceType,
    };
    console.log(asset)
  

    // Trả về cho component nếu muốn gửi tiếp xuống BE lưu DB
    return asset;
  };
  return {onUpload};
};

export default useCloudinary;

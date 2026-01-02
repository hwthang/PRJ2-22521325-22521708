const cloudinaryName = import.meta.env.VITE_CLOUDINARY_NAME;
const uploadPreset = 'ml_default';
const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;

export const onUpload = async (file, resourceType = "image") => {
  if (!cloudinaryName || !uploadPreset) {
    throw new Error("Thiếu CLOUDINARY_NAME hoặc UPLOAD_PRESET trong .env");
  }

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
    url: data.secure_url, // dùng secure_url cho https
    timestamp: data.version, // có thể dùng lưu log / BE
    signature: data.signature, // signature của upload (không dùng cho destroy)
    resourceType,
  };

  console.log("Uploaded asset:", asset);
  return asset;
};
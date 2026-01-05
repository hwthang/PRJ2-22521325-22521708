// Định nghĩa kiểu dữ liệu trả về cho Asset
export interface CloudinaryAsset {
  publicId: string;
  url: string;
  timestamp: number;
  signature: string;
  resourceType: "image" | "video" | "raw";
}

// Lấy biến môi trường (Expo khuyến khích dùng EXPO_PUBLIC_ cho client side)
const cloudinaryName = process.env.EXPO_PUBLIC_CLOUDINARY_NAME;
const uploadPreset = process.env.EXPO_PUBLIC_UPLOAD_PRESET || "ml_default";

/**
 * Helper upload file lên Cloudinary
 * @param file Đối tượng file từ ImagePicker (chứa uri, type, name)
 * @param resourceType Loại tài nguyên: "image", "video", hoặc "raw" (cho tài liệu)
 */
export const onUpload = async (
  file: any,
  resourceType: "image" | "video" | "auto" | "raw" = "image"
): Promise<CloudinaryAsset> => {
  
  if (!cloudinaryName) {
    throw new Error("Thiếu EXPO_PUBLIC_CLOUDINARY_NAME trong file .env");
  }

  const formData = new FormData();

  // Trong React Native, file upload qua FormData cần cấu trúc này:
  formData.append("file", {
    uri: file.uri,
    type: file.type || "image/jpeg",
    name: file.name || `upload_${Date.now()}`,
  } as any);

  formData.append("upload_preset", uploadPreset);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryName}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("Cloudinary upload error:", data);
      throw new Error(data?.error?.message || "Upload Cloudinary thất bại");
    }

    const asset: CloudinaryAsset = {
      publicId: data.public_id,
      url: data.secure_url,
      timestamp: data.version,
      signature: data.signature,
      resourceType: data.resource_type,
    };

    console.log("Uploaded asset:", asset);
    return asset;
    
  } catch (error) {
    console.error("onUpload Error:", error);
    throw error;
  }
};
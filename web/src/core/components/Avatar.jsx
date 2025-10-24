import React, { useEffect, useState } from "react";
import { IoCameraOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import defAvatar from "../../core/assets/images/avatar.png";
import { LoaderCircle } from "lucide-react";
import AccountService from "../../features/account/services/AccountService";
// đường dẫn tới service của bạn

const Avatar = ({ userId, src, onUpdated }) => {
  const [preview, setPreview] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [tempFile, setTempFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Khi chọn file mới
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTempFile({ file, url });
      setShowPopup(true);
    }
  };

  // Xác nhận cập nhật avatar
  const handleConfirm = async () => {
    if (!tempFile) return;
    setLoading(true);

    const res = await AccountService.updateAvatar(userId, tempFile.file);
    console.log("Update avatar response:", res);

    if (res?.success) {
      setPreview(tempFile.url);
      setShowPopup(false);
      // if (onUpdated) onUpdated(res.data);
    } else {
      alert(res?.message || "Cập nhật avatar thất bại");
    }

    setLoading(false);
  };

  useEffect(() => {
   
      setPreview(src);
    
  }, [src]);
  return (
    <div className="relative flex flex-col items-center justify-center col-span-6 lg:col-span-1 gap-3">
      {/* Avatar hiển thị */}
      <div className="relative max-h-60 max-w-60 h-full w-full aspect-square rounded-full ">
        <img
          src={preview || defAvatar}
          alt="avatar"
          className="w-full h-full border-blue-600 border-2 object-cover rounded-full border shadow-sm"
        />

        {/* Nút edit */}
        <label
          htmlFor="avatar-upload"
          className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-100"
        >
          <IoCameraOutline size={22} className="text-gray-700" />
        </label>

        {/* Input ẩn */}
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Popup xem trước */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg flex flex-col items-center gap-4 w-80"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <p className="font-semibold text-lg text-gray-800">
                Xác nhận cập nhật ảnh đại diện
              </p>
              <img
                src={tempFile?.url}
                alt="preview"
                className="w-32 h-32 object-cover rounded-full border"
              />
              <div className="flex gap-3 mt-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  onClick={() => {
                    setShowPopup(false);
                    setTempFile(null);
                  }}
                  disabled={loading}
                >
                  Hủy
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                  onClick={handleConfirm}
                  disabled={loading}
                >
                  {loading ? <LoaderCircle className="animate-spin"/>: "Xác nhận"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Avatar;

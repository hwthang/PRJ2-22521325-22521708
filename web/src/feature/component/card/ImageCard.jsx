import React, { useState } from "react";

const ImageCard = ({ data, onDelete }) => {
  const [isPreview, setIsPreview] = useState(false);

  const url = data?.url || data?.path;
  const type =
    data?.resource_type ||
    data?.mimetype?.split("/")[0] ||
    (url?.match(/\.(mp4|mov|avi|webm)$/i) ? "video" : "image");

  const isVideo = type === "video";

  return (
    <>
      {/* Card */}
      <div
        className="relative w-48 h-48 rounded-xl overflow-hidden shadow hover:shadow-lg cursor-pointer"
        onClick={() => setIsPreview(true)}
      >
        {/* Background blur (chỉ cho ảnh) */}
        {!isVideo && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(4px)",
              opacity: 0.8,
            }}
          ></div>
        )}

        {/* Media */}
        {isVideo ? (
          <video
            src={url}
            className="relative w-full h-full object-contain z-10"
            muted
          />
        ) : (
          <img src={url} className="relative w-full h-full object-contain z-10" />
        )}

        {/* Delete */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(data);
          }}
          className="absolute top-2 right-2 bg-black/60 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-600 transition z-20"
        >
          ✕
        </button>
      </div>

      {/* Preview Popup */}
      {isPreview && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setIsPreview(false)}
        >
          {isVideo ? (
            <video
              src={url}
              controls
              autoPlay
              className="max-w-full max-h-full rounded-md shadow-lg"
            />
          ) : (
            <img
              src={url}
              className="max-w-full max-h-full object-contain rounded-md shadow-lg"
            />
          )}
        </div>
      )}
    </>
  );
};

export default ImageCard;

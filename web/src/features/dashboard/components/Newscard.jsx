// import React from "react";
// import { Heart, MessageCircle, Share2, MapPin, CalendarDays } from "lucide-react";

// export default function NewsCard({ event, index }) {
//   return (
//     <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-200 hover:shadow-md transition-all duration-200">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-3">
//         <h2 className="font-semibold text-lg text-gray-900">{event.name}</h2>
//         <span
//           className={`text-sm font-medium px-3 py-1 rounded-full ${
//             event.status === "Đang diễn ra"
//               ? "bg-green-100 text-green-700"
//               : event.status === "Sắp diễn ra"
//               ? "bg-yellow-100 text-yellow-700"
//               : "bg-gray-100 text-gray-600"
//           }`}
//         >
//           {event.status}
//         </span>
//       </div>

//       {/* Content */}
//       <div className="text-sm text-gray-600 flex items-center gap-3 mb-2">
//         <CalendarDays className="w-4 h-4 text-blue-500" />
//         <span>{new Date(event.date).toLocaleDateString("vi-VN")}</span>
//       </div>
//       <div className="text-sm text-gray-600 flex items-center gap-3 mb-2">
//         <MapPin className="w-4 h-4 text-red-500" />
//         <span>{event.location}</span>
//       </div>
//       <p className="text-sm text-gray-500">
//         <strong>Tỷ lệ tham dự:</strong> {event.attendance}
//       </p>

//       {/* Image */}
//       <div className="mt-4">
//         <img
//   src={`/images/event${(index % 5) + 1}.jpg`} // ảnh trong thư mục public/images
//   alt={event.name}
//   className="rounded-xl w-full h-60 object-cover"
// />

//       </div>

//       {/* Footer actions */}
//       <div className="flex justify-around mt-4 border-t border-gray-200 pt-2 text-gray-600">
//         <button className="flex items-center gap-1 hover:text-blue-600 transition">
//           <Heart className="w-4 h-4" /> <span>Thích</span>
//         </button>
//         <button className="flex items-center gap-1 hover:text-blue-600 transition">
//           <MessageCircle className="w-4 h-4" /> <span>Bình luận</span>
//         </button>
//         <button className="flex items-center gap-1 hover:text-blue-600 transition">
//           <Share2 className="w-4 h-4" /> <span>Chia sẻ</span>
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { Heart, MessageCircle, MapPin, CalendarDays, X, ChevronLeft, ChevronRight } from "lucide-react";
import Comment from "./Comment";

export default function NewsCard({ news }) {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([
    { name: "Nguyễn Minh", avatar: "/images/avatar1.jpg", text: "Sự kiện này thật tuyệt vời!" },
    { name: "Lê Hương", avatar: "/images/avatar2.jpg", text: "Mong chờ sự kiện tiếp theo!" },
  ]);

  const [selectedIndex, setSelectedIndex] = useState(null); // vị trí ảnh đang phóng to
  const event = news.eventInfo;

  const handleAddComment = (text) => {
    const newCmt = { name: "Bạn", avatar: "/images/avatar1.jpg", text };
    setComments((prev) => [...prev, newCmt]);
  };

  // Mũi tên tới/lùi
  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? news.images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === news.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 relative">
      {/* --- Header --- */}
      <div className="flex items-start justify-between mb-3">
        <h2 className="font-bold text-2xl text-gray-900 leading-snug">{event.name}</h2>

        <div className="flex flex-col items-end">
          <span
            className={`text-base font-semibold px-4 py-1 rounded-full mb-2 ${
              event.status === "Đang diễn ra"
                ? "bg-green-100 text-green-700"
                : event.status === "Sắp diễn ra"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {event.status}
          </span>

          {/* --- Nút đăng ký khi sắp diễn ra --- */}
          {event.status === "Sắp diễn ra" && (
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1.5 rounded-lg shadow-sm text-sm transition-all">
              Đăng ký tham gia
            </button>
          )}
        </div>
      </div>

      {/* --- Author --- */}
      <div className="flex items-center gap-3 mb-3">
        <img src={news.author.avatar} alt={news.author.name} className="w-12 h-12 rounded-full object-cover" />
        <div>
          <p className="text-base font-medium text-gray-800">{news.author.name}</p>
          <p className="text-sm text-gray-500">{news.createdAt}</p>
        </div>
      </div>

      {/* --- Nội dung --- */}
      <p className="text-gray-800 text-[16px] leading-relaxed mb-4 whitespace-pre-line">{news.content}</p>

      {/* --- Thông tin sự kiện --- */}
      <div className="text-base text-gray-700 flex items-center gap-3 mb-2">
        <CalendarDays className="w-5 h-5 text-blue-500" />
        <span>{new Date(event.date).toLocaleDateString("vi-VN")}</span>
      </div>
      <div className="text-base text-gray-700 flex items-center gap-3 mb-2">
        <MapPin className="w-5 h-5 text-red-500" />
        <span>{event.location}</span>
      </div>
      <p className="text-base text-gray-600 mb-4">
        <strong>Tỷ lệ tham dự:</strong> {event.attendance}
      </p>

      {/* --- Danh sách ảnh --- */}
      {news.images && news.images.length > 0 && (
        <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
          {news.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${event.name}-${i}`}
              onClick={() => setSelectedIndex(i)}
              className="rounded-xl w-full h-48 object-cover cursor-pointer hover:opacity-90 transition"
            />
          ))}
        </div>
      )}

      {/* --- Hành động --- */}
      <div className="flex justify-around mt-5 border-t border-gray-200 pt-3 text-gray-600 text-base">
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-2 transition ${liked ? "text-red-500" : "hover:text-red-400"}`}
        >
          <Heart className={`w-5 h-5 ${liked ? "fill-red-500" : ""}`} />
          <span>{liked ? news.stats.likes + 1 : news.stats.likes}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 hover:text-blue-600 transition"
        >
          <MessageCircle className="w-5 h-5" />
          <span>{comments.length}</span>
        </button>
      </div>

      {/* --- Khu vực bình luận --- */}
      {showComments && <Comment comments={comments} onAddComment={handleAddComment} />}

      {/* --- Lightbox phóng to ảnh + điều hướng --- */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 flex justify-center items-center z-50"
          onClick={() => setSelectedIndex(null)}
        >
          <img
            src={news.images[selectedIndex]}
            alt="Phóng to"
            className="max-w-[90%] max-h-[85%] rounded-xl shadow-2xl object-contain"
          />

          {/* Nút đóng */}
          <button
            className="absolute top-6 right-6 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex(null);
            }}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Mũi tên điều hướng */}
          {news.images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/70 rounded-full p-3 transition"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/70 rounded-full p-3 transition"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

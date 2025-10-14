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
import { Heart, MessageCircle, MapPin, CalendarDays } from "lucide-react";
import Comment from "./Comment";

export default function NewsCard({ news }) {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([
    {
      name: "Nguyễn Minh",
      avatar: "/images/avatar1.jpg",
      text: "Sự kiện này thật tuyệt vời!",
    },
    {
      name: "Lê Hương",
      avatar: "/images/avatar2.jpg",
      text: "Mong chờ sự kiện tiếp theo!",
    },
  ]);

  const event = news.eventInfo;

  const handleAddComment = (text) => {
    const newCmt = {
      name: "Bạn",
      avatar: "/images/avatar1.jpg",
      text,
    };
    setComments((prev) => [...prev, newCmt]);
  };

  return (
    <div className="bg-white  rounded-2xl shadow-sm p-5 border border-gray-200 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-lg text-gray-900">{event.name}</h2>
        <span
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            event.status === "Đang diễn ra"
              ? "bg-green-100 text-green-700"
              : event.status === "Sắp diễn ra"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {event.status}
        </span>
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={news.author.avatar}
          alt={news.author.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-medium text-gray-800">{news.author.name}</p>
          <p className="text-xs text-gray-500">{news.createdAt}</p>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-700 text-sm mb-3">{news.content}</p>

      {/* Event Info */}
      <div className="text-sm text-gray-600 flex items-center gap-3 mb-2">
        <CalendarDays className="w-4 h-4 text-blue-500" />
        <span>{new Date(event.date).toLocaleDateString("vi-VN")}</span>
      </div>
      <div className="text-sm text-gray-600 flex items-center gap-3 mb-2">
        <MapPin className="w-4 h-4 text-red-500" />
        <span>{event.location}</span>
      </div>
      <p className="text-sm text-gray-500 mb-3">
        <strong>Tỷ lệ tham dự:</strong> {event.attendance}
      </p>

      {/* Images */}
      {news.images && news.images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
          {news.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${event.name}-${i}`}
              className="rounded-lg w-full h-40 object-cover"
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-around mt-4 border-t border-gray-200 pt-2 text-gray-600 text-sm">
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-1 transition ${
            liked ? "text-red-500" : "hover:text-red-400"
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-red-500" : ""}`} />
          <span>{liked ? news.stats.likes + 1 : news.stats.likes}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 hover:text-blue-600 transition"
        >
          <MessageCircle className="w-4 h-4" />
            <span>{comments.length}</span>
        </button>
      </div>

      {/* Comment section */}
      {showComments && (
        <Comment comments={comments} onAddComment={handleAddComment} />
      )}
    </div>
  );
}

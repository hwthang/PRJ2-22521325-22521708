// import { EVENTS } from "../../event/mockup/events";

// export const NEWS = EVENTS.map((event, index) => ({
//   id: index + 1,
//   author: {
//     name: "Đoàn Trường Đại học A",
//     avatar: `/images/avatar${(index % 3) + 1}.jpg`,
//   },
//   content: `📢 Sự kiện "${event.name}" ${event.status.toLowerCase()} tại ${
//     event.location
//   }.
// 👉 Cùng tham gia để kết nối và lan tỏa tinh thần thanh niên năng động! 💪`,
//   image: `/images/event${(index % 5) + 1}.jpg`,
//   eventInfo: event,
//   stats: {
//     likes: Math.floor(Math.random() * 300) + 50,
//     comments: Math.floor(Math.random() * 20) + 1,
//     shares: Math.floor(Math.random() * 10),
//   },
//   createdAt: new Date(event.date).toLocaleDateString("vi-VN", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//   }),
// }));

import { EVENTS } from "../../event/mockup/events";

export const NEWS = EVENTS.map((event, index) => {
  // Sinh ngẫu nhiên 2–4 ảnh cho mỗi bài viết
  const imageCount = Math.floor(Math.random() * 3) + 2; // 2–4 ảnh
  const images = Array.from({ length: imageCount }, (_, i) => 
    `/images/event${((index + i) % 10) + 1}.jpg`
  );

  return {
    id: index + 1,
    author: {
      name: "Đoàn Trường Đại học A",
      avatar: `/images/avatar${(index % 3) + 1}.jpg`,
    },
    content: `📢 Sự kiện "${event.name}" ${event.status.toLowerCase()} tại ${
      event.location
    }.
👉 Cùng tham gia để kết nối và lan tỏa tinh thần thanh niên năng động! 💪`,
    images, // thay vì image đơn lẻ
    eventInfo: event,
    stats: {
      likes: Math.floor(Math.random() * 300) + 50,
      comments: Math.floor(Math.random() * 20) + 1,
      shares: Math.floor(Math.random() * 10),
    },
    createdAt: new Date(event.date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  };
});

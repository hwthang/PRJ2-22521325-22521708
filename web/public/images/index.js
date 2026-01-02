// Import all images
import event1 from "./event1.jpg";
import event2 from "./event2.webp";
import event3 from "./event3.webp";
import event4 from "./event4.jpg";
import event5 from "./event5.jpg";
import event6 from "./event6.jpg";
import event7 from "./event7.webp";
import event8 from "./event8.jpg";
import event9 from "./event9.jpg";
import event10 from "./event10.webp";
import { chiDuongDemo } from "../videos";

// Export individual images
export {
  event1,
  event2,
  event3,
  event4,
  event5,
  event6,
  event7,
  event8,
  event9,
  event10,
};

// PostMedia-compatible array
export const demoMedia = [
  { id: 1, type: "image", src: event1 },
  { id: 2, type: "image", src: event2 },
  { id: 3, type: "image", src: event3 },
  { id: 4, type: "image", src: event4 },
  { id: 5, type: "image", src: event5 },
  { id: 6, type: "image", src: event6 },
  { id: 7, type: "image", src: event7 },
  { id: 8, type: "image", src: event8 },
  { id: 9, type: "image", src: event9 },
  { id: 10, type: "image", src: event10 },
  { id: 11, type: "video", src: chiDuongDemo },
];


// Export as named images object
export const demoImageSrcs = [
  event1,
  event2,
  event3,
  event4,
  event5,
  event6,
  event7,
  event8,
  event9,
  event10,
];

// Demo images array with additional metadata
export const demoImages = [
  {
    id: 1,
    src: event1,
    alt: "Sự kiện hoạt động tình nguyện",
    title: "Hoạt động tình nguyện",
    description: "Đoàn viên tham gia hoạt động tình nguyện tại địa phương",
    category: "tình-nguyện",
    date: "2024-03-15",
  },
  {
    id: 2,
    src: event2,
    alt: "Sinh hoạt chi đoàn",
    title: "Sinh hoạt chi đoàn",
    description: "Buổi sinh hoạt chi đoàn định kỳ",
    category: "sinh-hoat",
    date: "2024-03-10",
  },
  {
    id: 3,
    src: event3,
    alt: "Đại hội Đoàn",
    title: "Đại hội Đoàn",
    description: "Đại hội Đoàn cấp cơ sở",
    category: "dai-hoi",
    date: "2024-03-01",
  },
  {
    id: 4,
    src: event4,
    alt: "Hoạt động thể thao",
    title: "Thi đấu thể thao",
    description: "Giải bóng đá Đoàn viên thanh niên",
    category: "the-thao",
    date: "2024-02-28",
  },
  {
    id: 5,
    src: event5,
    alt: "Hội thi văn nghệ",
    title: "Hội thi văn nghệ",
    description: "Cuộc thi văn nghệ chào mừng ngày thành lập Đoàn",
    category: "van-nghe",
    date: "2024-02-25",
  },
  {
    id: 6,
    src: event6,
    alt: "Diễn đàn thanh niên",
    title: "Diễn đàn thanh niên",
    description: "Diễn đàn lắng nghe tiếng nói thanh niên",
    category: "dien-dan",
    date: "2024-02-20",
  },
  {
    id: 7,
    src: event7,
    alt: "Tập huấn kỹ năng",
    title: "Tập huấn kỹ năng",
    description: "Khóa tập huấn kỹ năng mềm cho đoàn viên",
    category: "tap-huan",
    date: "2024-02-15",
  },
  {
    id: 8,
    src: event8,
    alt: "Tham quan học tập",
    title: "Tham quan học tập",
    description: "Chuyến tham quan học tập tại di tích lịch sử",
    category: "tham-quan",
    date: "2024-02-10",
  },
  {
    id: 9,
    src: event9,
    alt: "Lễ kết nạp Đoàn viên",
    title: "Lễ kết nạp Đoàn viên",
    description: "Lễ kết nạp Đoàn viên mới",
    category: "ket-nap",
    date: "2024-02-05",
  },
  {
    id: 10,
    src: event10,
    alt: "Hoạt động hè",
    title: "Hoạt động hè",
    description: "Chiến dịch thanh niên tình nguyện hè",
    category: "he",
    date: "2024-01-30",
  },
];

// Group images by category
export const imagesByCategory = {
  "tình-nguyện": demoImages.filter((img) => img.category === "tình-nguyện"),
  "sinh-hoat": demoImages.filter((img) => img.category === "sinh-hoat"),
  "dai-hoi": demoImages.filter((img) => img.category === "dai-hoi"),
  "the-thao": demoImages.filter((img) => img.category === "the-thao"),
  "van-nghe": demoImages.filter((img) => img.category === "van-nghe"),
  "dien-dan": demoImages.filter((img) => img.category === "dien-dan"),
  "tap-huan": demoImages.filter((img) => img.category === "tap-huan"),
  "tham-quan": demoImages.filter((img) => img.category === "tham-quan"),
  "ket-nap": demoImages.filter((img) => img.category === "ket-nap"),
  he: demoImages.filter((img) => img.category === "he"),
};

// Utility function to get image by ID
export const getImageById = (id) => {
  const image = demoImages.find((img) => img.id === id);
  return image ? image.src : null;
};

// Utility function to get random images
export const getRandomImages = (count = 3) => {
  const shuffled = [...demoImages].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, demoImages.length));
};

// Utility function to get images by category
export const getImagesByCategory = (category) => {
  return demoImages.filter((img) => img.category === category);
};

// Utility function to get image metadata by src
export const getImageMetadata = (src) => {
  return demoImages.find((img) => img.src === src) || null;
};

// Default export
export default {
  event1,
  event2,
  event3,
  event4,
  event5,
  event6,
  event7,
  event8,
  event9,
  event10,
  demoImageSrcs,
  demoImages,
  imagesByCategory,
  getImageById,
  getRandomImages,
  getImagesByCategory,
  getImageMetadata,
};

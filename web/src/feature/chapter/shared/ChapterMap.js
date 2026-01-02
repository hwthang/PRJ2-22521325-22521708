export const CHAPTER_AFFILIATED = [
  "Đoàn Trường THPT Chu Văn An",
  "Đoàn Trường ĐH Bách Khoa Hà Nội",
  "Đoàn Thanh niên phường Trung Hòa",
  "Đoàn Thanh niên quận 3",
  "Đoàn Trường ĐH Luật TP.HCM",
  "Đoàn Thanh niên xã Hòa Phú, huyện Củ Chi",
  "Đoàn Trường ĐH Kinh tế Quốc dân",
  "Đoàn Thanh niên Công ty CP May Việt Tiến",
  "Đoàn Trường THPT Nguyễn Huệ",
  "Đoàn Thanh niên Ngân hàng TMCP Ngoại thương Việt Nam",
  "Đoàn Trường ĐH Cần Thơ",
  "Đoàn Thanh niên Công ty TNHH Samsung Electronics Việt Nam",
  "Đoàn Trường ĐH Kinh tế TP.HCM",
  "Đoàn Thanh niên xã Tân Phong, huyện Giá Rai, tỉnh Bạc Liêu",
  "Đoàn Trường ĐH Y Dược TP.HCM",
  "Đoàn Thanh niên Công ty CP Đầu tư Thế giới Di động",
  "Đoàn Trường THPT Chuyên Lê Hồng Phong",
  "Đoàn Thanh niên TP. Đà Nẵng",
  "Đoàn Trường ĐH Hà Nội",
  "Đoàn Thanh niên Ban Quản lý Vườn Quốc gia Cúc Phương",
];

export const CHAPPTER_OPTIONS = CHAPTER_AFFILIATED.reduce((acc, chapter, index) => {
  acc[`chapter_${index}`] = { label: chapter, color: "blue" }; // có thể đổi màu khác nếu muốn
  return acc;
}, {});

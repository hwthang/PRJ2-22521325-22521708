// mockStatisticData.js
export const STATISTIC = {
  // ==== MEMBER STATISTIC ====
  members: {
    byGender: [
      { name: "Nam", value: 120 },
      { name: "Nữ", value: 95 },
      { name: "Khác", value: 5 },
    ],
    byRole: [
      { name: "Bí thư", value: 10 },
      { name: "Phó bí thư", value: 8 },
      { name: "Đoàn viên", value: 180 },
      { name: "Cán bộ", value: 22 },
    ],
    byStatus: [
      { name: "Hoạt động", value: 180 },
      { name: "Tạm ngưng", value: 25 },
      { name: "Rời đoàn", value: 15 },
    ],
    participationWeekly: [
      { name: "Tuần 1", participation: 30 },
      { name: "Tuần 2", participation: 45 },
      { name: "Tuần 3", participation: 28 },
      { name: "Tuần 4", participation: 35 },
    ],
    participationMonthly: [
      { name: "Tháng 1", participation: 120 },
      { name: "Tháng 2", participation: 145 },
      { name: "Tháng 3", participation: 98 },
      { name: "Tháng 4", participation: 130 },
      { name: "Tháng 5", participation: 160 },
      { name: "Tháng 6", participation: 140 },
    ],
    participationQuarterly: [
      { name: "Q1", participation: 363 },
      { name: "Q2", participation: 430 },
      { name: "Q3", participation: 410 },
      { name: "Q4", participation: 395 },
    ],
    participationYearly: [
      { name: "2022", participation: 1500 },
      { name: "2023", participation: 1650 },
      { name: "2024", participation: 1750 },
      { name: "2025", participation: 1600 },
    ],
  },

  // ==== EVENT STATISTIC ====
  events: {
    byStatus: [
      { name: "Sắp diễn ra", value: 12 },
      { name: "Đang diễn ra", value: 4 },
      { name: "Đã kết thúc", value: 25 },
      { name: "Hủy", value: 3 },
    ],
    byType: [
      { name: "Tình nguyện", value: 10 },
      { name: "Văn nghệ", value: 8 },
      { name: "Thể thao", value: 7 },
      { name: "Học tập", value: 6 },
      { name: "Khác", value: 13 },
    ],
    interactionWeekly: [
      { name: "Tuần 1", likes: 120, comments: 45 },
      { name: "Tuần 2", likes: 150, comments: 60 },
      { name: "Tuần 3", likes: 90, comments: 40 },
      { name: "Tuần 4", likes: 110, comments: 55 },
    ],
    interactionMonthly: [
      { name: "Tháng 1", likes: 520, comments: 210 },
      { name: "Tháng 2", likes: 610, comments: 230 },
      { name: "Tháng 3", likes: 550, comments: 190 },
      { name: "Tháng 4", likes: 630, comments: 250 },
      { name: "Tháng 5", likes: 700, comments: 280 },
      { name: "Tháng 6", likes: 640, comments: 260 },
    ],
    interactionQuarterly: [
      { name: "Q1", likes: 1680, comments: 630 },
      { name: "Q2", likes: 1970, comments: 790 },
      { name: "Q3", likes: 1840, comments: 740 },
      { name: "Q4", likes: 1760, comments: 720 },
    ],
    interactionYearly: [
      { name: "2022", likes: 5800, comments: 2400 },
      { name: "2023", likes: 6250, comments: 2600 },
      { name: "2024", likes: 6500, comments: 2750 },
      { name: "2025", likes: 6100, comments: 2500 },
    ],
  },

  // ==== DOCUMENT STATISTIC ====
  documents: {
    byType: [
      { name: "Văn bản hành chính", value: 25 },
      { name: "Tài liệu sinh hoạt", value: 18 },
      { name: "Học tập", value: 10 },
      { name: "Khác", value: 7 },
    ],
    byScope: [
      { name: "Nội bộ", value: 20 },
      { name: "Mật", value: 8 },
      { name: "Công khai", value: 32 },
    ],
    uploadedWeekly: [
      { name: "Tuần 1", value: 6 },
      { name: "Tuần 2", value: 9 },
      { name: "Tuần 3", value: 7 },
      { name: "Tuần 4", value: 8 },
    ],
    uploadedMonthly: [
      { name: "Tháng 1", value: 22 },
      { name: "Tháng 2", value: 26 },
      { name: "Tháng 3", value: 28 },
      { name: "Tháng 4", value: 25 },
      { name: "Tháng 5", value: 30 },
      { name: "Tháng 6", value: 27 },
    ],
    uploadedQuarterly: [
      { name: "Q1", value: 76 },
      { name: "Q2", value: 82 },
      { name: "Q3", value: 70 },
      { name: "Q4", value: 80 },
    ],
    uploadedYearly: [
      { name: "2022", value: 290 },
      { name: "2023", value: 320 },
      { name: "2024", value: 350 },
      { name: "2025", value: 310 },
    ],
  },
};

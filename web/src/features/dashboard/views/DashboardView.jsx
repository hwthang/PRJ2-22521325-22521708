import React, { useState } from "react";
import { NEWS } from "../mockup/news";
import NewsCard from "../components/Newscard";
import Ranking from "../components/Ranking";

// Mock khảo sát
const SURVEYS = [
  {
    id: 1,
    title: "Khảo sát về hoạt động thể thao",
    description: "Đoàn viên vui lòng đánh giá các hoạt động thể thao vừa qua.",
    responses: 45,
  },
  {
    id: 2,
    title: "Khảo sát ý kiến văn nghệ",
    description: "Đoàn viên cho biết ý kiến về các tiết mục văn nghệ.",
    responses: 32,
  },
  {
    id: 3,
    title: "Khảo sát về môi trường đoàn",
    description: "Đoàn viên đánh giá các chính sách và hoạt động đoàn.",
    responses: 28,
  },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 md:px-8">
      <h1 className="text-3xl font-extrabold text-blue-800 mb-8 text-center">
        Bảng Tin Hoạt Động Đoàn Viên
      </h1>

      {/* Nút toggle cột phụ */}
      <div className="max-w-7xl mx-auto mb-4 flex justify-end">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          {sidebarOpen ? "Đóng cột phụ" : "Mở cột phụ"}
        </button>
      </div>

      {/* Container chính */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* === CỘT CHÍNH (BẢNG TIN) === */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:w-2/3" : "w-full"}`}>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-300">
            Tin tức & Hoạt động
          </h2>
          <div className="space-y-6">
            {NEWS.map((news, index) => (
              <NewsCard key={index} news={news} />
            ))}
          </div>
        </div>

        {/* === CỘT PHỤ (Ranking + Khảo sát) === */}
        {sidebarOpen && (
          <div className="lg:w-1/3 flex flex-col gap-6 transition-all duration-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-300">
              Bảng xếp hạng Nổi bật
            </h2>
            <Ranking />

            {/* Khảo sát */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Khảo sát mới</h2>
              <div className="flex flex-col gap-4">
                {SURVEYS.map((survey) => (
                  <div
                    key={survey.id}
                    className="border rounded-md p-4 bg-white hover:shadow-sm transition"
                  >
                    <h3 className="font-semibold text-gray-900">{survey.title}</h3>
                    <p className="text-gray-600 text-sm">{survey.description}</p>
                    <span className="text-gray-500 text-xs mt-2 block">
                      Số lượt phản hồi: {survey.responses}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

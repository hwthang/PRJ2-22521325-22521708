import React from "react";
import { NEWS } from "../mockup/news";
import NewsCard from "../components/Newscard";

export default function Dashboard() {
  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4 md:px-8">
      <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
        Bảng Tin Hoạt Động Đoàn Viên
      </h1>

      <div className="max-w-6xl mx-auto space-y-6">
        {NEWS.map((news, index) => (
          <NewsCard key={index} news={news} />
        ))}
      </div>
    </div>
  );
}

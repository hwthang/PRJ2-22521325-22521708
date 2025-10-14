// import React from 'react'

// function DashboardView() {
//   return (
//     <div>DashboardView</div>
//   )
// }

// export default DashboardView

// import React from "react";
// import { NEWS } from "../mockup/news"; // ✅ Đúng: import NEWS thay vì EVENTS
// import NewsCard from "../components/Newscard";

// export default function Dashboard() {
//   return (
//     <div className="bg-gray-100 min-h-screen py-6 px-4 md:px-8">
//       <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
//         Bảng Tin Hoạt Động Đoàn Viên
//       </h1>

//       <div className="max-w-3xl mx-auto space-y-6">
//         {NEWS.map((item, index) => (
//           <NewsCard key={index} event={item.eventInfo} index={index} />
//         ))}
//       </div>
//     </div>
//   );
// }

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

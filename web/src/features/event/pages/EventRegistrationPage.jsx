import React, { useState } from "react";
// Thêm icon 'Inbox' cho trạng thái rỗng
import { Calendar, MapPin, Inbox } from "lucide-react";

const MOCK_REGISTERED_EVENTS = [
  {
    id: 1,
    title: "Ngày hội Thanh Niên 2025",
    date: "2025-10-12",
    location: "Nhà thi đấu Phú Thọ",
  },
  {
    id: 2,
    title: "Hoạt động thiện nguyện Mùa Hè Xanh",
    date: "2025-07-22",
    location: "Khu phố 3 – Thủ Đức",
  },
  {
    id: 3,
    title: "Chung kết giải bóng đá Chi đoàn",
    date: "2025-09-05",
    location: "Sân vận động Quận 9",
  }
];

function EventRegistrationPage() {
  const [events] = useState(MOCK_REGISTERED_EVENTS);

  return (
    // Thêm nền xám nhạt cho toàn bộ trang để làm nổi bật các thẻ
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Làm nổi bật tiêu đề chính với màu sắc và kích thước lớn hơn */}
        <h2 className="text-3xl font-bold text-indigo-700 mb-6">
          Sự kiện đã đăng ký
        </h2>

        {events.length === 0 ? (
          // Cải thiện trạng thái rỗng, biến nó thành 1 cái thẻ
          <div className="bg-white border rounded-xl p-10 shadow-sm text-center">
            <Inbox size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 italic text-lg">
              Bạn chưa đăng ký sự kiện nào.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {events.map((event) => (
              <div
                key={event.id}
                    // Thêm bóng (shadow) rõ hơn, tăng padding và hiệu ứng transition mượt hơn
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
              >
                    {/* Tăng kích thước và độ đậm của tiêu đề thẻ */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {event.title}
                </h3>

                <div className="space-y-2">
                      {/* Thêm màu sắc chủ đạo cho các icon */}
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Calendar size={16} className="text-indigo-500" />
                    <span>{event.date}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin size={16} className="text-indigo-500" />
                    <span>{event.location}</span>
                  </div>
                </div>
                  
                  {/* Thêm đường kẻ và nút bấm để tăng tính tương tác */}
                  <hr className="my-4" />
                  <div className="flex justify-end">
                    <button 
                      className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                      onClick={() => alert(`Hủy đăng ký sự kiện: ${event.title}`)}
                    >
                      Hủy đăng ký
                    </button>
                  </div>
              </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventRegistrationPage;
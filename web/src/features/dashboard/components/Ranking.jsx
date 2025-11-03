import React from "react";
// import { FaCrown } from "react-icons/fa"; // Bỏ comment nếu bạn dùng icon

const mockRanking = [
  // ... (dữ liệu mockRanking của bạn)
  { rank: 1, name: "Nguyễn Văn Kiên", position: "Bí thư", chapter: "Chi đoàn Khu phố 1", avatar: "https://i.pravatar.cc/80?img=1" },
  { rank: 2, name: "Trần Thị Bích", position: "Phó Bí thư", chapter: "Chi đoàn Lớp 12A", avatar: "https://i.pravatar.cc/80?img=2" },
  { rank: 3, name: "Lê Văn Cường", position: "Ủy viên BCH", chapter: "Chi đoàn Lớp 11B", avatar: "https://i.pravatar.cc/80?img=3" },
  { rank: 4, name: "Phạm Thị Dung", position: "Đoàn viên", chapter: "Chi đoàn Khu phố 2", avatar: "https://i.pravatar.cc/80?img=4" },
  { rank: 5, name: "Hoàng Văn Em", position: "Đoàn viên", chapter: "Chi đoàn Lớp 10C", avatar: "https://i.pravatar.cc/80?img=5" },
];

const top3Styles = {
  // ... (Đối tượng top3Styles không đổi, chúng vẫn đẹp trên nền sáng)
  1: { gradient: "bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400", shadow: "shadow-yellow-300/40", hoverShadow: "hover:shadow-yellow-300/60", textColor: "text-yellow-900", rankColor: "text-yellow-700", avatarBorder: "border-yellow-400", icon: "🏆" },
  2: { gradient: "bg-gradient-to-r from-gray-300 via-white to-gray-300", shadow: "shadow-gray-400/40", hoverShadow: "hover:shadow-gray-400/60", textColor: "text-gray-900", rankColor: "text-gray-600", avatarBorder: "border-gray-300", icon: "🥈" },
  3: { gradient: "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500", shadow: "shadow-amber-500/40", hoverShadow: "hover:shadow-amber-500/60", textColor: "text-amber-900", rankColor: "text-amber-700", avatarBorder: "border-amber-500", icon: "🥉" },
};

function Ranking() {
  return (
    // **** THAY ĐỔI ****
    // Nền gradient tối ĐƯỢC THAY BẰNG nền trắng, bo tròn, đổ bóng và viền nhẹ
    <div className="p-6 md:p-8 bg-white rounded-3xl shadow-xl border border-gray-200/50">
      
      {/* **** THAY ĐỔI **** */}
      {/* Tiêu đề gradient Vàng-Trắng ĐƯỢC THAY BẰNG màu xanh đậm rõ ràng */}
      <h2 className="text-2xl font-extrabold mb-6 text-center text-blue-800">
        Top Đoàn Viên
      </h2>

      <div className="flex flex-col gap-5">
        {mockRanking.slice(0, 5).map((member) => { // Chỉ hiển thị top 5 cho gọn
          const isTop3 = member.rank <= 3;
          const styles = isTop3 ? top3Styles[member.rank] : null;

          return (
            <div
              key={member.rank}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-[1.03] cursor-pointer
                ${
                  isTop3
                    ? `${styles.gradient} ${styles.shadow} ${styles.hoverShadow} shadow-xl` // Top 3 giữ nguyên style
                    
                    // **** THAY ĐỔI ****
                    // Style "Glassmorphism" ĐƯỢC THAY BẰNG style nền sáng
                    : "bg-gray-50 border border-gray-200 shadow-sm hover:bg-white hover:shadow-md"
                }`}
            >
              {/* === Số thứ tự === */}
              {/* **** THAY ĐỔI ****: Màu chữ hạng 4+ */}
              <div className={`flex-shrink-0 w-12 text-center font-black ${isTop3 ? styles.rankColor : "text-gray-600"} ${isTop3 ? 'text-3xl' : 'text-2xl'}`}>
                {isTop3 ? (
                  <span className="drop-shadow-lg">{styles.icon}</span>
                ) : (
                  <span>{member.rank}</span>
                )}
              </div>

              {/* === Avatar === */}
              <div className="flex-shrink-0 relative">
                <img
                  src={member.avatar}
                  alt={member.name}
                  // **** THAY ĐỔI ****: Viền avatar hạng 4+
                  className={`rounded-full object-cover ${
                    isTop3 ? "w-14 h-14 border-4" : "w-12 h-12 border-2 border-gray-300"
                  } ${isTop3 ? styles.avatarBorder : ""}`}
                />
                {member.rank === 1 && (
                  <span className="absolute -top-3 -left-3 text-3xl transform -rotate-12">
                    👑
                  </span>
                )}
              </div>

              {/* === Thông tin === */}
              <div className="flex-1 min-w-0">
                {/* **** THAY ĐỔI ****: Màu chữ tên hạng 4+ */}
                <p className={`font-extrabold truncate ${
                  isTop3 ? `text-xl ${styles.textColor}` : "text-lg text-gray-900"
                }`}>
                  {member.name}
                </p>
                {/* **** THAY ĐỔI ****: Màu chữ vị trí hạng 4+ */}
                <p className={`text-sm ${isTop3 ? `${styles.textColor} opacity-80` : "text-gray-700 font-medium"}`}>
                  {member.position}
                </p>
                {/* **** THAY ĐỔI ****: Màu chữ chapter hạng 4+ */}
                <p className={`text-sm italic ${isTop3 ? `${styles.textColor} opacity-70` : "text-gray-500"}`}>
                  {member.chapter}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Ranking;
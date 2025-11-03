import { ChevronLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MemberForm from "../components/MemberForm";

// Mock data
const mockActivities = [
  { id: "a1", title: "Tham gia tình nguyện", date: "2025-01-15" },
  { id: "a2", title: "Hội thao Đoàn", date: "2025-02-20" },
  { id: "a3", title: "Chương trình văn nghệ", date: "2025-03-10" },
];

const mockRewards = [
  { id: "r1", type: "Khen thưởng xuất sắc", date: "2025-01-20", reason: "Hoàn thành xuất sắc nhiệm vụ" },
  { id: "r2", type: "Giấy khen", date: "2025-03-15", reason: "Tham gia tích cực hoạt động Đoàn" },
];

const mockDisciplines = [
  { id: "d1", type: "Kỷ luật nhẹ", date: "2025-02-01", reason: "Đi muộn buổi họp chi đoàn" },
];

function MemberDetailView() {
  const { id } = useParams();
  const [memberId, setMemberId] = useState(id);

  // Bạn có thể fetch dữ liệu thực từ API sau này
  // const [memberData, setMemberData] = useState(null);

  return (
    <div className="md:p-10 p-6 flex flex-col gap-6 relative z-0">
      <div className="bg-white flex py-6 flex-col gap-6 shadow-md rounded-md">
        {/* Header */}
        <div className="col-span-12">
          <Link to={"/members"} className="flex gap-2 px-4 items-center w-fit">
            <ChevronLeft size={40} />
            <span className="font-bold text-2xl">Thông tin đoàn viên</span>
          </Link>
        </div>

        {/* Member Form */}
        <div className="mx-6 md:mx-10">
          <MemberForm memberId={memberId} />
        </div>

        {/* Hoạt động tham gia */}
        <div className="mx-6 md:mx-10 mt-6">
          <h3 className="text-xl font-bold mb-3">Hoạt động tham gia</h3>
          <ul className="list-disc list-inside">
            {mockActivities.map((a) => (
              <li key={a.id}>
                {a.title} - <span className="text-gray-500">{a.date}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Thông tin khen thưởng */}
        <div className="mx-6 md:mx-10 mt-6">
          <h3 className="text-xl font-bold mb-3">Thông tin khen thưởng</h3>
          <ul className="list-disc list-inside">
            {mockRewards.map((r) => (
              <li key={r.id}>
                {r.type} - <span className="text-gray-500">{r.date}</span> - {r.reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Thông tin kỷ luật */}
        <div className="mx-6 md:mx-10 mt-6 mb-6">
          <h3 className="text-xl font-bold mb-3">Thông tin kỷ luật</h3>
          <ul className="list-disc list-inside">
            {mockDisciplines.map((d) => (
              <li key={d.id}>
                {d.type} - <span className="text-gray-500">{d.date}</span> - {d.reason}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MemberDetailView;

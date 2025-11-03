import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ChapterForm from "../components/ChapterForm";
import { ChevronLeft } from "lucide-react";
import apiClient from "../../../utils/api";

// Mock data
const mockMembers = [
  { id: "m1", fullName: "Nguyễn Văn A", position: "Bí thư", memberCode: "TV001" },
  { id: "m2", fullName: "Trần Thị B", position: "Phó Bí thư", memberCode: "TV002" },
  { id: "m3", fullName: "Lê Văn C", position: "Ủy viên BCH", memberCode: "TV003" },
  { id: "m4", fullName: "Phạm Thị D", position: "Đoàn viên", memberCode: "TV004" },
];

const mockEvents = [
  { id: "e1", title: "Hoạt động tình nguyện", date: "2025-11-01" },
  { id: "e2", title: "Hội thảo kỹ năng", date: "2025-11-05" },
  { id: "e3", title: "Chương trình thể thao", date: "2025-11-10" },
];

const mockDocuments = [
  { id: "d1", title: "Biên bản họp chi đoàn", type: "PDF" },
  { id: "d2", title: "Kế hoạch hoạt động tháng 11", type: "Word" },
  { id: "d3", title: "Danh sách đoàn viên mới", type: "Excel" },
];

function ChapterDetailView() {
  const { id } = useParams();
  const [chapter, setChapter] = useState(null);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const res = await apiClient.get(`/api/chapters/${id}`);
        setChapter(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchChapter();
  }, [id]);

  return (
    <div className="md:p-10 p-6 flex flex-col gap-6 relative z-0">
      <div className="bg-white flex py-6 flex-col gap-6 shadow-md rounded-md">
        {/* Header */}
        <div className="col-span-12">
          <Link to={"/chapters"} className="flex gap-2 px-4 items-center w-fit">
            <ChevronLeft size={40} />
            <span className="font-bold text-2xl">Thông tin chi đoàn</span>
          </Link>
        </div>

        {/* Chapter Form */}
        <div className="mx-6 md:mx-10">
          <ChapterForm chapterId={id} />
        </div>

        {/* Members List */}
        <div className="mx-6 md:mx-10 mt-6">
          <h3 className="text-xl font-bold mb-3">Danh sách đoàn viên</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">#</th>
                  <th className="px-4 py-2 border">Họ và tên</th>
                  <th className="px-4 py-2 border">Chức vụ</th>
                  <th className="px-4 py-2 border">Số thẻ đoàn</th>
                </tr>
              </thead>
              <tbody>
                {mockMembers.map((m, index) => (
                  <tr key={m.id} className="text-center">
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">{m.fullName}</td>
                    <td className="px-4 py-2 border">{m.position}</td>
                    <td className="px-4 py-2 border">{m.memberCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Events List */}
        <div className="mx-6 md:mx-10 mt-6">
          <h3 className="text-xl font-bold mb-3">Danh sách sự kiện</h3>
          <ul className="list-disc list-inside">
            {mockEvents.map((e) => (
              <li key={e.id}>
                {e.title} - <span className="text-gray-500">{e.date}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Documents List */}
        <div className="mx-6 md:mx-10 mt-6 mb-6">
          <h3 className="text-xl font-bold mb-3">Danh sách tài liệu</h3>
          <ul className="list-disc list-inside">
            {mockDocuments.map((d) => (
              <li key={d.id}>
                {d.title} - <span className="text-gray-500">{d.type}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ChapterDetailView;

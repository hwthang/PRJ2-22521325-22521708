import { useEffect, useMemo, useState } from "react";
import { eventStatuses, eventTopics } from "../shared/EventMap";
import CustomInput from "../../component/custom/CustomInput";
import { PlusSquare, Search } from "lucide-react";
import { Link } from "react-router-dom";
import CustomSection from "../../component/custom/CustomSection";
import { CheckOption } from "../../../core/components/CheckOption";
import { EventItem } from "../component/EventItem";
import Paging from "../../component/paging/Paging";
import apiClient from "../../../utils/api";
import customCache from "../../../utils/customCache";
import { CheckOptionDropdown } from "../../../core/components/CheckOptionDropdown";

export const mockup_events = [
  {
    id: "1",
    name: "Đại hội chi đoàn khu phố Đông B nhiệm kỳ 2025-2026",
    startTime: "2025-04-12T07:30:00.000Z",
    endTime: "2025-04-12T09:30:00.000Z",
    location: "Hội trường E, Đại học Công nghệ Thông tin – ĐHQG TP.HCM",
    status: "upcoming",
    topics: ["volunteer", "environment", "technology"],
  },
  {
    id: "2",
    name: "Chiến dịch hiến máu tình nguyện Xuân yêu thương 2025",
    startTime: "2025-02-15T08:00:00.000Z",
    endTime: "2025-02-15T17:00:00.000Z",
    location: "Nhà văn hóa Thanh niên TP.HCM",
    status: "upcoming",
    topics: ["blood_donation", "volunteer", "charity"],
  },
  {
    id: "3",
    name: "Ngày hội khởi nghiệp sinh viên 2025",
    startTime: "2025-03-20T09:00:00.000Z",
    endTime: "2025-03-20T21:00:00.000Z",
    location: "Trung tâm Hội nghị ĐHQG TP.HCM",
    status: "upcoming",
    topics: ["startup", "technology", "competition"],
  },
  {
    id: "4",
    name: "Hội thao thanh niên toàn thành 2025",
    startTime: "2025-05-01T06:00:00.000Z",
    endTime: "2025-05-01T18:00:00.000Z",
    location: "Sân vận động Quân khu 7",
    status: "upcoming",
    topics: ["sports", "youth_union", "competition"],
  },
  {
    id: "5",
    name: "Tập huấn kỹ năng mềm cho đoàn viên",
    startTime: "2025-01-25T13:30:00.000Z",
    endTime: "2025-01-25T16:30:00.000Z",
    location: "Phòng họp A, Trường Đại học Khoa học Xã hội và Nhân văn",
    status: "running",
    topics: ["training_soft", "education", "youth_union"],
  },
  {
    id: "6",
    name: "Chiến dịch tình nguyện hè 2024 - Tổng kết",
    startTime: "2024-08-30T14:00:00.000Z",
    endTime: "2024-08-30T17:00:00.000Z",
    location: "Hội trường lớn, Thành đoàn TP.HCM",
    status: "ended",
    topics: ["volunteer", "community", "charity"],
  },
  {
    id: "7",
    name: "Lễ hội văn hóa các dân tộc Việt Nam",
    startTime: "2025-11-20T08:00:00.000Z",
    endTime: "2025-11-22T22:00:00.000Z",
    location: "Công viên Văn hóa Đầm Sen",
    status: "upcoming",
    topics: ["festival", "culture", "art", "exchange"],
  },
  {
    id: "8",
    name: "Hội thi văn nghệ chào mừng ngày 26/3",
    startTime: "2025-03-20T18:00:00.000Z",
    endTime: "2025-03-20T22:00:00.000Z",
    location: "Nhà hát Thanh niên TP.HCM",
    status: "upcoming",
    topics: ["art", "culture", "youth_union", "competition"],
  },
  {
    id: "9",
    name: "Diễn đàn nghề nghiệp và việc làm 2025",
    startTime: "2025-06-15T08:30:00.000Z",
    endTime: "2025-06-15T16:30:00.000Z",
    location: "Trung tâm Hội chợ Triển lãm Sài Gòn",
    status: "upcoming",
    topics: ["career", "training", "education", "exchange"],
  },
  {
    id: "10",
    name: "Chiến dịch tuyên truyền bảo vệ môi trường",
    startTime: "2025-04-22T07:00:00.000Z",
    endTime: "2025-04-22T11:00:00.000Z",
    location: "Công viên 23/9, Quận 1",
    status: "upcoming",
    topics: ["propaganda", "environment", "community"],
  },
  {
    id: "11",
    name: "Chương trình Trung thu cho em 2024",
    startTime: "2024-09-15T18:00:00.000Z",
    endTime: "2024-09-15T21:30:00.000Z",
    location: "Mái ấm Hoa Mặt Trời, Quận Bình Thạnh",
    status: "ended",
    topics: ["charity", "festival", "community", "social_security"],
  },
  {
    id: "12",
    name: "Hội thao bóng đá sinh viên - Bị hủy do thời tiết",
    startTime: "2024-12-10T14:00:00.000Z",
    endTime: "2024-12-10T18:00:00.000Z",
    location: "Sân bóng đá Đại học Bách Khoa",
    status: "canceled",
    topics: ["sports", "youth_union", "competition"],
  },
];

const PAGE_SIZE = 5;

const EventListPage = () => {
  const [events, setEvents] = useState(mockup_events);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);

  const myAccount = localStorage.getItem("my_account");
  const role = JSON.parse(myAccount).type;

  const fetchEvents = async (params) => {
    const response = await apiClient.get("/api/events");
    console.info(response);
    setEvents(
      response?.data?.events.map((item) => ({
        chapterId: item.chapterId._id,
        id: item._id,
        name: item.name,
        startTime: item.startedAt,
        endTime: item.endedAt,
        location: item.venue,
        status: item.status,
        topics: item.tags,
      }))
    );
  };

  // Filter + Search
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (
        e.chapterId != customCache.myAccount.get()?.chapter?._id &&
        customCache.myAccount.get()?.chapter?._id
      )
        return false;
      if (selectedStatuses.length && !selectedStatuses.includes(e.status))
        // Lọc theo trạng thái
        return false;

      // Lọc theo chủ đề
      if (
        selectedTopics.length &&
        !e.topics.some((t) => selectedTopics.includes(t))
      )
        return false;

      // Tìm kiếm theo tên hoặc địa điểm
      if (searchText) {
        const text = searchText.toLowerCase();
        if (
          !e.name.toLowerCase().includes(text) &&
          !e.location.toLowerCase().includes(text)
        )
          return false;
      }

      return true;
    });
  }, [events, selectedStatuses, selectedTopics, searchText]);

  // Phân trang
  const totalPage = Math.ceil(filteredEvents.length / PAGE_SIZE);
  const pagedEvents = filteredEvents.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );
  useEffect(() => {
    fetchEvents();
  }, []);
  return (
    <div className="p-6 transition-all flex flex-col">
      {/* SEARCH + CREATE + FILTER */}
      <div className="bg-white p-6 shadow-md rounded-md grid grid-cols-12 border-gray-200 border gap-6 mb-6">
        <CustomInput
          className={`${
            role == "chapter" ? "md:col-span-10" : "md:col-span-12"
          } col-span-12 text-sm`}
          beforeIcon={<Search />}
          placeholder="Nhập tên sự kiện hoặc địa điểm"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(1);
          }}
        />
        {role == "chapter" && (
          <Link
            to={"create"}
            className="text-sm font-medium col-span-12 md:col-span-2 flex p-2 gap-2 bg-blue-600 items-center justify-center text-white rounded-md active:bg-blue-500"
          >
            <PlusSquare /> Thêm sự kiện
          </Link>
        )}

        {/* Trạng thái */}
        <CustomSection className="col-span-12" label="Trạng thái sự kiện">
          <CheckOption
            options={eventStatuses}
            value={selectedStatuses}
            onChange={(v) => {
              setSelectedStatuses(v);
              setPage(1);
            }}
            multiple={true}
          />
        </CustomSection>

        {/* Chủ đề */}
        <CustomSection className="col-span-12" label="Chủ đề sự kiện">
          <CheckOptionDropdown
            options={eventTopics}
            value={selectedTopics}
            onChange={(v) => {
              setSelectedTopics(v);
              setPage(1);
            }}
            multiple={true}
          />
        </CustomSection>
      </div>

      {/* HEADER */}
      <div className="hidden text-sm md:grid grid-cols-12 px-4 py-2 gap-4 border-gray-200 border mb-4 rounded-md bg-blue-900 text-white uppercase">
        <span className="col-span-3 font-medium">Tên sự kiện</span>
        <span className="col-span-2 font-medium text-center">
          Thời điểm bắt đầu
        </span>
        <span className="col-span-2 font-medium text-center">
          Thời điểm kết thúc
        </span>
        <span className="col-span-3 font-medium text-center">Địa điểm</span>
        <span className="col-span-2 font-medium text-center">Trạng thái</span>
      </div>

      {/* Danh sách Event */}
      <div className="flex flex-col gap-4">
        {pagedEvents.map((e) => (
          <Link key={e.id} to={e.id}>
            <EventItem data={e} />
          </Link>
        ))}
        {pagedEvents.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            Không tìm thấy sự kiện
          </div>
        )}
      </div>

      {/* PAGING */}
      <Paging
        page={page}
        totalPage={totalPage}
        setPage={setPage}
        loading={false}
      />
    </div>
  );
};

export default EventListPage;

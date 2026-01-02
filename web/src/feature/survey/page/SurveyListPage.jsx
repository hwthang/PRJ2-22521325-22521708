import React, { useEffect, useState, useMemo } from "react";
import CustomInput from "../../component/custom/CustomInput";
import {
  PlusSquare,
  Search,
  Clock,
  PlayCircle,
  CheckCircle,
} from "lucide-react";
import CustomSection from "../../component/custom/CustomSection";
import { CheckOption } from "../../../core/components/CheckOption";
import CreateSurveyModal from "../component/CreateSurveyModal";
import EditSurveyModal from "../component/EditSurveyModal";
import { SurveyItem } from "../component/SurveyItem";
import apiClient from "../../../utils/api";
import customCache from "../../../utils/customCache";
import { Link } from "react-router-dom";
import SurveyService from "../service/SurveyService";

// 1. Hàm tính toán trạng thái dựa trên thời gian
const calculateSurveyStatus = (survey) => {
  const now = new Date();
  const startedAt = survey.startedAt
    ? new Date(survey.startedAt)
    : new Date(survey.createdAt);
  const endedAt = survey.endedAt ? new Date(survey.endedAt) : null;

  if (now < startedAt) return "upcoming";
  if (endedAt && now > endedAt) return "ended";
  return "ongoing";
};

// 2. Cấu hình hiển thị trạng thái
export const surveyStatuses = {
  upcoming: {
    label: "Sắp diễn ra",
    icon: "Clock",
    color: "yellow",
    textColor: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  ongoing: {
    label: "Đang diễn ra",
    icon: "PlayCircle",
    color: "green",
    textColor: "text-green-600",
    bgColor: "bg-green-50",
  },
  ended: {
    label: "Đã kết thúc",
    icon: "CheckCircle",
    color: "gray",
    textColor: "text-gray-500",
    bgColor: "bg-gray-50",
  },
};

const SurveyListPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editSurvey, setEditSurvey] = useState(null);

  const [filters, setFilters] = useState({
    searchText: "",
    selectedStatuses: [],
  });

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const res = await SurveyService.fetchAllSurveys();
      // Gán thêm thuộc tính status được tính toán động vào mỗi object survey
      const computedSurveys = (res || []).map((s) => ({
        ...s,
        computedStatus: calculateSurveyStatus(s),
      }));
      setSurveys(computedSurveys);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  // Logic lọc dữ liệu sử dụng trạng thái đã tính toán
  const filteredSurveys = useMemo(() => {
    return surveys.filter((survey) => {
      const matchText = survey.name
        ?.toLowerCase()
        .includes(filters.searchText.toLowerCase());
      const matchStatus =
        !filters.selectedStatuses.length ||
        filters.selectedStatuses.includes(survey.computedStatus);
      return matchText && matchStatus;
    });
  }, [surveys, filters]);
  const myAccount = localStorage.getItem("my_account");
  const role = JSON.parse(myAccount).type;
  return (
    <div className="p-6 flex flex-col gap-4">
      {/* FILTER SECTION */}
      <div className="bg-white p-6 shadow-sm rounded-xl border border-gray-100 grid grid-cols-12 gap-6 mb-2">
        <CustomInput
          className={`${
            role == "chapter" ? "md:col-span-10" : "md:col-span-12"
          } col-span-12 text-sm`}
          beforeIcon={<Search size={20} className="text-gray-400" />}
          value={filters.searchText}
          onChange={(e) => updateFilter("searchText", e.target.value)}
          placeholder="Tìm kiếm tên khảo sát..."
        />
        {role == "chapter" && (
          <Link
            to={"create"}
            className="text-sm font-bold col-span-12 md:col-span-2 flex p-2.5 gap-2 bg-blue-600 hover:bg-blue-700 transition-colors items-center justify-center text-white rounded-lg shadow-md shadow-blue-100"
          >
            <PlusSquare size={18} /> Tạo khảo sát
          </Link>
        )}

        <CustomSection
          className="col-span-12"
          label="Lọc theo trạng thái thời gian"
        >
          <CheckOption
            options={surveyStatuses}
            multiple
            value={filters.selectedStatuses}
            onChange={(val) => updateFilter("selectedStatuses", val)}
          />
        </CustomSection>
      </div>

      {/* TABLE HEADER */}
      <div className="hidden md:grid grid-cols-12 px-6 py-3 gap-4 bg-blue-900 text-white text-sm font-semibold uppercase  rounded-t-xl">
        <span className="col-span-6">Thông tin khảo sát</span>
        <span className="col-span-2 text-center">Bắt đầu</span>
        <span className="col-span-2 text-center">Kết thúc</span>
        <span className="col-span-2 text-center">Trạng thái</span>
      </div>

      {/* LIST CONTENT */}
      <div className="flex flex-col gap-2">
        {loading ? (
          <div className="bg-white p-20 text-center rounded-xl border border-dashed border-gray-200">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-500 font-medium">
              Đang đồng bộ dữ liệu thời gian...
            </p>
          </div>
        ) : filteredSurveys.length === 0 ? (
          <div className="bg-white p-16 text-center rounded-xl border border-gray-100 text-gray-400 italic">
            Không có khảo sát nào trong danh sách hiển thị.
          </div>
        ) : (
          filteredSurveys.map((survey) => (
            <SurveyItem
              key={survey._id}
              data={{ ...survey, status: survey.computedStatus }} // Truyền status đã tính toán xuống Item
              onEdit={(item) => setEditSurvey(item)}
            />
          ))
        )}
      </div>

      {/* MODALS (GIỮ NGUYÊN) */}
      <CreateSurveyModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={fetchSurveys}
      />
      <EditSurveyModal
        open={!!editSurvey}
        survey={editSurvey}
        onClose={() => setEditSurvey(null)}
        onSubmit={fetchSurveys}
      />
    </div>
  );
};

export default SurveyListPage;

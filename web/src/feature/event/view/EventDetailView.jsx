import { ChevronLeft, Save, RotateCcw } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import CustomInput from "../../chapter/shared/CustomInput";
import CustomBox from "../../chapter/shared/CustomBox";
import CustomSection from "../../chapter/shared/CustomSection";
import { CheckOption } from "../../../core/components/CheckOption";
import { formatForDatetimeLocal } from "../../../utils/date";
import { EVENT_TAGS } from "../shared/EventMap";
import EventImageSection from "../component/EventImageSection";
import AttendanceItem from "../component/AttendanceItem";
import AttendanceListSection from "../component/AttendanceListSection";
import CommentSection from "../component/CommentSection";

// Dữ liệu mặc định tách ra ngoài component
const defaultEvent = {
  _id: "691a3c303f9e509fe2d13644",
  chapterId: {
    _id: "6916903f27fa8299d8a55a49",
    accountId: "691641c3a7465adf67473bca",
    name: "Chi đoàn khu phố Đông P",
    affiliated: "Đoàn phường Đông Hòa",
    establishedAt: "1990-01-01T00:00:00.000Z",
    address: "19 Trần Quang Khải, phường Đông Hòa, thành phố Hồ Chí Minh",
    createdAt: "2025-11-14T02:13:19.286Z",
    updatedAt: "2025-11-14T02:29:16.639Z",
    __v: 0,
  },
  postId: null,
  name: "Kỷ Niệm Thành Lập Công Ty",
  scope: "noi_bo",
  tags: ["sang_tao_tre", "khoi_nghiep_tre"],
  status: "sap_dien_ra",
  startedAt: "2025-11-20T00:00:00.000Z",
  endedAt: "2025-11-20T00:00:00.000Z",
  venue: "123 Lê Lợi, phường Bến Thành, thành phố Hồ Chí Minh",
  description: "Sự kiện kỷ niệm thành lập công ty dành cho toàn bộ nhân viên.",
  images: [
    {
      fieldname: "images",
      originalname: "481476252_1668915110710703_6555620754053989237_n.jpg",
      encoding: "7bit",
      mimetype: "image/jpeg",
      path: "https://res.cloudinary.com/diz9pqlzo/image/upload/v1763326801/cds/481476252_1668915110710703_6555620754053989237_n.jpg",
      size: 161699,
      filename: "cds/481476252_1668915110710703_6555620754053989237_n",
    },
    {
      fieldname: "images",
      originalname: "491943227_1713156972953183_9150722420275444410_n.jpg",
      encoding: "7bit",
      mimetype: "image/jpeg",
      path: "https://res.cloudinary.com/diz9pqlzo/image/upload/v1763326801/cds/491943227_1713156972953183_9150722420275444410_n.jpg",
      size: 143062,
      filename: "cds/491943227_1713156972953183_9150722420275444410_n",
    },
  ],
  checkInAt: "2025-11-20T08:45:00.000Z",
  checkInDuration: 30,
  createdAt: "2025-11-16T21:03:44.546Z",
  updatedAt: "2025-11-17T02:22:16.755Z",
  __v: 0,
};

const EventDetailView = ({
  event = defaultEvent,
  onUpdate = null,
  readOnly = false,
}) => {
  const [eventData, setEventData] = useState(defaultEvent);
  const [isModified, setIsModified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sử dụng useCallback để tránh tạo hàm mới mỗi lần render
  const initializeData = useCallback(() => {
    if (event && event._id) {
      setEventData(event);
    } else {
      setEventData(defaultEvent);
    }
    setIsModified(false);
  }, [event?._id]); // Chỉ phụ thuộc vào event._id

  // Khởi tạo dữ liệu khi component mount hoặc event thay đổi
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Hàm xử lý thay đổi dữ liệu cơ bản
  const handleInputChange = useCallback((name, value) => {
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsModified(true);
  }, []);

  // Hàm xử lý thay đổi cho CustomInput
  const handleCustomInputChange = useCallback(
    (name) => (value) => {
      handleInputChange(name, value);
    },
    [handleInputChange]
  );

  // Hàm xử lý thay đổi trạng thái
  const handleStatusChange = useCallback(
    (status) => {
      handleInputChange("status", status);
    },
    [handleInputChange]
  );

  // Hàm xử lý thay đổi phạm vi
  const handleScopeChange = useCallback(
    (scope) => {
      handleInputChange("scope", scope);
    },
    [handleInputChange]
  );

  // Hàm xử lý thay đổi tags
  const handleTagsChange = useCallback(
    (tags) => {
      handleInputChange("tags", tags);
    },
    [handleInputChange]
  );

  // Hàm xử lý thay đổi venue
  const handleVenueChange = useCallback(
    (e) => {
      handleInputChange("venue", e.target.value);
    },
    [handleInputChange]
  );

  // Hàm xử lý thay đổi description
  const handleDescriptionChange = useCallback(
    (e) => {
      handleInputChange("description", e.target.value);
    },
    [handleInputChange]
  );

  // Hàm reset dữ liệu về ban đầu
  const handleReset = useCallback(() => {
    initializeData();
  }, [initializeData]);

  // Hàm cập nhật sự kiện
  const handleUpdate = useCallback(async () => {
    if (!isModified) {
      alert("Không có thay đổi nào để cập nhật!");
      return;
    }

    setIsLoading(true);

    try {
      // Gọi callback onUpdate nếu được cung cấp
      if (onUpdate && typeof onUpdate === "function") {
        await onUpdate(eventData);
      } else {
        // Fallback: log ra console và hiển thị thông báo
        console.log("Dữ liệu sự kiện đã cập nhật:", eventData);
        alert("Sự kiện đã được cập nhật thành công!");
      }

      setIsModified(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật sự kiện:", error);
      alert("Có lỗi xảy ra khi cập nhật sự kiện!");
    } finally {
      setIsLoading(false);
    }
  }, [eventData, isModified, onUpdate]);

  // Kiểm tra nếu không có event data
  if (!eventData._id) {
    return (
      <div className="container mx-auto p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">
            Không tìm thấy sự kiện
          </h2>
          <p className="text-gray-500">
            Vui lòng chọn một sự kiện để xem chi tiết.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header với nút quay lại và nút cập nhật */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex text-2xl items-center">
          <Link
            to={-1}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ChevronLeft size={40} />
            <span className="ml-2 text-lg">Quay lại</span>
          </Link>
        </div>

        {/* Nút cập nhật và reset */}
        {!readOnly && isModified && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <RotateCcw size={16} />
              Hủy thay đổi
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              disabled={isLoading || !isModified}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <Save size={16} />
              {isLoading ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        )}
      </div>

      {/* Badge trạng thái thay đổi */}
      {isModified && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center text-yellow-800">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">
              Có thay đổi chưa được lưu
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 border border-gray-200 shadow-lg rounded-md p-6 gap-4">
        {/* Tên sự kiện */}
        <CustomInput
          label={"Tên sự kiện"}
          className={"col-span-12 md:col-span-6"}
          value={eventData.name}
          onChange={readOnly ? undefined : handleCustomInputChange("name")}
          disabled={readOnly}
        />

        {/* Trạng thái */}
        <CustomSection
          label={"Trạng thái"}
          className={"col-span-12 md:col-span-4"}
        >
          <CheckOption
            options={{
              sap_dien_ra: { label: "Sắp diễn ra", color: "yellow" },
              dang_dien_ra: { label: "Đang diễn ra", color: "green" },
              da_ket_thuc: { label: "Đã kết thúc", color: "blue" },
              da_huy: { label: "Đã hủy", color: "red" },
            }}
            value={eventData.status}
            onChange={readOnly ? undefined : handleStatusChange}
            multiple={false}
            disabled={readOnly}
          />
        </CustomSection>

        {/* Phạm vi */}
        <CustomSection
          label={"Phạm vi"}
          className={"col-span-12 md:col-span-2"}
        >
          <CheckOption
            options={{
              noi_bo: { label: "Nội bộ", color: "purple" },
              cong_khai: { label: "Công khai", color: "indigo" },
            }}
            value={eventData.scope}
            onChange={readOnly ? undefined : handleScopeChange}
            multiple={false}
            disabled={readOnly}
          />
        </CustomSection>

        {/* Thời điểm bắt đầu */}
        <CustomInput
          label={"Thời điểm bắt đầu"}
          type="datetime-local"
          className={"col-span-12 md:col-span-3"}
          value={formatForDatetimeLocal(eventData.startedAt)}
          onChange={readOnly ? undefined : handleCustomInputChange("startedAt")}
          disabled={readOnly}
        />



        {/* Thời điểm kết thúc */}
        <CustomInput
          label={"Thời điểm kết thúc"}
          type="datetime-local"
          className={"col-span-12 md:col-span-3"}
          value={formatForDatetimeLocal(eventData.endedAt)}
          onChange={readOnly ? undefined : handleCustomInputChange("endedAt")}
          disabled={readOnly}
        />
 {/* Mô tả */}
        <CustomSection
          label={"Mô tả sự kiện"}
          className={"col-span-12 md:col-span-6 row-span-2"}
        >
          <textarea
            value={eventData.description}
            onChange={readOnly ? undefined : handleDescriptionChange}
            disabled={readOnly}
            className="w-full h-52 resize-none border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Mô tả chi tiết về sự kiện..."
          />
        </CustomSection>
        {/* Địa điểm */}
        <CustomSection
          label={"Địa điểm"}
          className={"col-span-12 md:col-span-6"}
        >
          <textarea
            value={eventData.venue}
            onChange={readOnly ? undefined : handleVenueChange}
            disabled={readOnly}
            className="w-full h-32 resize-none border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Nhập địa điểm tổ chức sự kiện..."
          />
        </CustomSection>

       

        {/* Nhãn (Tags) */}
        <CustomSection label={"Nhãn (Tags)"} className={"col-span-12 h-fit"}>
          <CheckOption
            options={Object.fromEntries(
              Object.entries(EVENT_TAGS).map(([key, { label }], index) => [
                key,
                {
                  label,
                  color: [
                    "blue",
                    "green",
                    "yellow",
                    "red",
                    "purple",
                    "cyan",
                    "pink",
                  ][index % 7],
                },
              ])
            )}
            value={eventData.tags}
            onChange={readOnly ? undefined : handleTagsChange}
            multiple={true}
            disabled={readOnly}
          />
        </CustomSection>

        {/* Hình ảnh sự kiện */}
        <CustomSection className={"col-span-12 w-full"}>
          <EventImageSection
            images={eventData.images}
            onImagesChange={
              readOnly
                ? undefined
                : (newImages) => {
                    handleInputChange("images", newImages);
                  }
            }
            readOnly={readOnly}
          />
        </CustomSection>

        {/* Chi đoàn tổ chức */}
        <CustomSection
          label={"Chi đoàn tổ chức"}
          className={
            "col-span-12 p-4 bg-indigo-50 border border-indigo-200 rounded-lg shadow-md"
          }
        >
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-indigo-700 hover:text-indigo-800 transition duration-150">
              <Link to={`/chapters/${eventData.chapterId._id}`}>
                {eventData.chapterId.name}
              </Link>
            </h3>
            <div className="flex items-center text-sm text-gray-700">
              <span className="mr-2 text-indigo-400">🏢</span>
              <span className="font-medium">Trực thuộc:</span>{" "}
              {eventData.chapterId.affiliated}
            </div>
            <div className="flex items-start text-sm text-gray-600">
              <span className="mr-2 text-indigo-400 mt-0.5">📍</span>
              <span className="font-medium">Địa chỉ:</span>
              <span className="ml-1">{eventData.chapterId.address}</span>
            </div>
          </div>
        </CustomSection>

        {/* Thông tin meta */}
        <AttendanceListSection/>
        <CommentSection/>
      </div>
    </div>
  );
};

export default EventDetailView;

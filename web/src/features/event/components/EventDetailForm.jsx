import React, { useState, useEffect } from "react";
import EventImageUpload from "./EventImageUpload";
import EventDocumentUpload from "./EventDocumentUpload";

function EventDetailForm({ eventId = null }) {
  const [formValues, setFormValues] = useState({
    name: "",
    startAt: "",
    endAt: "",
    location: "",
    description: "",
    checkInStart: "",
    checkInEnd: "",
    images: [],
    documents: [],
  });

  // Mock data khi edit
  useEffect(() => {
    if (!eventId) return;
    // Giả lập fetch dữ liệu
    const mockData = {
      name: "Hội thao thanh niên",
      startAt: "2025-11-10T08:00",
      endAt: "2025-11-10T17:00",
      location: "Sân vận động quận 1",
      description: "Chương trình hội thao dành cho tất cả đoàn viên trong khu phố.",
      checkInStart: "2025-11-10T07:30",
      checkInEnd: "2025-11-10T08:30",
      images: [],
      documents: [],
    };
    setFormValues(mockData);
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Tên sự kiện */}
      <div className="col-span-12 md:col-span-8 md:col-start-3 flex flex-col gap-2">
        <label className="font-semibold">Tên sự kiện</label>
        <input
          name="name"
          value={formValues.name}
          onChange={handleChange}
          placeholder="Nhập tên sự kiện"
          className="border h-10 rounded-md border-gray-300 px-4 outline-none bg-transparent"
        />
      </div>

      {/* Thời gian bắt đầu */}
      <div className="col-span-12 md:col-span-4 md:col-start-3 flex flex-col gap-2">
        <label className="font-semibold">Thời gian bắt đầu</label>
        <input
          name="startAt"
          type="datetime-local"
          value={formValues.startAt}
          onChange={handleChange}
          className="border h-10 rounded-md border-gray-300 px-4 outline-none bg-transparent"
        />
      </div>

      {/* Thời gian kết thúc */}
      <div className="col-span-12 md:col-span-4 flex flex-col gap-2">
        <label className="font-semibold">Thời gian kết thúc</label>
        <input
          name="endAt"
          type="datetime-local"
          value={formValues.endAt}
          onChange={handleChange}
          className="border h-10 rounded-md border-gray-300 px-4 outline-none bg-transparent"
        />
      </div>

      {/* Địa điểm */}
      <div className="col-span-12 md:col-span-8 md:col-start-3 flex flex-col gap-2">
        <label className="font-semibold">Địa điểm tổ chức</label>
        <input
          name="location"
          value={formValues.location}
          onChange={handleChange}
          placeholder="Nhập địa điểm"
          className="border h-10 rounded-md border-gray-300 px-4 outline-none bg-transparent"
        />
      </div>

      {/* Upload ảnh & tài liệu */}
      <EventImageUpload />
      {/* <EventDocumentUpload /> */}

      {/* Mô tả chi tiết */}
      <div className="col-span-12 md:col-span-8 md:col-start-3 flex flex-col gap-2">
        <label className="font-semibold">Thông tin sự kiện</label>
        <textarea
          name="description"
          rows={4}
          value={formValues.description}
          onChange={handleChange}
          placeholder="Nhập mô tả hoặc nội dung sự kiện..."
          className="border rounded-md border-gray-300 px-4 py-2 outline-none bg-transparent"
        />
      </div>

      {/* Thời gian điểm danh */}
      <div className="col-span-12 md:col-span-4 md:col-start-3 flex flex-col gap-2">
        <label className="font-semibold">Bắt đầu điểm danh</label>
        <input
          name="checkInStart"
          type="datetime-local"
          value={formValues.checkInStart}
          onChange={handleChange}
          className="border h-10 rounded-md border-gray-300 px-4 outline-none bg-transparent"
        />
      </div>
      <div className="col-span-12 md:col-span-4 flex flex-col gap-2">
        <label className="font-semibold">Kết thúc điểm danh</label>
        <input
          name="checkInEnd"
          type="datetime-local"
          value={formValues.checkInEnd}
          onChange={handleChange}
          className="border h-10 rounded-md border-gray-300 px-4 outline-none bg-transparent"
        />
      </div>

      {/* Nút hành động */}
      <div className="col-span-12 md:col-span-8 md:col-start-3 flex justify-end gap-4 mt-4">
        <button className="bg-blue-500 text-white font-semibold px-6 h-10 rounded-md hover:bg-blue-600 transition">
          Chỉnh sửa
        </button>
        <button className="bg-green-500 text-white font-semibold px-6 h-10 rounded-md hover:bg-green-600 transition">
          Gửi thông báo
        </button>
      </div>
    </div>
  );
}

export default EventDetailForm;

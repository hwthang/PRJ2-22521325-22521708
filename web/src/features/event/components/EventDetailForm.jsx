import React, { useState, useEffect } from "react";
import EventImageUpload from "./EventImageUpload";
import qrcode from "../../../core/assets/images/qrcode.png";

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

  const [checkInList, setCheckInList] = useState([]);
  const [showCheckIn, setShowCheckIn] = useState(false); // quản lý hiển thị QR + danh sách

  // Mock data khi edit
  useEffect(() => {
    if (!eventId) return;
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

    // Mock danh sách check-in
    setCheckInList([
      { id: 1, name: "Nguyễn Văn A", time: "07:35" },
      { id: 2, name: "Trần Thị B", time: "07:40" },
      { id: 3, name: "Lê Văn C", time: "07:50" },
    ]);
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm toggle hiển thị QR + danh sách
  const handleCheckInClick = () => {
    setShowCheckIn((prev) => !prev);
  };

  // Mock trạng thái: Chưa bắt đầu, Đang diễn ra, Đã kết thúc
  const getEventStatus = () => {
    const now = new Date();
    const start = new Date(formValues.startAt);
    const end = new Date(formValues.endAt);
    if (!formValues.startAt || !formValues.endAt) return "Chưa xác định";
    if (now < start) return "Chưa bắt đầu";
    if (now >= start && now <= end) return "Đang diễn ra";
    return "Đã kết thúc";
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* -------------------- Form sự kiện -------------------- */}
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

      {/* Label trạng thái */}
      <div className="col-span-12 md:col-span-8 md:col-start-3 flex items-center gap-2 mt-2">
        <span className="font-semibold">Trạng thái: </span>
        <span
          className={`px-3 py-1 rounded-full font-medium ${
            getEventStatus() === "Đang diễn ra"
              ? "bg-green-200 text-green-800"
              : getEventStatus() === "Chưa bắt đầu"
              ? "bg-yellow-200 text-yellow-800"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {getEventStatus()}
        </span>
      </div>

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

      {/* Upload ảnh */}
      <EventImageUpload />

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
      <div className="col-span-12 md:col-span-8 md:col-start-3 flex justify-between gap-4 mt-4">
        <button className="bg-blue-500 text-white font-semibold px-6 h-10 rounded-md hover:bg-blue-600 transition">
          Chỉnh sửa
        </button>
        <button
          onClick={handleCheckInClick}
          className="bg-green-500 text-white font-semibold px-6 h-10 rounded-md hover:bg-green-600 transition"
        >
          Điểm danh
        </button>
      </div>

      {/* -------------------- UI Điểm danh QR -------------------- */}
      {showCheckIn && (
        <div className="col-span-12 md:col-span-8 md:col-start-3 mt-10 flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-gray-800">Điểm danh QR</h2>

          {/* QR code dùng ảnh */}
          <div className="mx-auto">
            <img
              src={qrcode} // Đường dẫn ảnh QR thực tế
              alt="QR Code check-in"
              className="w-40 h-40"
            />
          </div>

          {/* Hướng dẫn */}
          <p className="text-gray-600 text-center">
            Quét mã QR trên điện thoại để điểm danh vào sự kiện.
          </p>

          {/* Danh sách người đã check-in */}
          <div>
            <h3 className="font-semibold mb-2">Danh sách đã điểm danh</h3>
            <ul className="border rounded-md bg-white divide-y">
              {checkInList.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between px-4 py-2 hover:bg-gray-50 transition"
                >
                  <span>{item.name}</span>
                  <span className="text-gray-500">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventDetailForm;

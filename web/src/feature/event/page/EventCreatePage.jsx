import { ChevronLeft, Loader2, CalendarCheck, AlertCircle } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomInput from "../../component/custom/CustomInput";
import CustomTextArea from "../../component/custom/CustomTextArea";
import CustomSection from "../../component/custom/CustomSection";
import ImageCard from "../../component/card/ImageCard";
import DragDropUpload from "../../component/DragDropUpload";
import useForm from "../../../core/hooks/useForm";
import { eventTopics } from "../shared/EventMap";
import { CheckOption } from "../../../core/components/CheckOption";
import { onUpload } from "../../../utils/cloudinary";
import apiClient from "../../../utils/api";
import customCache from "../../../utils/customCache";

const EventCreatePage = () => {
  const navigate = useNavigate();
  const formInstance = useForm({
    name: "",
    startedAt: "",
    endedAt: "",
    venue: "",
    description: "",
    images: [], // [{ url: localObjectURL, file }]
    tags: [],
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    formInstance.handleChangeFieldInForm(name, value);
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddImage = (fileOrFiles) => {
    const filesArray = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
    const newImages = filesArray.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));
    formInstance.handleChangeFieldInForm("images", [
      ...formInstance.getFieldInForm("images"),
      ...newImages,
    ]);
  };

  const handleDeleteImage = (image) => {
    const filtered = formInstance
      .getFieldInForm("images")
      .filter((img) => img !== image);
    formInstance.handleChangeFieldInForm("images", filtered);
  };

  // --- Ràng buộc và Validate dữ liệu ---
  const validate = () => {
    const newErrors = {};
    const form = formInstance.form;
    const now = new Date();
    const start = new Date(form.startedAt);
    const end = new Date(form.endedAt);

    if (!form.name?.trim()) newErrors.name = "Tên sự kiện không được để trống";
    
    if (!form.startedAt) {
      newErrors.startedAt = "Thời điểm bắt đầu không được để trống";
    } else if (start < now) {
      newErrors.startedAt = "Thời gian bắt đầu không thể ở trong quá khứ";
    }

    if (!form.endedAt) {
      newErrors.endedAt = "Thời điểm kết thúc không được để trống";
    } else if (form.startedAt && end <= start) {
      newErrors.endedAt = "Thời điểm kết thúc phải sau thời điểm bắt đầu ít nhất 1 phút";
    }

    if (!form.venue?.trim()) newErrors.venue = "Địa điểm không được để trống";
    
    if (!form.tags || form.tags.length === 0)
      newErrors.tags = "Chọn ít nhất một chủ đề";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      setStatus({ type: "error", message: "Vui lòng kiểm tra lại thông tin nhập liệu." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const form = formInstance.form;
      const imageEntries = form.images || [];

      // 1. Upload ảnh lên Cloudinary
      let uploadedImages = [];
      if (imageEntries.length > 0) {
        uploadedImages = await Promise.all(
          imageEntries.map((img) => onUpload(img.file, "image"))
        );
      }

      // 2. Chuẩn bị payload
      const myChapterId = customCache.myAccount.get()?.chapter?._id;
      if (!myChapterId) throw new Error("Không tìm thấy thông tin Chi đoàn.");

      const payload = {
        chapterId: myChapterId,
        name: form.name.trim(),
        startedAt: form.startedAt,
        endedAt: form.endedAt,
        venue: form.venue.trim(),
        description: form.description.trim(),
        tags: form.tags,
        images: uploadedImages, // Format: [{ publicId, url }]
      };

      // 3. Gọi API tạo sự kiện
      const response = await apiClient.post("/api/events", payload);

      if (response?.success) {
        setStatus({ type: "success", message: "Tạo sự kiện thành công! Đang chuyển hướng..." });
        setTimeout(() => {
          navigate(-1); // Chuyển về trang danh sách sau 1.5s
        }, 1500);
      } else {
        setStatus({ type: "error", message: response?.message || "Lỗi từ máy chủ" });
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: err.message || "Có lỗi xảy ra trong quá trình xử lý",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to={-1}
          className="hover:bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center transition-colors border border-gray-200 shadow-sm"
        >
          <ChevronLeft />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Tạo sự kiện mới</h1>
      </div>

      <div className="p-8 bg-white shadow-xl border border-gray-100 rounded-xl grid grid-cols-12 gap-6">
        
        {/* Tên sự kiện */}
        <CustomInput
          className="col-span-12 md:col-span-12"
          label="Tên sự kiện"
          name="name"
          placeholder="Ví dụ: Đại hội Chi đoàn nhiệm kỳ 2024-2025"
          value={formInstance.getFieldInForm("name")}
          onChange={handleChange}
          error={errors.name}
        />

        {/* Thời điểm */}
        <CustomInput
          className="col-span-12 md:col-span-6"
          label="Thời điểm bắt đầu"
          name="startedAt"
          type="datetime-local"
          value={formInstance.getFieldInForm("startedAt")}
          onChange={handleChange}
          error={errors.startedAt}
        />
        <CustomInput
          className="col-span-12 md:col-span-6"
          label="Thời điểm kết thúc"
          name="endedAt"
          type="datetime-local"
          value={formInstance.getFieldInForm("endedAt")}
          onChange={handleChange}
          error={errors.endedAt}
        />

        {/* Chủ đề */}
        <CustomSection label="Chủ đề sự kiện" className="col-span-12">
          <div className="mt-2">
            <CheckOption
              options={eventTopics}
              value={formInstance.getFieldInForm("tags")}
              multiple={true}
              onChange={(tags) => formInstance.handleChangeFieldInForm("tags", tags)}
            />
            {errors.tags && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.tags}
              </p>
            )}
          </div>
        </CustomSection>

        {/* Địa điểm */}
        <CustomInput
          className="col-span-12"
          label="Địa điểm tổ chức"
          name="venue"
          placeholder="Nhập tên hội trường, phòng họp hoặc địa chỉ..."
          value={formInstance.getFieldInForm("venue")}
          onChange={handleChange}
          error={errors.venue}
        />

        {/* Mô tả */}
        <CustomTextArea
          className="col-span-12"
          label="Mô tả nội dung"
          name="description"
          rows={5}
          placeholder="Viết tóm tắt về nội dung sự kiện..."
          value={formInstance.getFieldInForm("description")}
          onChange={handleChange}
        />

        {/* Hình ảnh */}
        <CustomSection label="Hình ảnh đính kèm" className="col-span-12">
          <div className="flex gap-4 flex-wrap mt-2 min-h-[200px] p-2 border-2 border-dashed border-gray-100 rounded-lg">
            <div className="w-48 h-48">
              <DragDropUpload multiple onFile={handleAddImage} />
            </div>
            {formInstance.getFieldInForm("images").map((img, idx) => (
                <div key={idx} className="w-44 mr-2">
                  <ImageCard key={idx} data={img} onDelete={handleDeleteImage} />
                  </div>
              
            ))}
          </div>
        </CustomSection>

        {/* Thông báo trạng thái */}
        {status.message && (
          <div className={`col-span-12 p-4 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
            status.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {status.type === "success" ? <CalendarCheck /> : <AlertCircle />}
            <span className="font-medium">{status.message}</span>
          </div>
        )}

        {/* Nút hành động */}
        <div className="col-span-12 flex justify-end gap-4 mt-4 border-t pt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-all font-semibold"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-200 flex items-center gap-2 disabled:bg-blue-400"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Đang xử lý...
              </>
            ) : (
              "Tạo sự kiện"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCreatePage;
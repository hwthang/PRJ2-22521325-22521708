import { ChevronLeft } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import CustomInput from "../../component/custom/CustomInput";
import CustomTextArea from "../../component/custom/CustomTextArea";
import CustomSection from "../../component/custom/CustomSection";
import ImageCard from "../../component/card/ImageCard";
import DragDropUpload from "../../component/DragDropUpload";
import useForm from "../../../core/hooks/useForm";
import { eventTopics } from "../shared/EventMap";
import { CheckOption } from "../../../core/components/CheckOption";
import useEventCreate from "../hook/useEventCreate";
import { onUpload } from "../../../utils/cloudinary"; // 👈 dùng Cloudinary upload
import apiClient from "../../../utils/api";
import customCache from "../../../utils/customCache";

const EventCreatePage = () => {
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
  const [errors, setErrors] = useState({}); // lỗi validate

  const handleChange = (e) => {
    const { name, value } = e.target;
    formInstance.handleChangeFieldInForm(name, value);
    setErrors((prev) => ({ ...prev, [name]: "" })); // xóa lỗi khi user sửa
  };

  const handleAddImage = (fileOrFiles) => {
    const filesArray = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
    const newImages = filesArray.map((file) => ({
      url: URL.createObjectURL(file), // preview local
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

  const validate = () => {
    const newErrors = {};
    const form = formInstance.form;

    if (!form.name?.trim()) newErrors.name = "Tên sự kiện không được để trống";
    if (!form.startedAt?.trim())
      newErrors.startedAt = "Thời điểm bắt đầu không được để trống";
    if (!form.endedAt?.trim())
      newErrors.endedAt = "Thời điểm kết thúc không được để trống";
    if (!form.venue?.trim()) newErrors.venue = "Địa điểm không được để trống";
    if (!form.tags || form.tags.length === 0)
      newErrors.tags = "Chọn ít nhất một chủ đề";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const form = formInstance.form;
    const imageEntries = form.images || [];

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      // 1️⃣ Upload ảnh lên Cloudinary trước
      let uploadedImages = [];

      if (imageEntries.length > 0) {
        uploadedImages = await Promise.all(
          imageEntries.map(
            (img) =>
              // img.file lấy từ handleAddImage
              onUpload(img.file, "image") // nếu sau này có video thì đổi logic resourceType
          )
        );
      }

      // 2️⃣ Chuẩn bị payload JSON gửi lên API
      // Tuỳ backend, bạn điều chỉnh cấu trúc images cho phù hợp:
      // ở đây: [{ publicId, url }]
      const payload = {
        chapterId: customCache.myAccount.get().chapter._id,
        ...form,
        images: uploadedImages,
      };

      console.log(payload);

      // 3️⃣ Gọi API tạo event
      const response = await apiClient.post("/api/events", payload);

      if (response?.success) {
        setStatus({ type: "success", message: "Tạo sự kiện thành công!" });
        formInstance.resetForm();
        setErrors({});
      } else {
        const message = response?.message || "Có lỗi xảy ra";
        setStatus({ type: "error", message });
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: err?.response?.message || err.message || "Có lỗi xảy ra",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <Link
        to={-1}
        className="active:bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center"
      >
        <ChevronLeft />
      </Link>

      <div className="p-6 flex flex-col gap-6 shadow-md border border-gray-200 rounded-md md:grid md:grid-cols-12 md:gap-4">
        {/* Tên sự kiện */}
        <CustomInput
          className={"col-span-6"}
          label="Tên sự kiện"
          name="name"
          value={formInstance.getFieldInForm("name")}
          onChange={handleChange}
          error={errors.name}
        />

        {/* Thời điểm */}
        <CustomInput
          className={"col-span-3"}
          label="Thời điểm bắt đầu"
          name="startedAt"
          type="datetime-local"
          value={formInstance.getFieldInForm("startedAt")}
          onChange={handleChange}
          error={errors.startedAt}
        />
        <CustomInput
          className={"col-span-3"}
          label="Thời điểm kết thúc"
          name="endedAt"
          type="datetime-local"
          value={formInstance.getFieldInForm("endedAt")}
          onChange={handleChange}
          error={errors.endedAt}
        />

        {/* Chủ đề */}
        <CustomSection label="Chủ đề" className={"col-span-12"}>
          <CheckOption
            options={eventTopics}
            value={formInstance.getFieldInForm("tags")}
            multiple={true}
            onChange={(tags) =>
              formInstance.handleChangeFieldInForm("tags", tags)
            }
          />
          {errors.tags && (
            <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
          )}
        </CustomSection>

        {/* Địa điểm */}
        <CustomInput
          className={"col-span-12"}
          label="Địa điểm"
          name="venue"
          value={formInstance.getFieldInForm("venue")}
          onChange={handleChange}
          error={errors.venue}
        />

        {/* Mô tả */}
        <CustomTextArea
          className={"col-span-12"}
          label="Mô tả"
          name="description"
          value={formInstance.getFieldInForm("description")}
          onChange={handleChange}
        />

        {/* Hình ảnh */}
        <CustomSection label="Hình ảnh" className={"col-span-12"}>
          <div className="flex gap-4 flex-wrap min-h-48">
            <div className="w-48">
              <DragDropUpload multiple onFile={handleAddImage} />
            </div>
            {formInstance.getFieldInForm("images").map((img, idx) => (
              <ImageCard key={idx} data={img} onDelete={handleDeleteImage} />
            ))}
          </div>
        </CustomSection>

        {/* Thông báo status/error */}
        {status.message && (
          <div
            className={`mt-2 p-2 rounded-md text-sm font-medium col-span-12 ${
              status.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {status.message}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition col-span-2 col-start-6 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Đang tạo..." : "Tạo sự kiện"}
        </button>
      </div>
    </div>
  );
};

export default EventCreatePage;

import React, { useEffect, useState } from "react";
import CustomInput from "../../component/custom/CustomInput";
import CustomTextArea from "../../component/custom/CustomTextArea";
import CustomSection from "../../component/custom/CustomSection";
import ImageCard from "../../component/card/ImageCard";
import DragDropUpload from "../../component/DragDropUpload";
import { CheckOption } from "../../../core/components/CheckOption";
import useForm from "../../../core/hooks/useForm";
import { eventTopics, eventStatuses } from "../shared/EventMap";
import { CustomLabel } from "../../component/custom/CustomLabel";
import apiClient from "../../../utils/api";
import { toDatetimeInput } from "../../../utils/date";
import { getStatus } from "../../../utils/event_status";
import { onUpload } from "../../../utils/cloudinary";

// Chuẩn hoá images: giữ nguyên object, chỉ fallback nếu là string
const normalizeImages = (images = []) =>
  images.map((img) => {
    if (typeof img === "string") {
      return { url: img };
    }
    return img; // giữ nguyên full object từ BE (publicId, url, timestamp, ...)
  });

const EventDetailForm = ({ event }) => {
  const formInstance = useForm();

  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState({
    type: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [computedStatus, setComputedStatus] = useState();

  // -------------------------
  // HANDLE CHANGES
  // -------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    formInstance.handleChangeFieldInForm(name, value);
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // User chọn / drag-drop ảnh → upload Cloudinary → lưu full asset vào form
  const handleAddImage = async (fileOrFiles) => {
    const filesArray = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
    if (!filesArray.length) return;

    try {
      setUploading(true);

      const uploadedAssets = await Promise.all(
        filesArray.map(async (file) => {
          // onUpload trả về: { publicId, url, timestamp, signature, resourceType }
          const asset = await onUpload(file, "image");
          return asset; // giữ nguyên full object
        })
      );

      const currentImages = formInstance.getFieldInForm("images") || [];
      formInstance.handleChangeFieldInForm("images", [
        ...currentImages,
        ...uploadedAssets,
      ]);
    } catch (err) {
      console.error("Upload image error:", err);
      setStatusMessage({
        type: "error",
        message: err?.message || "Upload hình ảnh thất bại",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = (image) => {
    const filtered =
      formInstance
        .getFieldInForm("images")
        // lọc theo publicId nếu có, fallback theo url
        ?.filter((img) => {
          if (img.publicId && image.publicId) {
            return img.publicId !== image.publicId;
          }
          return img.url !== image.url;
        }) || [];

    formInstance.handleChangeFieldInForm("images", filtered);
  };

  // -------------------------
  // VALIDATION
  // -------------------------
  const validate = () => {
    const newErrors = {};
    const form = formInstance.form || {};

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

  // -------------------------
  // CHECK IF FORM CHANGED
  // -------------------------
  const isFormChanged = () => {
    const original = {
      name: event?.name || "",
      startedAt: event?.startedAt || "",
      endedAt: event?.endedAt || "",
      venue: event?.venue || "",
      description: event?.description || "",
      images: normalizeImages(event?.images || []),
      tags: event?.tags || [],
      status: event?.status,
    };

    const current = {
      ...formInstance.form,
      images: normalizeImages(formInstance.form?.images || []),
    };

    return JSON.stringify(original) !== JSON.stringify(current);
  };

  // -------------------------
  // UPDATE EVENT (JSON, KHÔNG FormData)
  // -------------------------
  const handleUpdateEvent = async () => {
    if (!validate()) return;

    setLoading(true);
    setStatusMessage({ type: "", message: "" });

    try {
      const images = normalizeImages(
        formInstance.getFieldInForm("images") || []
      );

      const payload = {
        name: formInstance.getFieldInForm("name"),
        description: formInstance.getFieldInForm("description"),
        venue: formInstance.getFieldInForm("venue"),
        startedAt: formInstance.getFieldInForm("startedAt"),
        endedAt: formInstance.getFieldInForm("endedAt"),
        tags: formInstance.getFieldInForm("tags") || [],
        // Gửi full object ảnh: { publicId, url, timestamp, signature, resourceType }
        images,
      };
      console.log(payload);
      const response = await apiClient.put(`/api/events/${event._id}`, payload);

      if (response?.success) {
        setStatusMessage({
          type: "success",
          message: "Cập nhật sự kiện thành công!",
        });

        const updatedEvent = response.data.event;

        // cập nhật lại form với images mới từ BE (nếu BE có chỉnh sửa)
        formInstance.handleChangeFieldInForm(
          "images",
          normalizeImages(updatedEvent.images || [])
        );

        setComputedStatus(getStatus({ ...event, ...payload }));
      } else {
        setStatusMessage({
          type: "error",
          message: response?.message || "Có lỗi xảy ra",
        });
      }
    } catch (err) {
      setStatusMessage({
        type: "error",
        message: err?.message || "Có lỗi xảy ra",
      });
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // CANCEL EVENT
  // -------------------------
  const handleCancelEvent = async () => {
    setLoading(true);
    setStatusMessage({ type: "", message: "" });

    try {
      const response = await apiClient.patch(`/api/events/${event._id}/cancel`);
      if (response?.success) {
        setStatusMessage({
          type: "success",
          message: "Sự kiện đã được hủy!",
        });
        setComputedStatus("da_huy");
      } else {
        setStatusMessage({
          type: "error",
          message: response?.message || "Có lỗi xảy ra",
        });
      }
    } catch (err) {
      setStatusMessage({
        type: "error",
        message: err?.message || "Có lỗi xảy ra",
      });
    } finally {
      setShowCancelModal(false);
      setLoading(false);
    }
  };

  // -------------------------
  // INIT FORM
  // -------------------------
  useEffect(() => {
    formInstance.setForm({
      name: event?.name || "",
      startedAt: event?.startedAt || "",
      endedAt: event?.endedAt || "",
      venue: event?.venue || "",
      description: event?.description || "",
      images: normalizeImages(event?.images || []),
      tags: event?.tags || [],
    });
    setComputedStatus(getStatus(event));
  }, [event]);

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <>
      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 ">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-lg font-semibold">Xác nhận hủy sự kiện</h3>
            <p className="mt-2 text-gray-600">
              Bạn có chắc chắn muốn hủy sự kiện này? Thao tác này không thể hoàn
              tác.
            </p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowCancelModal(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleCancelEvent}
                disabled={loading}
              >
                {loading ? "Đang hủy..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="p-6 shadow-md border border-gray-200 rounded-lg flex flex-col gap-6 md:grid md:grid-cols-12 md:gap-4">
        <div className="col-span-12 w-fit">
          <CustomLabel
            label={eventStatuses[computedStatus]?.label}
            color={eventStatuses[computedStatus]?.color}
            icon={eventStatuses[computedStatus]?.icon}
            selected
          />
        </div>

        <CustomInput
          className="col-span-6"
          label="Tên sự kiện"
          name="name"
          value={formInstance.getFieldInForm("name")}
          onChange={handleChange}
          error={errors.name}
        />

        <CustomInput
          className="col-span-3"
          label="Thời điểm bắt đầu"
          type="datetime-local"
          name="startedAt"
          value={toDatetimeInput(formInstance.getFieldInForm("startedAt"))}
          onChange={handleChange}
          error={errors.startedAt}
        />

        <CustomInput
          className="col-span-3"
          label="Thời điểm kết thúc"
          type="datetime-local"
          name="endedAt"
          value={toDatetimeInput(formInstance.getFieldInForm("endedAt"))}
          onChange={handleChange}
          error={errors.endedAt}
        />

        <CustomSection label="Chủ đề" className="col-span-12">
          <CheckOption
            options={eventTopics}
            value={formInstance.getFieldInForm("tags")}
            multiple
            onChange={(tags) =>
              formInstance.handleChangeFieldInForm("tags", tags)
            }
          />
          {errors.tags && (
            <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
          )}
        </CustomSection>

        <CustomInput
          className="col-span-12"
          label="Địa điểm"
          name="venue"
          value={formInstance.getFieldInForm("venue")}
          onChange={handleChange}
          error={errors.venue}
        />

        <CustomTextArea
          className="col-span-12"
          label="Mô tả"
          name="description"
          value={formInstance.getFieldInForm("description")}
          onChange={handleChange}
        />

        <CustomSection label="Hình ảnh" className="col-span-12">
          <div className="flex gap-4 flex-wrap min-h-48">
            <div className="w-48">
              <DragDropUpload multiple onFile={handleAddImage} />
              {uploading && (
                <p className="text-xs text-gray-500 mt-2">
                  Đang upload hình ảnh...
                </p>
              )}
            </div>

            {formInstance.getFieldInForm("images")?.map((img, idx) => (
              <div key={idx} className="flex flex-col w-48">
                <ImageCard data={img} onDelete={handleDeleteImage} />
              </div>
            ))}
          </div>
        </CustomSection>

        <div className="col-span-12 flex gap-4 mt-4">
          {computedStatus !== "canceled" && (
            <button
              onClick={handleUpdateEvent}
              disabled={loading || uploading || !isFormChanged()}
              className={`px-4 py-2 rounded transition text-white text-sm ${
                !isFormChanged() || uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Đang cập nhật..." : "Cập nhật sự kiện"}
            </button>
          )}

          {computedStatus !== "canceled" && (
            <button
              onClick={() => setShowCancelModal(true)}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm"
            >
              Hủy sự kiện
            </button>
          )}
        </div>

        {statusMessage.message && (
          <div
            className={`col-span-12 mt-2 p-2 rounded-md text-sm font-medium ${
              statusMessage.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {statusMessage.message}
          </div>
        )}
      </div>
    </>
  );
};

export default EventDetailForm;

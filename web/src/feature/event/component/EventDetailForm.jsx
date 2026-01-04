import React, { useEffect, useState } from "react";
import { AlertCircle, CalendarCheck, Loader2, Trash2 } from "lucide-react";
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
import { useNavigate } from "react-router-dom";

const normalizeImages = (images = []) =>
  images.map((img) => (typeof img === "string" ? { url: img } : img));

const EventDetailForm = ({ event }) => {
  const formInstance = useForm();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [computedStatus, setComputedStatus] = useState();

  // --- LOGIC KIỂM TRA THAY ĐỔI ---
  const isFormChanged = () => {
    const original = {
      name: event?.name || "",
      startedAt: event?.startedAt || "",
      endedAt: event?.endedAt || "",
      venue: event?.venue || "",
      description: event?.description || "",
      images: normalizeImages(event?.images || []),
      tags: event?.tags || [],
    };

    const current = {
      ...formInstance.form,
      images: normalizeImages(formInstance.form?.images || []),
    };

    return JSON.stringify(original) !== JSON.stringify(current);
  };

  // --- VALIDATION RÀNG BUỘC THỜI GIAN ---
  const validate = () => {
    const newErrors = {};
    const form = formInstance.form || {};
    const now = new Date();
    const start = new Date(form.startedAt);
    const end = new Date(form.endedAt);

    if (!form.name?.trim()) newErrors.name = "Tên sự kiện không được để trống";
    
    // Chỉ check "quá khứ" nếu thời gian bắt đầu có thay đổi so với gốc
    if (!form.startedAt) {
      newErrors.startedAt = "Thời điểm bắt đầu không được để trống";
    } else if (form.startedAt !== event.startedAt && start < now) {
      newErrors.startedAt = "Thời gian bắt đầu mới không thể ở trong quá khứ";
    }

    if (!form.endedAt) {
      newErrors.endedAt = "Thời điểm kết thúc không được để trống";
    } else if (form.startedAt && end <= start) {
      newErrors.endedAt = "Thời điểm kết thúc phải sau thời điểm bắt đầu";
    }

    if (!form.venue?.trim()) newErrors.venue = "Địa điểm không được để trống";
    if (!form.tags || form.tags.length === 0) newErrors.tags = "Chọn ít nhất một chủ đề";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    formInstance.handleChangeFieldInForm(name, value);
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddImage = async (fileOrFiles) => {
    const filesArray = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
    if (!filesArray.length) return;
    try {
      setUploading(true);
      const uploadedAssets = await Promise.all(
        filesArray.map((file) => onUpload(file, "image"))
      );
      const currentImages = formInstance.getFieldInForm("images") || [];
      formInstance.handleChangeFieldInForm("images", [...currentImages, ...uploadedAssets]);
    } catch (err) {
      setStatusMessage({ type: "error", message: "Upload hình ảnh thất bại" });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = (image) => {
    const filtered = formInstance.getFieldInForm("images")?.filter((img) => 
      img.publicId ? img.publicId !== image.publicId : img.url !== image.url
    ) || [];
    formInstance.handleChangeFieldInForm("images", filtered);
  };

  const handleUpdateEvent = async () => {
    if (!validate()) return;

    setLoading(true);
    setStatusMessage({ type: "", message: "" });

    try {
      const payload = {
        ...formInstance.form,
        name: formInstance.form.name.trim(),
        venue: formInstance.form.venue.trim(),
        description: formInstance.form.description.trim(),
        images: normalizeImages(formInstance.getFieldInForm("images") || []),
      };

      const response = await apiClient.put(`/api/events/${event._id}`, payload);

      if (response?.success) {
        setStatusMessage({ type: "success", message: "Cập nhật sự kiện thành công!" });
        setComputedStatus(getStatus(response.data.event));
        // Reset lại form với dữ liệu mới nhất từ server để isFormChanged() trả về false
        formInstance.setForm({
            ...response.data.event,
            images: normalizeImages(response.data.event.images)
        });
      } else {
        setStatusMessage({ type: "error", message: response?.message || "Cập nhật thất bại" });
      }
    } catch (err) {
      setStatusMessage({ type: "error", message: err?.message || "Có lỗi kết nối" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEvent = async () => {
    setLoading(true);
    try {
      const response = await apiClient.patch(`/api/events/${event._id}/cancel`);
      if (response?.success) {
        setStatusMessage({ type: "success", message: "Đã xóa sự kiện thành công!" });
        setTimeout(() => navigate(-1), 1000);
      }
    } catch (err) {
      setStatusMessage({ type: "error", message: "Không thể xóa sự kiện" });
    } finally {
      setLoading(false);
      setShowCancelModal(false);
    }
  };

  useEffect(() => {
    if (event) {
      formInstance.setForm({
        name: event.name || "",
        startedAt: event.startedAt || "",
        endedAt: event.endedAt || "",
        venue: event.venue || "",
        description: event.description || "",
        images: normalizeImages(event.images || []),
        tags: event.tags || [],
      });
      setComputedStatus(getStatus(event));
    }
  }, [event]);

  return (
    <>
      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <Trash2 size={24} />
              <h3 className="text-xl font-bold">Xác nhận xóa</h3>
            </div>
            <p className="text-gray-600">
              Bạn có chắc chắn muốn xóa sự kiện <strong>{event.name}</strong>? 
              Hành động này sẽ gỡ bỏ sự kiện khỏi hệ thống và không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowCancelModal(false)}
              >
                Quay lại
              </button>
              <button
                className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-lg shadow-red-200 flex items-center gap-2"
                onClick={handleCancelEvent}
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Xác nhận xóa"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="p-8 bg-white shadow-xl border border-gray-100 rounded-xl flex flex-col gap-6 md:grid md:grid-cols-12 md:gap-6">
        <div className="col-span-12 flex justify-between items-center border-b pb-4">
          <CustomLabel
            label={eventStatuses[computedStatus]?.label}
            color={eventStatuses[computedStatus]?.color}
            icon={eventStatuses[computedStatus]?.icon}
            selected
          />
          <span className="text-xs text-gray-400 font-mono">ID: {event._id}</span>
        </div>

        <CustomInput
          className="col-span-12 md:col-span-6"
          label="Tên sự kiện"
          name="name"
          value={formInstance.getFieldInForm("name")}
          onChange={handleChange}
          error={errors.name}
        />

        <CustomInput
          className="col-span-6 md:col-span-3"
          label="Bắt đầu"
          type="datetime-local"
          name="startedAt"
          value={toDatetimeInput(formInstance.getFieldInForm("startedAt"))}
          onChange={handleChange}
          error={errors.startedAt}
        />

        <CustomInput
          className="col-span-6 md:col-span-3"
          label="Kết thúc"
          type="datetime-local"
          name="endedAt"
          value={toDatetimeInput(formInstance.getFieldInForm("endedAt"))}
          onChange={handleChange}
          error={errors.endedAt}
        />

        <CustomSection label="Chủ đề sự kiện" className="col-span-12">
          <CheckOption
            options={eventTopics}
            value={formInstance.getFieldInForm("tags")}
            multiple
            onChange={(tags) => formInstance.handleChangeFieldInForm("tags", tags)}
          />
          {errors.tags && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><AlertCircle size={14}/> {errors.tags}</p>}
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
          label="Mô tả chi tiết"
          name="description"
          rows={4}
          value={formInstance.getFieldInForm("description")}
          onChange={handleChange}
        />

        <CustomSection label="Hình ảnh tư liệu" className="col-span-12">
          <div className="flex gap-4 flex-wrap min-h-[180px] p-2 border-2 border-dashed border-gray-50 rounded-xl bg-gray-50/30">
            <div className="w-48 h-48">
              <DragDropUpload multiple onFile={handleAddImage} />
              {uploading && <div className="flex items-center gap-2 text-xs text-blue-600 mt-2 font-medium"><Loader2 size={12} className="animate-spin"/> Đang tải...</div>}
            </div>

            {formInstance.getFieldInForm("images")?.map((img, idx) => (
              <div key={idx} className="w-44 mr-2">
                <ImageCard data={img} onDelete={handleDeleteImage} />
              </div>
            ))}
          </div>
        </CustomSection>

        {/* Action Buttons */}
        <div className="col-span-12 flex flex-col md:flex-row gap-4 mt-6 pt-6 border-t">
          {computedStatus !== "canceled" && (
            <button
              onClick={handleUpdateEvent}
              disabled={loading || uploading || !isFormChanged()}
              className={`flex-1 md:flex-none px-8 py-2.5 rounded-lg font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
                !isFormChanged() || uploading
                  ? "bg-gray-300 cursor-not-allowed shadow-none"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100"
              }`}
            >
              {loading ? <Loader2 className="animate-spin" size={18}/> : "Lưu thay đổi"}
            </button>
          )}

          {computedStatus !== "canceled" && (
            <button
              onClick={() => setShowCancelModal(true)}
              disabled={loading}
              className="px-6 py-2.5 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-all font-semibold flex items-center justify-center gap-2"
            >
              <Trash2 size={18} /> Xóa sự kiện
            </button>
          )}
        </div>

        {/* Status Toast Simulation */}
        {statusMessage.message && (
          <div className={`col-span-12 p-4 rounded-lg flex items-center gap-3 animate-in slide-in-from-bottom-2 ${
            statusMessage.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {statusMessage.type === "success" ? <CalendarCheck size={20}/> : <AlertCircle size={20}/>}
            <span className="font-medium">{statusMessage.message}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default EventDetailForm;
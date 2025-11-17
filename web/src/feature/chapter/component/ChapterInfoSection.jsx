import React, { useEffect, useState } from "react";
import CustomInput from "../shared/CustomInput";
import { defAvatar } from "../../../core/assets/images";
import { Camera, Check, Edit, Lock, ShieldCheck, X } from "lucide-react";
import { toDateInputValue } from "../../../utils/date";
import { STATUS_MAP } from "../../../utils/map";

function ChapterInfoSection({ chapter, onUpdate, onActivate, onLock }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({}); // <--- state lưu lỗi
  const [avatarPreview, setAvatarPreview] = useState();
  const [avatarFile, setAvatarFile] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    const { value, name } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // reset lỗi khi user nhập
  };

  const handleAvatarChange = (e) => {
    if (!isEditing) return;
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh!");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!form.name?.trim()) newErrors.name = "Tên chi đoàn không được để trống";
    if (!form.affiliated?.trim())
      newErrors.affiliated = "Đoàn trực thuộc không được để trống";
    if (!form.establishedAt) newErrors.establishedAt = "Ngày thành lập bắt buộc";
    if (!form.address?.trim()) newErrors.address = "Địa chỉ không được để trống";
    if (!form.username?.trim()) newErrors.username = "Tên đăng nhập không được để trống";
    if (!form.email?.trim()) newErrors.email = "Email không được để trống";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email không hợp lệ";
    if (!form.phoneNumber?.trim()) newErrors.phoneNumber = "Số điện thoại không được để trống";
    else if (!/^\d{9,15}$/.test(form.phoneNumber))
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Confirm update
  const handleConfirm = () => {
    if (!validateForm()) return; // nếu lỗi → dừng

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });
    if (avatarFile) formData.append("avatar", avatarFile);

    onUpdate(chapter.id, formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm(chapter);
    setAvatarPreview(chapter.avatar || defAvatar);
    setAvatarFile(null);
    setErrors({});
    setIsEditing(false);
  };

  const handleActivate = () => onActivate(chapter.id);
  const handleLock = () => onLock(chapter.id);

  useEffect(() => {
    setForm(chapter);
    setAvatarPreview(chapter.avatar || defAvatar);
  }, [chapter]);

  return (
    <div className="bg-white p-6 rounded-lg border-gray-200 border shadow-lg">
      <div className="font-semibold text-2xl mb-6 flex justify-between">
        <span>Thông tin chi đoàn</span>
        <div className="flex gap-4">
          {isEditing ? (
            <div className="flex gap-4">
              <div
                onClick={handleConfirm}
                className="active:bg-green-400 bg-green-500 text-white p-2 rounded-full cursor-pointer"
              >
                <Check />
              </div>
              <div
                onClick={handleCancel}
                className="active:bg-red-400 bg-red-500 text-white p-2 rounded-full cursor-pointer"
              >
                <X />
              </div>
            </div>
          ) : (
            <>
              <div
                onClick={() => setIsEditing(true)}
                className="active:bg-blue-400 bg-blue-500 text-white p-2 rounded-full cursor-pointer"
              >
                <Edit />
              </div>
              {chapter.status === "active" ? (
                <div
                  onClick={handleLock}
                  className="active:bg-pink-400 bg-pink-500 text-white p-2 rounded-full cursor-pointer"
                >
                  <Lock />
                </div>
              ) : (
                <div
                  onClick={handleActivate}
                  className="active:bg-lime-400 bg-lime-500 text-white p-2 rounded-full cursor-pointer"
                >
                  <ShieldCheck />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Avatar */}
        <div className="col-span-12 md:col-span-2 md:row-span-2 flex items-center justify-center">
          <div className="relative w-fit flex flex-col justify-center items-center gap-2">
            <img
              src={avatarPreview}
              alt="Avatar"
              className="min-h-36 border-gray-400 border min-w-36 max-w-36 aspect-square rounded-full object-cover"
            />
            <div
              className={`absolute top-0 left-0 shadow-lg rounded-full w-fit gap-2 font-semibold flex items-center justify-center p-2 text-sm ${
                STATUS_MAP[chapter.status]?.color
              }`}
            >
              {STATUS_MAP[chapter.status]?.icon}
            </div>

            {isEditing && (
              <label
                htmlFor="avatar-upload"
                className="p-2 w-fit rounded-full bg-blue-800 text-white absolute bottom-0 right-0 shadow-lg border-gray-200 border cursor-pointer active:bg-blue-700 transition-all"
              >
                <Camera size={18} />
              </label>
            )}

            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Inputs */}
        <CustomInput
          label="Tên chi đoàn"
          className="col-span-12 md:col-span-4"
          readOnly={!isEditing}
          name="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />
        <CustomInput
          label="Đoàn trực thuộc"
          className="col-span-12 md:col-span-4"
          readOnly={!isEditing}
          name="affiliated"
          value={form.affiliated}
          onChange={handleChange}
          error={errors.affiliated}
        />
        <CustomInput
          label="Ngày thành lập"
          className="col-span-12 md:col-span-2"
          type="date"
          readOnly={!isEditing}
          name="establishedAt"
          value={toDateInputValue(form.establishedAt)}
          onChange={handleChange}
          error={errors.establishedAt}
        />
        <CustomInput
          label="Địa chỉ"
          className="col-span-12 md:col-span-10"
          readOnly={!isEditing}
          name="address"
          value={form.address}
          onChange={handleChange}
          error={errors.address}
        />
        <CustomInput
          label="Tên đăng nhập"
          className="col-span-12 md:col-span-4"
          readOnly={!isEditing}
          name="username"
          value={form.username}
          onChange={handleChange}
          error={errors.username}
        />
        <CustomInput
          label="Email"
          className="col-span-12 md:col-span-6"
          readOnly={!isEditing}
          name="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <CustomInput
          label="Số điện thoại"
          className="col-span-12 md:col-span-2"
          readOnly={!isEditing}
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          error={errors.phoneNumber}
        />
      </div>
    </div>
  );
}

export default ChapterInfoSection;

import React, { useState } from "react";
import CustomInput from "../shared/CustomInput";
import { defAvatar } from "../../../core/assets/images";
import { Camera, Circle, Eye, EyeClosed, LoaderCircle, Plus } from "lucide-react";
import { toDateInputValue } from "../../../utils/date";

function ChapterCreateForm({ onSubmit }) {
  const [form, setForm] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(form.avatar);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // Submit form
  const handleSubmit = async () => {
    const fd = new FormData();
    Object.keys(form).forEach((k) => fd.append(k, form[k]));
    if (avatarFile) fd.append("avatar", avatarFile);

    setIsLoading(true);
    try {
      const res = await onSubmit(fd);
      console.log("🔹 Form submitted:", res);
    } catch (err) {
      console.error("❌ Submit error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold text-2xl">Thông tin chi đoàn</h2>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 flex items-center justify-center ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <LoaderCircle className="animate-spin"/>
          ) : (
            <Plus />
          )}
        </button>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Avatar */}
        <div className="col-span-12 md:col-span-2 md:row-span-2 flex justify-center">
          <div className="relative">
            <img
              src={avatarPreview || defAvatar}
              alt="Avatar"
              className="w-36 h-36 rounded-full border object-cover"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-blue-700 p-2 rounded-full text-white cursor-pointer"
            >
              <Camera size={18} />
            </label>
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
          name="name"
          className="col-span-12 md:col-span-4"
          value={form.name || ""}
          onChange={handleChange}
        />
        <CustomInput
          label="Đoàn trực thuộc"
          name="affiliated"
          className="col-span-12 md:col-span-4"
          value={form.affiliated || ""}
          onChange={handleChange}
        />
        <CustomInput
          label="Ngày thành lập"
          name="establishedAt"
          type="date"
          className="col-span-12 md:col-span-2"
          value={toDateInputValue(form.establishedAt)}
          onChange={handleChange}
        />
        <CustomInput
          label="Địa chỉ"
          name="address"
          className="col-span-12 md:col-span-10"
          value={form.address || ""}
          onChange={handleChange}
        />
        <CustomInput
          label="Tên đăng nhập"
          name="username"
          className="col-span-12 md:col-span-3"
          value={form.username || ""}
          onChange={handleChange}
        />
        <CustomInput
          label="Email"
          name="email"
          className="col-span-12 md:col-span-4"
          value={form.email || ""}
          onChange={handleChange}
        />
        <CustomInput
          label="Số điện thoại"
          name="phoneNumber"
          className="col-span-12 md:col-span-2"
          value={form.phoneNumber || ""}
          onChange={handleChange}
        />
        <CustomInput
          label="Mật khẩu"
          name="password"
          type={showPassword ? "text" : "password"}
          className="col-span-12 md:col-span-3"
          value={form.password || ""}
          onChange={handleChange}
          afterIcon={
            showPassword ? (
              <Eye onClick={() => setShowPassword(false)} className="cursor-pointer" />
            ) : (
              <EyeClosed onClick={() => setShowPassword(true)} className="cursor-pointer" />
            )
          }
        />
      </div>
    </div>
  );
}

export default ChapterCreateForm;

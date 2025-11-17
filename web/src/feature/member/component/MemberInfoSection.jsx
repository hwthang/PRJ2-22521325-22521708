import React, { useState } from "react";
import { defAvatar } from "../../../core/assets/images";
import {
  Camera,
  Check,
  Circle,
  Edit,
  Eye,
  EyeClosed,
  LoaderCircle,
  Lock,
  Plus,
  ShieldCheck,
  X,
} from "lucide-react";
import { toDateInputValue } from "../../../utils/date";
import CustomInput from "../../chapter/shared/CustomInput";

function MemberInfoSection({ onSubmit }) {
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
        <h2 className="font-semibold text-2xl">Thông tin đoàn viên</h2>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 flex items-center justify-center ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? <LoaderCircle className="animate-spin" /> : <Plus />}
        </button>
      </div>
        <div className="flex gap-4">
          {isEditing ? (
            <div className="flex gap-4">
              <div
                // onClick={handleConfirm}
                className="active:bg-green-400 bg-green-500 text-white p-2 rounded-full cursor-pointer"
              >
                <Check />
              </div>
              <div
                // onClick={handleCancel}
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
              {1 ? (
                <div
                  // onClick={handleLock}
                  className="active:bg-pink-400 bg-pink-500 text-white p-2 rounded-full cursor-pointer"
                >
                  <Lock />
                </div>
              ) : (
                <div
                  // onClick={handleActivate}
                  className="active:bg-lime-400 bg-lime-500 text-white p-2 rounded-full cursor-pointer"
                >
                  <ShieldCheck />
                </div>
              )}
            </>
          )}
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
        <CustomInput
          label="Tên đăng nhập"
          name="username"
          className="col-span-12 md:col-span-2"
          value={form.username || ""}
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
              <Eye
                onClick={() => setShowPassword(false)}
                className="cursor-pointer"
              />
            ) : (
              <EyeClosed
                onClick={() => setShowPassword(true)}
                className="cursor-pointer"
              />
            )
          }
        />
        <CustomInput
          label="Email"
          name="email"
          className="col-span-12 md:col-span-5"
          value={form.email || ""}
          onChange={handleChange}
        />
        
        
        <CustomInput
          label="Họ và tên"
          name="fullName"
          className="col-span-12 md:col-span-4"
          value={form.fullName || ""}
          onChange={handleChange}
        />

        <CustomInput
          label="Giới tính"
          name="gender"
          className="col-span-12 md:col-span-2"
          value={form.gender || ""}
          onChange={handleChange}
        />

        <CustomInput
          label="Ngày sinh"
          name="dateOfBirth"
          type="date"
          className="col-span-12 md:col-span-2"
          value={form.dateOfBirth || ""}
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
          label="Quê quán"
          name="hometown"
          className="col-span-12 md:col-span-6"
          value={form.hometown || ""}
          onChange={handleChange}
        />

        <CustomInput
          label="Địa chỉ"
          name="address"
          className="col-span-12 md:col-span-6"
          value={form.address || ""}
          onChange={handleChange}
        />

        <CustomInput
          label="Dân tộc"
          name="ethnicity"
          className="col-span-12 md:col-span-2"
          value={form.ethnicity || ""}
          onChange={handleChange}
        />

        <CustomInput
          label="Tôn giáo"
          name="religion"
          className="col-span-12 md:col-span-2"
          value={form.religion || ""}
          onChange={handleChange}
        />

        <CustomInput
          label="Trình độ học vấn"
          name="education"
          className="col-span-12 md:col-span-4"
          value={form.education || ""}
          onChange={handleChange}
        />

        <CustomInput
          label="Chuyên môn / Bằng cấp"
          name="qualification"
          className="col-span-12 md:col-span-4"
          value={form.qualification || ""}
          onChange={handleChange}
        />

        <CustomInput
          label="Lý luận chính trị"
          name="politicalTheory"
          className="col-span-12 md:col-span-4"
          value={form.politicalTheory || ""}
          onChange={handleChange}
        />

        <CustomInput
          label="Mã đoàn viên"
          name="memberCode"
          className="col-span-12 md:col-span-2"
          value={form.memberCode || ""}
          onChange={handleChange}
        />

        <CustomInput
          label="Ngày vào đoàn"
          name="joinedAt"
          type="date"
          className="col-span-12 md:col-span-2"
          value={form.joinedAt || ""}
          onChange={handleChange}
        />

        <CustomInput
          label="Chức vụ"
          name="position"
          className="col-span-12 md:col-span-4"
          value={form.position || ""}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default MemberInfoSection;

import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { FaChevronLeft } from "react-icons/fa6";
import { GENDER } from "../../../utils/map";
import AuthService from "../services/AuthService";
import useForm from "../../../core/hooks/useForm";
import ChapterService from "../../chapter/services/ChapterService";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const account = useForm();
  const profile = useForm();

  // Validation rules
  const validationRules = {
    username: {
      required: true,
      minLength: 3,
      maxLength: 20,
      pattern: /^[a-zA-Z0-9_]+$/,
      message: "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới",
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Email không hợp lệ",
    },
    phone: {
      required: true,
      pattern: /^(0|\+84)[3|5|7|8|9][0-9]{8}$/,
      message: "Số điện thoại không hợp lệ",
    },
    password: {
      required: true,
      minLength: 6,
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    },
    fullname: {
      required: true,
      minLength: 2,
      message: "Họ và tên phải có ít nhất 2 ký tự",
    },
    gender: {
      required: true,
    },
    birthdate: {
      required: true,
      validate: (value) => {
        const birthDate = new Date(value);
        const today = new Date();
        const minDate = new Date();
        minDate.setFullYear(today.getFullYear() - 100);

        return birthDate <= today && birthDate >= minDate;
      },
      message: "Ngày sinh không hợp lệ",
    },
    cardCode: {
      required: true,
      pattern: /^[A-Za-z0-9]+$/,
      message: "Số thẻ đoàn không hợp lệ",
    },
    joinedDate: {
      required: true,
      validate: (value) => {
        const joinedDate = new Date(value);
        const today = new Date();
        return joinedDate <= today;
      },
      message: "Ngày tham gia không thể ở tương lai",
    },
    chapter: {
      required: true,
    },
  };

  // Validate form function
  const validateForm = (formData, fieldsToValidate) => {
    const newErrors = {};

    fieldsToValidate.forEach((field) => {
      const value = formData[field] || "";
      const rules = validationRules[field];

      if (!rules) return;

      if (rules.required && !value.trim()) {
        newErrors[field] = "Trường này là bắt buộc";
        return;
      }

      if (rules.minLength && value.length < rules.minLength) {
        newErrors[field] = `Phải có ít nhất ${rules.minLength} ký tự`;
        return;
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        newErrors[field] = `Không được vượt quá ${rules.maxLength} ký tự`;
        return;
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        newErrors[field] = rules.message;
        return;
      }

      if (rules.validate && !rules.validate(value)) {
        newErrors[field] = rules.message;
        return;
      }
    });

    return newErrors;
  };

  // Validate step 1
  const validateStep1 = () => {
    const step1Fields = ["username", "email", "phone", "password"];
    const step1Errors = validateForm(account.form, step1Fields);
    setErrors(step1Errors);
    return Object.keys(step1Errors).length === 0;
  };

  // Validate step 2
  const validateStep2 = () => {
    const step2Fields = [
      "fullname",
      "gender",
      "birthdate",
      "cardCode",
      "joinedDate",
      "chapter",
    ];
    const step2Errors = validateForm(profile.form, step2Fields);
    setErrors(step2Errors);
    return Object.keys(step2Errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
    setErrors({});
  };

  const handleRegister = async () => {
    if (!validateStep2()) {
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await AuthService.register(account.form, profile.form);
      if (result.success) {
        toast.success(result.message);
        navigate("..");
        return;
      }
      toast.error(result.message);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đăng ký");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Real-time validation for specific fields
  const handleFieldChange = (
    form,
    field,
    value,
    immediateValidation = false
  ) => {
    form.handleChangeFieldInForm(field, value);

    if (immediateValidation && validationRules[field]) {
      const fieldError = validateForm({ [field]: value }, [field]);
      setErrors((prev) => ({
        ...prev,
        [field]: fieldError[field],
      }));
    }
  };

  // Input formatting functions
  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    let cleaned = value.replace(/\D/g, "");

    // Format Vietnamese phone numbers
    if (cleaned.startsWith("84")) {
      cleaned = "0" + cleaned.slice(2);
    } else if (cleaned.startsWith("+84")) {
      cleaned = "0" + cleaned.slice(3);
    }

    return cleaned;
  };

  const formatName = (value) => {
    // Capitalize first letter of each word
    return value.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  const formatUsername = (value) => {
    // Remove spaces and special characters, convert to lowercase
    return value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
  };

  const fetchChapters = async () => {
    try {
      const result = await ChapterService.getChapters();
      setChapters(
        result.data.map((item) => ({
          value: item._id,
          label: `${item.name}, ${item.affiliated}`,
        }))
      );
    } catch (error) {
      toast.error("Không thể tải danh sách chi đoàn");
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  return (
    <div className="grid grid-cols-6 shadow-[0_0_10px_#c9c9c9] h-full w-full rounded-lg p-8 gap-4">
      {/* STEP 1 */}
      {step === 1 && (
        <>
          <div className="relative flex col-span-6 gap-1 items-center text-blue-900 font-bold">
            <p className="text-2xl pb-1">Đăng ký tài khoản</p>
          </div>

          {/* Username */}
          <div className="relative flex flex-col col-span-6 gap-1">
            <p className="font-medium text-blue-900">Tên đăng nhập</p>
            <input
              className={`outline-none border-2 h-10 px-2 rounded-lg ${
                errors.username
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
              value={account.form?.username || ""}
              onChange={(e) =>
                handleFieldChange(
                  account,
                  "username",
                  formatUsername(e.target.value),
                  true
                )
              }
              maxLength={20}
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div className="relative flex flex-col col-span-6 gap-1">
            <p className="font-medium text-blue-900">Email</p>
            <input
              className={`outline-none border-2 h-10 px-2 rounded-lg ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
              value={account.form?.email || ""}
              onChange={(e) =>
                handleFieldChange(account, "email", e.target.value, true)
              }
              type="email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="relative flex flex-col col-span-6 gap-1">
            <p className="font-medium text-blue-900">Số điện thoại</p>
            <input
              className={`outline-none border-2 h-10 px-2 rounded-lg ${
                errors.phone
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
              value={account.form?.phone || ""}
              onChange={(e) =>
                handleFieldChange(
                  account,
                  "phone",
                  formatPhoneNumber(e.target.value),
                  true
                )
              }
              maxLength={11}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative flex flex-col gap-1 w-full col-span-6">
            <p className="font-medium text-blue-900">Mật khẩu</p>
            <div className="relative">
              <input
                className={`outline-none border-2 h-10 px-2 pr-12 w-full rounded-lg ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                type={showPassword ? "text" : "password"}
                value={account.form?.password || ""}
                onChange={(e) =>
                  handleFieldChange(account, "password", e.target.value, true)
                }
                minLength={6}
              />
              <div className="h-10 absolute bottom-0 right-0 w-10 flex items-center justify-center text-blue-900">
                {showPassword ? (
                  <IoEyeOffOutline
                    size={26}
                    onClick={() => setShowPassword(false)}
                    className="cursor-pointer"
                  />
                ) : (
                  <IoEyeOutline
                    size={26}
                    onClick={() => setShowPassword(true)}
                    className="cursor-pointer"
                  />
                )}
              </div>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <button
            className="h-10 mt-2 col-span-6 bg-blue-600 hover:bg-blue-500 active:bg-blue-400 text-white font-semibold rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleNextStep}
            disabled={isSubmitting}
          >
            Tiếp tục
          </button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <div
            className="relative flex col-span-6 gap-1 items-center text-blue-900 font-bold cursor-pointer"
            onClick={handlePreviousStep}
          >
            <FaChevronLeft size={22} />
            <p className="text-2xl pb-1">Thông tin cá nhân</p>
          </div>

          {/* Fullname */}
          <div className="relative flex flex-col col-span-6 gap-1">
            <p className="font-medium text-blue-900">Họ và tên</p>
            <input
              className={`outline-none border-2 h-10 px-2 rounded-lg ${
                errors.fullname
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
              value={profile.form?.fullname || ""}
              onChange={(e) =>
                handleFieldChange(
                  profile,
                  "fullname",
                  formatName(e.target.value),
                  true
                )
              }
            />
            {errors.fullname && (
              <p className="text-red-500 text-sm">{errors.fullname}</p>
            )}
          </div>

          {/* Gender */}
          <div className="relative flex flex-col col-span-6 md:col-span-3 gap-1">
            <p className="font-medium text-blue-900">Giới tính</p>
            <div className="grid grid-cols-2 gap-1 bg-gray-200 h-10 overflow-hidden rounded-lg">
              {GENDER.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`py-2 rounded-lg ${
                    profile.form?.gender === item.value
                      ? "bg-blue-500 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-300"
                  } ${errors.gender ? "border border-red-500" : ""}`}
                  onClick={() =>
                    handleFieldChange(profile, "gender", item.value, true)
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender}</p>
            )}
          </div>

          {/* Birthdate */}
          <div className="relative flex flex-col md:col-span-3 gap-1 col-span-6">
            <p className="font-medium text-blue-900">Ngày sinh</p>
            <input
              type="date"
              className={`outline-none border-2 h-10 px-2 rounded-lg ${
                errors.birthdate
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
              value={profile.form?.birthdate || ""}
              onChange={(e) =>
                handleFieldChange(profile, "birthdate", e.target.value, true)
              }
              max={new Date().toISOString().split("T")[0]}
            />
            {errors.birthdate && (
              <p className="text-red-500 text-sm">{errors.birthdate}</p>
            )}
          </div>

          {/* Address */}
          <div className="relative flex flex-col col-span-6 gap-1">
            <p className="font-medium text-blue-900">Địa chỉ</p>
            <textarea
              className="outline-none border-2 border-gray-300 focus:border-blue-500 h-20 resize-none px-2 rounded-lg"
              value={profile.form?.address || ""}
              onChange={(e) =>
                handleFieldChange(profile, "address", e.target.value)
              }
              maxLength={200}
            ></textarea>
          </div>

          {/* Card Code */}
          <div className="relative flex flex-col md:col-span-3 gap-1 col-span-6">
            <p className="font-medium text-blue-900">Số thẻ đoàn</p>
            <input
              className={`outline-none border-2 h-10 px-2 rounded-lg ${
                errors.cardCode
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
              value={profile.form?.cardCode || ""}
              onChange={(e) =>
                handleFieldChange(
                  profile,
                  "cardCode",
                  e.target.value.toUpperCase(),
                  true
                )
              }
            />
            {errors.cardCode && (
              <p className="text-red-500 text-sm">{errors.cardCode}</p>
            )}
          </div>

          {/* Joined Date */}
          <div className="relative flex flex-col md:col-span-3 gap-1 col-span-6">
            <p className="font-medium text-blue-900">Ngày tham gia</p>
            <input
              type="date"
              className={`outline-none border-2 h-10 px-2 rounded-lg ${
                errors.joinedDate
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
              value={profile.form?.joinedDate || ""}
              onChange={(e) =>
                handleFieldChange(profile, "joinedDate", e.target.value, true)
              }
              max={new Date().toISOString().split("T")[0]}
            />
            {errors.joinedDate && (
              <p className="text-red-500 text-sm">{errors.joinedDate}</p>
            )}
          </div>

          {/* Chapter */}
          <div className="relative flex flex-col col-span-6 gap-1">
            <p className="font-medium text-blue-900">Chi đoàn</p>
            <select
              className={`outline-none border-2 h-10 px-2 rounded-lg ${
                errors.chapter
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
              value={profile.form?.chapter || ""}
              onChange={(e) =>
                handleFieldChange(profile, "chapter", e.target.value, true)
              }
            >
              <option value="" disabled>
                Chọn chi đoàn
              </option>
              {chapters.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            {errors.chapter && (
              <p className="text-red-500 text-sm">{errors.chapter}</p>
            )}
          </div>

          <button
            className="h-10 mt-2 col-span-6 bg-blue-600 hover:bg-blue-500 active:bg-blue-400 text-white font-semibold flex justify-center items-center rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleRegister}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <AiOutlineLoading3Quarters
                className="animate-spin text-white"
                size={20}
              />
            ) : (
              "Đăng ký"
            )}
          </button>
        </>
      )}

      {/* Đã có tài khoản */}
      <div className="col-span-6 flex flex-col items-center justify-center gap-1">
        <p>Bạn đã có tài khoản?</p>
        <NavLink
          to="../"
          className="text-blue-900 hover:underline active:text-blue-700 font-semibold"
        >
          Đăng nhập
        </NavLink>
      </div>
    </div>
  );
}

export default RegisterForm;
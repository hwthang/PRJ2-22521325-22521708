import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { FaChevronLeft } from "react-icons/fa6";
import { GENDER } from "../../../utils/map";
import AuthService from "../services/AuthService";
import useForm from "../../../core/hooks/useForm";
import ChapterService from "../../chapter/services/ChapterService";
import { toast } from "react-toastify";

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const account = useForm();
  const profile = useForm();

  const handleRegister = async () => {
    const result = await AuthService.register(account.form, profile.form);
    if (result.success) {
      toast.success(result.message);
      navigate("..");
      return;
    }
    toast.error(result.message);
  };

  const fetchChapters = async () => {
    const result = await ChapterService.getChapters();
    setChapters(
      result.data.map((item) => ({
        value: item._id,
        label: `${item.name}, ${item.affiliated}`,
      }))
    );
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
              className="outline-none border-2 border-gray-300 focus:border-blue-500 h-10 px-2"
              value={account.form?.username || ""}
              onChange={(e) =>
                account.handleChangeFieldInForm("username", e.target.value)
              }
            />
          </div>

          {/* Email */}
          <div className="relative flex flex-col col-span-6 gap-1">
            <p className="font-medium text-blue-900">Email</p>
            <input
              className="outline-none border-2 border-gray-300 focus:border-blue-500 h-10 px-2"
              value={account.form?.email || ""}
              onChange={(e) =>
                account.handleChangeFieldInForm("email", e.target.value)
              }
            />
          </div>

          {/* Phone */}
          <div className="relative flex flex-col col-span-6 gap-1">
            <p className="font-medium text-blue-900">Số điện thoại</p>
            <input
              className="outline-none border-2 border-gray-300 focus:border-blue-500 h-10 px-2"
              value={account.form?.phone || ""}
              onChange={(e) =>
                account.handleChangeFieldInForm("phone", e.target.value)
              }
            />
          </div>

          {/* Password */}
          <div className="relative flex flex-col gap-1 w-full col-span-6">
            <p className="font-medium text-blue-900">Mật khẩu</p>
            <input
              className="outline-none border-2 border-gray-300 focus:border-blue-500 h-10 px-2 pr-12"
              type={showPassword ? "text" : "password"}
              value={account.form?.password || ""}
              onChange={(e) =>
                account.handleChangeFieldInForm("password", e.target.value)
              }
            />
            <div className="h-10 absolute bottom-0 right-2 w-10 flex items-center justify-center text-blue-900">
              {showPassword ? (
                <IoEyeOffOutline
                  size={26}
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <IoEyeOutline size={26} onClick={() => setShowPassword(true)} />
              )}
            </div>
          </div>

          <button
            className="h-10 mt-2 col-span-6 bg-blue-600 hover:bg-blue-500 active:bg-blue-400 text-white font-semibold"
            onClick={() => setStep(2)}
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
            onClick={() => setStep(1)}
          >
            <FaChevronLeft size={22} />
            <p className="text-2xl pb-1">Thông tin cá nhân</p>
          </div>

          {/* Fullname */}
          <div className="relative flex flex-col col-span-6 gap-1">
            <p className="font-medium text-blue-900">Họ và tên</p>
            <input
              className="outline-none border-2 border-gray-300 focus:border-blue-500 h-10 px-2"
              value={profile.form?.fullname || ""}
              onChange={(e) =>
                profile.handleChangeFieldInForm("fullname", e.target.value)
              }
            />
          </div>

          {/* Gender */}
          <div className="relative flex flex-col col-span-6 md:col-span-3 gap-1">
            <p className="font-medium text-blue-900">Giới tính</p>
            <div className="grid grid-cols-2 gap-1 bg-gray-200 h-10 overflow-hidden">
              {GENDER.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`py-2 ${
                    profile.form?.gender === item.value
                      ? "bg-blue-500 text-white font-semibold"
                      : "text-gray-700"
                  }`}
                  onClick={() =>
                    profile.handleChangeFieldInForm("gender", item.value)
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Birthdate */}
          <div className="relative flex flex-col md:col-span-3 gap-1 col-span-6">
            <p className="font-medium text-blue-900">Ngày sinh</p>
            <input
              type="date"
              className="outline-none border-2 border-gray-300 focus:border-blue-500 h-10 px-2"
              value={profile.form?.birthdate || ""}
              onChange={(e) =>
                profile.handleChangeFieldInForm("birthdate", e.target.value)
              }
            />
          </div>

          {/* Address */}
          <div className="relative flex flex-col col-span-6 gap-1">
            <p className="font-medium text-blue-900">Địa chỉ</p>
            <textarea
              className="outline-none border-2 border-gray-300 focus:border-blue-500 h-20 resize-none px-2"
              value={profile.form?.address || ""}
              onChange={(e) =>
                profile.handleChangeFieldInForm("address", e.target.value)
              }
            ></textarea>
          </div>

          {/* Card Code */}
          <div className="relative flex flex-col md:col-span-3 gap-1 col-span-6">
            <p className="font-medium text-blue-900">Số thẻ đoàn</p>
            <input
              className="outline-none border-2 border-gray-300 focus:border-blue-500 h-10 px-2"
              value={profile.form?.cardCode || ""}
              onChange={(e) =>
                profile.handleChangeFieldInForm("cardCode", e.target.value)
              }
            />
          </div>

          {/* Joined Date */}
          <div className="relative flex flex-col md:col-span-3 gap-1 col-span-6">
            <p className="font-medium text-blue-900">Ngày tham gia</p>
            <input
              type="date"
              className="outline-none border-2 border-gray-300 focus:border-blue-500 h-10 px-2"
              value={profile.form?.joinedDate || ""}
              onChange={(e) =>
                profile.handleChangeFieldInForm("joinedDate", e.target.value)
              }
            />
          </div>

          {/* Chapter */}
          <div className="relative flex flex-col col-span-6 gap-1">
            <p className="font-medium text-blue-900">Chi đoàn</p>
            <select
              className="outline-none border-2 border-gray-300 focus:border-blue-500 h-10 px-2"
              value={profile.form?.chapter || ""}
              onChange={(e) =>
                profile.handleChangeFieldInForm("chapter", e.target.value)
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
          </div>

          <button
            className="h-10 mt-2 col-span-6 bg-blue-600 hover:bg-blue-500 active:bg-blue-400 text-white  font-semibold"
            onClick={handleRegister}
          >
            Đăng ký
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

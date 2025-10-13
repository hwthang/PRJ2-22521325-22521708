import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { BUTTON, INPUT_STYLE } from "../../../utils/styles";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { GENDER } from "../../../utils/map";
import AuthService from "../services/AuthService";
import useForm from "../../../core/hooks/useForm";
import { toast } from "react-toastify";

function RegisterForm() {
  const { form, handleChangeFieldInForm } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [chapters, setChapters] = useState([]);

  const handleRegister = async () => {
    await AuthService.register(form);
  };

  const fetchChapters = async () => {
    const data = await AuthService.getChapters();

    setChapters(
      data.map((item) => ({
        chapterCode: item.chapterCode,
        label: `${item.name}, ${item.affiliated}`,
      }))
    );
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  useEffect(()=>{
    console.log(chapters)
  },[chapters])

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 shadow-[0_0_10px_#c9c9c9] w-full rounded-lg p-8 gap-4">
      {/* Username */}
      <div className="relative flex flex-col md:col-span-6 gap-1">
        <p className={`${INPUT_STYLE.label}`}>Tên đăng nhập</p>
        <input
          className={`${INPUT_STYLE.input} px-2`}
          value={form?.username}
          onChange={(e) => handleChangeFieldInForm("username", e.target.value)}
        />
      </div>

      {/* Email */}
      <div className="relative flex flex-col md:col-span-6 gap-1">
        <p className={`${INPUT_STYLE.label}`}>Email</p>
        <input
          className={`${INPUT_STYLE.input} px-2`}
          value={form?.email}
          onChange={(e) => handleChangeFieldInForm("email", e.target.value)}
        />
      </div>

      {/* Phone */}
      <div className="relative flex flex-col md:col-span-6 gap-1">
        <p className={`${INPUT_STYLE.label}`}>Số điện thoại</p>
        <input
          className={`${INPUT_STYLE.input} px-2`}
          value={form?.phone}
          onChange={(e) => handleChangeFieldInForm("phone", e.target.value)}
        />
      </div>

      {/* Password */}
      <div className="relative flex flex-col gap-1 w-full md:col-span-6">
        <p className={`${INPUT_STYLE.label}`}>Mật khẩu</p>
        <input
          className={`${INPUT_STYLE.input} px-2 pr-14`}
          type={showPassword ? "text" : "password"}
          value={form?.password}
          onChange={(e) => handleChangeFieldInForm("password", e.target.value)}
        />
        <div className="h-10 absolute bottom-0 right-2 w-10 flex items-center justify-center text-blue-900">
          {showPassword ? (
            <IoEyeOffOutline size={26} onClick={() => setShowPassword(false)} />
          ) : (
            <IoEyeOutline size={26} onClick={() => setShowPassword(true)} />
          )}
        </div>
      </div>

      {/* Fullname */}
      <div className="relative flex flex-col md:col-span-6 gap-1">
        <p className={`${INPUT_STYLE.label}`}>Họ và tên</p>
        <input
          className={`${INPUT_STYLE.input} px-2`}
          value={form?.fullname}
          onChange={(e) => handleChangeFieldInForm("fullname", e.target.value)}
        />
      </div>

      {/* Gender */}
      <div className="relative flex flex-col md:col-span-3 gap-1 ">
        <p className={`${INPUT_STYLE.label}`}>Giới tính</p>
        <div
          className={`${INPUT_STYLE.input} grid grid-cols-2 w-full bg-gray-200 border-none`}
        >
          {GENDER.map((item) => (
            <button
              key={item.value}
              className={`${
                form?.gender == item.value &&
                "bg-blue-500 text-white font-semibold rounded-sm"
              }`}
              onClick={() => handleChangeFieldInForm("gender", item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Birthdate */}
      <div className="relative flex flex-col md:col-span-3 gap-1">
        <p className={`${INPUT_STYLE.label}`}>Ngày sinh</p>
        <input
          type="date"
          className={`${INPUT_STYLE.input} px-2`}
          value={form?.birthdate}
          onChange={(e) => handleChangeFieldInForm("birthdate", e.target.value)}
        />
      </div>

      {/* Address */}
      <div className="relative flex flex-col md:col-span-6 gap-1">
        <p className={`${INPUT_STYLE.label}`}>Địa chỉ</p>
        <input
          className={`${INPUT_STYLE.input} px-2`}
          value={form?.address}
          onChange={(e) => handleChangeFieldInForm("address", e.target.value)}
        />
      </div>

      {/* Card code */}
      <div className="relative flex flex-col md:col-span-3 gap-1">
        <p className={`${INPUT_STYLE.label}`}>Mã thẻ</p>
        <input
          className={`${INPUT_STYLE.input} px-2`}
          value={form?.cardCode}
          onChange={(e) => handleChangeFieldInForm("cardCode", e.target.value)}
        />
      </div>

      {/* Joined date */}
      <div className="relative flex flex-col md:col-span-3 gap-1">
        <p className={`${INPUT_STYLE.label}`}>Ngày tham gia</p>
        <input
          type="date"
          className={`${INPUT_STYLE.input} px-2`}
          value={form?.joinedDate}
          onChange={(e) =>
            handleChangeFieldInForm("joinedDate", e.target.value)
          }
        />
      </div>

      {/* Chapter code */}
      <div className="relative flex flex-col md:col-span-6 gap-1">
        <p className={`${INPUT_STYLE.label}`}>Chi đoàn</p>
        
        <select
          className={`${INPUT_STYLE.input} px-2`}
          value={form?.chapterCode}
          onChange={(e) =>
            handleChangeFieldInForm("chapterCode", e.target.value)
          }
        >
          <option>Chọn chi đoàn </option>
        {chapters?.map(item=>(<option key={item.chapterCode} value={item.chapterCode}>{item.label}</option>))}
        </select>
      </div>

      <button
        className={`${BUTTON} h-12 md:col-span-6 bg-blue-600 active:bg-blue-500 text-white`}
        onClick={handleRegister}
      >
        Đăng ký
      </button>

      <div className="md:col-span-6 flex flex-col items-center justify-center gap-1">
        Bạn đã có tài khoản?
        <NavLink
          to={"../"}
          className={`text-blue-900 active:text-blue-700 active:underline font-semibold`}
        >
          Đăng nhập
        </NavLink>
      </div>
    </div>
  );
}

export default RegisterForm;

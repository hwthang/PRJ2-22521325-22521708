import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { BUTTON, INPUT_STYLE } from "../../../utils/styles";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import AuthService from "../services/AuthService";
import useForm from "../../../core/hooks/useForm";

function LoginForm() {
  const { form, handleChangeFieldInForm } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    await AuthService.login(form);
  };

  return (
    <div className="grid grid-cols-6 shadow-[0_0_10px_#c9c9c9] w-full rounded-lg gap-4 p-8">
      <div className="relative flex flex-col col-span-7 gap-1">
        <p className={`${INPUT_STYLE.label}`}>Tài khoản</p>
        <input
          className={`${INPUT_STYLE.input} px-2`}
          value={form?.account}
          onChange={(e) => handleChangeFieldInForm("account", e.target.value)}
        />
      </div>
      <div className="relative flex flex-col gap-1 w-full col-span-7">
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
      </div>{" "}
      <NavLink
        className={`text-nowrap col-start-5 font-semibold col-span-3 flex items-center justify-end text-blue-900 active:text-blue-700 active:underline`}
      >
        Quên mật khẩu
      </NavLink>
      <button
        className={`${BUTTON} h-12 col-span-7 bg-blue-600 active:bg-blue-500 text-white`}
        onClick={handleLogin}
      >
        Đăng nhập
      </button>
      <div className="col-span-7 flex flex-col items-center justify-center gap-1">
        Bạn chưa có tài khoản
        <NavLink
          to={"register"}
          className={`text-blue-900 active:text-blue-700 active:underline font-semibold`}
        >
          Đăng ký ngay
        </NavLink>
      </div>
    </div>
  );
}

export default LoginForm;

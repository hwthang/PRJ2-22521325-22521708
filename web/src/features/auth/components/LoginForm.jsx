import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import AuthService from "../services/AuthService";
import useForm from "../../../core/hooks/useForm";
import { toast } from "react-toastify";

function LoginForm() {
  const { form, handleChangeFieldInForm } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const result = await AuthService.login(form.key, form.password);
    if (result.success) {
      toast.success(result.message);
      navigate(`cds`, { state: result.data.role });
      return;
    }

    toast.error(result.message);
    return;
  };

  return (
    <div className="grid grid-cols-6 shadow-[0_0_10px_#c9c9c9] w-full rounded-lg gap-4 p-8 auto-rows-10">
      <div className="relative flex flex-col col-span-6 gap-1">
        <p className="font-medium text-blue-900">Tài khoản</p>
        <input
          className="outline-none border-2 border-gray-300 focus:border-blue-500 h-10 px-2"
          placeholder="Nhập tên người dùng, email, hoặc số điện thoại"
          value={form?.key}
          onChange={(e) => handleChangeFieldInForm("key", e.target.value)}
        />
      </div>

      <div className="relative flex flex-col gap-1 w-full col-span-6">
        <p className="font-medium text-blue-900">Mật khẩu</p>
        <input
          type={showPassword ? "text" : "password"}
           className="outline-none border-2 border-gray-300 focus:border-blue-500 h-10 px-2 pr-12"
          value={form?.password}
          placeholder="Nhập mật khẩu"
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

      <NavLink
        className="text-nowrap col-start-4 font-semibold col-span-3 flex items-center justify-end text-blue-900 active:text-blue-700 active:underline"
      >
        Quên mật khẩu
      </NavLink>

      <button
        className="h-10 col-span-6 bg-blue-600 active:bg-blue-500 text-white font-semibold"
        onClick={handleLogin}
      >
        Đăng nhập
      </button>

      <div className="col-span-6 flex flex-col items-center justify-center gap-1">
        Bạn chưa có tài khoản
        <NavLink
          to={"register"}
          className="text-blue-900 active:text-blue-700 active:underline font-semibold"
        >
          Đăng ký ngay
        </NavLink>
      </div>
    </div>
  );
}

export default LoginForm;

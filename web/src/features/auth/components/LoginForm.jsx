import React, { useState } from "react";

import BasicInput from "../../../core/components/Input/BasicInput";
import PasswordInput from "../../../core/components/Input/PasswordInput";
import { Link } from "react-router-dom";
import { useForm } from "../hooks/useForm";

function LoginForm() {
  const loginForm = {
    account: "",
    password: "",
  };

  const { form, resetForm, handleChange } = useForm(loginForm);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(form);
    resetForm();
  };
  return (
    <form
      onSubmit={handleLogin}
      className="min-h-20 w-full rounded-lg w-fit bg-white shadow-[0px_0px_12px_#c9c9c9] px-8 py-10 flex flex-col gap-10"
    >
      <div className="flex flex-col gap-10">
        <BasicInput
          label={"Tài khoản"}
          name={"account"}
          value={form.account}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        <PasswordInput
          label={"Mật khẩu"}
          name={"password"}
          value={form.password}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <Link
            to={"forgot-password"}
            className="text-blue-600 font-medium active:underline"
          >
            Quên mật khẩu ?
          </Link>
        </div>
        <button className="border w-full h-12 rounded-lg font-medium text-white bg-blue-600 active:opacity-90 cursor-pointer">
          Đăng nhập
        </button>
        <div className="flex justify-center flex-col md:flex-row items-center gap-1">
          Bạn chưa có tài khoản{" "}
          <Link
            to={"register"}
            className="text-blue-600 font-medium active:underline"
          >
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </form>
  );
}

export default LoginForm;

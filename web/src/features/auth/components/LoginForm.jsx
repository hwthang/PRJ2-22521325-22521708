import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import AuthService from "../services/AuthService";
import useForm from "../../../core/hooks/useForm";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function LoginForm() {
  const { form, handleChangeFieldInForm } = useForm({
    key: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Validation rules
  const validationRules = {
    key: {
      required: true,
      minLength: 3,
      message: "Tài khoản phải có ít nhất 3 ký tự"
    },
    password: {
      required: true,
      minLength: 6,
      message: "Mật khẩu phải có ít nhất 6 ký tự"
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Validate key field
    if (!form.key?.trim()) {
      newErrors.key = "Vui lòng nhập tài khoản";
    } else if (form.key.length < 3) {
      newErrors.key = validationRules.key.message;
    }
    
    // Validate password field
    if (!form.password?.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (form.password.length < 6) {
      newErrors.password = validationRules.password.message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change with validation
  const handleInputChange = (field, value) => {
    handleChangeFieldInForm(field, value);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  // Handle login
  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await AuthService.login(form.key, form.password);
      
      if (result?.success) {
        toast.success(result.message);
        navigate(`cds`, { state: result.data.role });
      } else {
        toast.error(result?.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đăng nhập");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin();
    }
  };

  return (
    <div className="grid grid-cols-6 shadow-[0_0_10px_#c9c9c9] w-full rounded-lg gap-4 p-8 auto-rows-10">
      {/* --- Username / Email --- */}
      <div className="relative flex flex-col col-span-6 gap-1">
        <p className="font-medium text-blue-900">Tài khoản</p>
        <input
          className={`outline-none border-2 h-10 px-2 rounded-lg ${
            errors.key ? "border-red-500" : "border-gray-300 focus:border-blue-500"
          }`}
          placeholder="Nhập tên người dùng, email, hoặc số điện thoại"
          value={form.key}
          onChange={(e) => handleInputChange("key", e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        {errors.key && (
          <p className="text-red-500 text-sm mt-1">{errors.key}</p>
        )}
      </div>

      {/* --- Password --- */}
      <div className="relative flex flex-col gap-1 w-full col-span-6">
        <p className="font-medium text-blue-900">Mật khẩu</p>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className={`outline-none border-2 h-10 px-2 pr-12 w-full rounded-lg ${
              errors.password
                ? "border-red-500"
                : "border-gray-300 focus:border-blue-500"
            }`}
            value={form.password}
            placeholder="Nhập mật khẩu"
            onChange={(e) => handleInputChange("password", e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <div className="h-10 absolute bottom-0 right-0 w-10 flex items-center justify-center text-blue-900 cursor-pointer">
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
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      {/* Forgot password link */}
      <NavLink 
        className="text-nowrap col-start-4 font-semibold col-span-3 flex items-center justify-end text-blue-900 hover:underline active:text-blue-700"
        to="/forgot-password"
      >
        Quên mật khẩu
      </NavLink>

      {/* --- Submit Button --- */}
      <button
        className="h-10 col-span-6 bg-blue-600 hover:bg-blue-500 active:bg-blue-400 text-white font-semibold flex justify-center items-center rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
        onClick={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <AiOutlineLoading3Quarters
            className="animate-spin text-white"
            size={20}
          />
        ) : (
          "Đăng nhập"
        )}
      </button>

      {/* --- Register Link --- */}
      <div className="col-span-6 flex flex-col items-center justify-center gap-1">
        <p>Bạn chưa có tài khoản?</p>
        <NavLink
          to={"register"}
          className="text-blue-900 hover:underline active:text-blue-700 font-semibold"
        >
          Đăng ký ngay
        </NavLink>
      </div>
    </div>
  );
}

export default LoginForm;
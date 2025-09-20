import React, { useEffect, useState } from "react";

import BasicInput from "../../../core/components/Input/BasicInput";
import PasswordInput from "../../../core/components/Input/PasswordInput";
import { Link } from "react-router-dom";
import { useForm } from "../hooks/useForm";
import { FaChevronLeft } from "react-icons/fa6";
import { getToday } from "../../../utils/date";
import ToggleInput from "../../../core/components/Input/ToggleInput";
import SelectInput from "../../../core/components/Input/SelectInput";
import AddressInput from "../../../core/components/Input/AddressInput";

function RegisterForm() {
  const registerForm = {
    username: "",
    email: "",
    phone: "",
    password: "",
    rePassword: "",

    fullname: "",
    birthdate: getToday(),
    gender: "male",
    address: {
      province: "",
      commune: "",
      details: "",
    },

    cardCode: "",
    joinedDate: getToday(),
    chapter: "",
  };

  const { form, resetForm, handleChange } = useForm(registerForm);
  const maxStep = 2;
  const [step, setStep] = useState(0);
  useEffect(() => {
    console.log(form);
  }, [form]);

  const prevStep = () => setStep(Math.max(step - 1, 0));
  const nextStep = () => setStep(Math.min(step + 1, maxStep));
  const stepLabels = [
    <div className="border text-2xl md:text-3xl text-blue-600 font-bold inline-block align-middle">
      <p className="pb-1"> Đăng ký tài khoản</p>
    </div>,
    <div
      onClick={prevStep}
      className="active:opacity-90 cursor-pointer border flex items-center text-2xl md:text-3xl text-blue-600 font-bold gap-1"
    >
      <FaChevronLeft size={30} />
      <p className="pb-1">Thông tin cá nhân</p>
    </div>,
    <div
      onClick={prevStep}
      className="active:opacity-90 cursor-pointer border flex items-center text-2xl md:text-3xl text-blue-600 font-bold gap-1"
    >
      <FaChevronLeft size={30} />
      <p className="pb-1">Thông tin đoàn viên</p>
    </div>,
  ];
  const handleRegister = (e) => {
    e.preventDefault();
    console.log(form);
  };
  return (
    <form
      onSubmit={handleRegister}
      className="min-h-20 w-full rounded-lg w-fit bg-white shadow-[0px_0px_12px_#c9c9c9] px-8 py-10 flex flex-col gap-10"
    >
      {stepLabels[step]}
      <div className="flex flex-col gap-8 border">
        {step == 0 && (
          <>
            <BasicInput
              label={"Tên người dùng"}
              name={"username"}
              value={form.username}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
            <BasicInput
              label={"Email"}
              name={"email"}
              value={form.email}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
            <BasicInput
              label={"Số điện thoại"}
              name={"phone"}
              value={form.phone}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
            <PasswordInput
              label={"Mật khẩu"}
              name={"password"}
              value={form.password}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
            <PasswordInput
              label={"Nhập lại Mật khẩu"}
              name={"rePassword"}
              value={form.rePassword}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </>
        )}
        {step == 1 && (
          <>
            <BasicInput
              label={"Họ và tên"}
              name={"fullname"}
              value={form.fullname}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
            <div className="flex flex-col md:flex-row md:gap-8 gap-6 w-full border">
              <BasicInput
                label={"Ngày sinh"}
                name={"birthdate"}
                type="date"
                value={form.birthdate}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
              <ToggleInput
                label={"Giới tính"}
                name={"gender"}
                value={form.gender}
                onChange={handleChange}
                options={[
                  { value: "male", label: "Nam" },
                  { value: "female", label: "Nữ" },
                ]}
              />
            </div>
            <div className="relative z-50 flex flex-col gap-8">
              <AddressInput
                label={"Địa chỉ liên hệ"}
                name={"address"}
                value={form.address}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        {step == 2 && (
          <>
            <div className="flex flex-col md:flex-row gap-6">
              <BasicInput
                label={"Số thẻ đoàn"}
                name="cardCode"
                value={form.cardCode}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
              <BasicInput
                label={"Ngày vào đoàn"}
                type="date"
                name={"joinedDate"}
                value={form.joinedDate}
                 onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            </div>

            <SelectInput
              label={"Sinh hoạt tại chi đoàn"}
              name={"chapter"}
              value={form.chapter}
              onChange={handleChange}
              options={[
                {
                  value: 1,
                  label:
                    "Chi đoàn khu phố Đông B, phường Đông Hòa, thành phố Hồ Chí Minh",
                },
                {
                  value: 2,
                  label:
                    "Chi đoàn khu phố Đông A, phường Đông Hòa, thành phố Hồ Chí Minh",
                },
                {
                  value: 3,
                  label:
                    "Chi đoàn khu phố Tây B, phường Đông Hòa, thành phố Hồ Chí Minh",
                },
              ]}
            />
          </>
        )}
      </div>
      <div className="flex flex-col gap-4 border">
        {step < maxStep ? (
          <>
            <button
              type="button"
              onClick={nextStep}
              className="border text-lg flex items-center gap-4 justify-center w-full h-12 rounded-lg font-medium text-white bg-blue-600 active:opacity-90"
            >
              Tiếp tục
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleRegister}
              className="border text-lg flex items-center gap-4 justify-center w-full h-12 rounded-lg font-medium text-white bg-blue-600 active:opacity-90"
            >
              Đăng ký
            </button>
          </>
        )}

        <div className="flex flex-col md:flex-row items-center justify-center gap-1">
          Bạn đã có tài khoản
          <Link to={"/"} className="text-blue-600 font-medium active:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </form>
  );
}

export default RegisterForm;

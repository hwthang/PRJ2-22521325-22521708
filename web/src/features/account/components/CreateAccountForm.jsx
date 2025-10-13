import React, { useState } from "react";
import { BUTTON, INPUT_STYLE } from "../../../utils/styles";
import { GENDER, POSITION, ROLE, STATUS } from "../../../utils/map";
import { toDateInputValue } from "../../../utils/date";

function CreateAccountForm() {
  const [user, setUser] = useState(null);
  const handleChange = (name, value) => {
    setUser((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-6 gap-4 p-2">
      <div className="md:col-span-3 border flex flex-col gap-1">
        <p className={`${INPUT_STYLE.label}`}>Vai trò</p>
        <div
          className={`${INPUT_STYLE.input} grid grid-cols-1 lg:grid-cols-3 w-full bg-gray-200 border-none`}
        >
          {ROLE.map((item) => (
            <button
              key={item.value}
              className={`${
                user?.role == item.value &&
                "bg-blue-500 text-white font-semibold rounded-sm text-center"
              } min-h-10 h-10`}
              onClick={() => handleChange("role", item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="md:col-span-3 border flex flex-col gap-1">
        <p className={`${INPUT_STYLE.label}`}>Trạng thái</p>
        <div
          className={`${INPUT_STYLE.input} grid grid-cols-1 lg:grid-cols-3 w-full bg-gray-200 border-none`}
        >
          {STATUS.map((item) => (
            <button
              key={item.value}
              className={`${
                user?.status == item.value &&
                "bg-blue-500 text-white font-semibold rounded-sm text-center"
              } min-h-10 h-10`}
              onClick={() => handleChange("status", item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="relative flex flex-col gap-1 lg:col-span-2">
        <p className={`${INPUT_STYLE.label}`}>Tên người dùng</p>
        <input
          className={`${INPUT_STYLE.input} px-2`}
          value={user?.username}
          onChange={(e) => handleChange("username", e.target.value)}
        />
      </div>
      <div className="relative flex flex-col gap-1  lg:col-span-2">
        <p className={`${INPUT_STYLE.label}`}>Email</p>
        <input
          className={`${INPUT_STYLE.input} px-2`}
          value={user?.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </div>
      <div className="relative flex flex-col gap-1  lg:col-span-2">
        <p className={`${INPUT_STYLE.label}`}>Số điện thoại</p>
        <input
          className={`${INPUT_STYLE.input} px-2`}
          value={user?.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
      </div>
      {user?.role == "member" && (
        <>
          <div className="relative flex flex-col gap-1  lg:col-span-4">
            <p className={`${INPUT_STYLE.label}`}>Họ và tên</p>
            <input
              className={`${INPUT_STYLE.input} px-2`}
              value={user?.fullname}
              onChange={(e) => handleChange("fullname", e.target.value)}
            />
          </div>
          <div className="relative flex flex-col gap-1 ">
            <p className={`${INPUT_STYLE.label}`}>Ngày sinh</p>
            <input
              className={`${INPUT_STYLE.input} px-2`}
              type="date"
              value={toDateInputValue(user?.birthdate)}
              onChange={(e) => handleChange("birthdate", e.target.value)}
            />
          </div>
          <div className="relative flex flex-col gap-1">
            <p className={`${INPUT_STYLE.label}`}>Giới tính</p>
            <div
              className={`${INPUT_STYLE.input} grid grid-cols-2 w-full bg-gray-200 border-none`}
            >
              {GENDER.map((item) => (
                <button
                  key={item.value}
                  className={`${
                    user?.gender == item.value &&
                    "bg-blue-500 text-white font-semibold rounded-sm"
                  }`}
                  onClick={() => handleChange("gender", item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="relative flex flex-col gap-1 lg:col-span-6">
            <p className={`${INPUT_STYLE.label}`}>Địa chỉ </p>
            <textarea
              className={`${INPUT_STYLE.input} resize-none p-2 h-16`}
              value={user?.address}
              onChange={(e) => handleChange("address", e.target.value)}
            ></textarea>
          </div>
          <div className="relative flex flex-col gap-1">
            <p className={`${INPUT_STYLE.label}`}>Số thẻ đoàn</p>
            <input
              className={`${INPUT_STYLE.input} px-2`}
              value={user?.cardCode}
              onChange={(e) => handleChange("cardCode", e.target.value)}
            />
          </div>
          <div className="relative flex flex-col gap-1">
            <p className={`${INPUT_STYLE.label}`}>Ngày vào đoàn</p>
            <input
              className={`${INPUT_STYLE.input} px-2`}
              type="date"
              value={toDateInputValue(user?.joinedDate)}
              onChange={(e) => handleChange("joinedDate", e.target.value)}
            />
          </div>
          <div className="relative flex flex-col gap-1 lg:col-span-4">
            <p className={`${INPUT_STYLE.label}`}>Chi đoàn sinh hoạt</p>
            <input
              className={`${INPUT_STYLE.input} px-2 bg-blue-100`}
              value={user?.chapter?.name}
              disabled
            />
          </div>
          <div className="relative flex flex-col gap-1 lg:col-span-6">
            <p className={`${INPUT_STYLE.label}`}>Chức vụ</p>
            <div
              className={`${INPUT_STYLE.input} grid grid-cols-1 lg:grid-cols-4  w-full bg-gray-200 border-none`}
            >
              {POSITION.map((item) => (
                <button
                  key={item.value}
                  className={`${
                    user?.position == item.value &&
                    "bg-blue-500 text-white font-semibold rounded-sm"
                  } min-h-10 h-10`}
                  onClick={() => handleChange("position", item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      <div className="lg:col-start-3 lg:col-span-2 gap-4 py-4 flex justify-center">
        <button
          className={`${BUTTON} text-white  max-w-1/2 ${"bg-blue-500  active:bg-blue-400"}`}
          // onClick={handleUpdate}
        >
          Tạo mới
        </button>
      </div>
    </div>
  );
}

export default CreateAccountForm;

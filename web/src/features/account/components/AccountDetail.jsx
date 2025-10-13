import React, { useEffect, useState } from "react";
import AccountService from "../services/AccountService.js";
import { toDateInputValue } from "../../../utils/date.js";
import defAvatar from "../../../core/assets/images/avatar.png";
import { GENDER, POSITION, ROLE, STATUS } from "../../../utils/map.js";
import { BUTTON, INPUT_STYLE } from "../../../utils/styles.js";



function AccountDetail({ id }) {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [update, setUpdate] = useState(null);

  const handleChange = (name, value) => {
    setUser((prev) => ({ ...prev, [name]: value }));
    setUpdate((prev) => ({ ...prev, [name]: value }));
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    if (isEditing) {
     
      setIsEditing(false);
      await AccountService.updateUser(id, update)

    }
  };
  const handleCancel = () => {
    if (isEditing) {
      setUpdate(null);
      setUser(data);
      setIsEditing(false);
    }
  };

  const handleActive = async () => {
    await AccountService.activeAccount(id);
    await fetchUser();
  };
  const handleLock = async () => {
    await AccountService.lockAccount(id);
    await fetchUser();
  };

  const fetchUser = async () => {
    const data = await AccountService.getAccount(id);
    setData(data);
    setUser(data);
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div className="p-4 flex flex-col justify-center items-center gap-8">
      <div className="relative">
        <img
          className="min-h-60 min-w-60 h-60 w-60 rounded-full"
          src={defAvatar}
        />
      </div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-6 gap-4">
        <div
          className={`lg:col-start-3 h-10 flex items-center justify-center rounded-full font-semibold ${
            ROLE.find((item) => item.value == user?.role)?.style
          }`}
        >
          {ROLE.find((item) => item.value == user?.role)?.label}
        </div>
        <div
          className={`flex items-center h-10 justify-center rounded-full font-semibold ${
            STATUS.find((item) => item.value == user?.status)?.style
          }`}
        >
          {STATUS.find((item) => item.value == user?.status)?.label}
        </div>
        <div className="lg:col-start-6">
          {["locked", "pending"].includes(user?.status) ? (
            <button
              className={`${BUTTON} bg-green-500 text-white active:bg-green-400`}
              onClick={handleActive}
            >
              Kích hoạt
            </button>
          ) : (
            <button
              className={`${BUTTON} bg-red-500 text-white active:bg-red-400`}
              onClick={handleLock}
            >
              Khóa
            </button>
          )}
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
                className={`${INPUT_STYLE.input} grid grid-cols-1 lg:grid-cols-4 w-full bg-gray-200 border-none`}
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

        <div className="lg:col-start-3 lg:col-span-2 grid grid-cols-2 gap-4 py-4">
          <button
            className={`${BUTTON} text-white  ${
              isEditing ? "bg-blue-500  active:bg-blue-400" : "bg-gray-400"
            }`}
            onClick={handleUpdate}
          >
            Cập nhật
          </button>
          <button
            className={`${BUTTON} text-white  ${
              isEditing ? "bg-red-500  active:bg-red-400" : "bg-gray-400"
            } `}
            onClick={handleCancel}
          >
            Hủy
          </button>
        </div>
        {user?.role == "member" && (
          <>
            <div className="relative flex flex-col gap-1 lg:col-span-6 h-20 border">
              <p className={`text-2xl font-semibold`}>Khen thưởng</p>
              <div className="">Nội dung khen thưởng</div>
            </div>
            <div className="relative flex flex-col gap-1 lg:col-span-6 h-20 border">
              <p className={`text-2xl font-semibold`}>Kỷ luật</p>
              <div className="">Nội dung kỷ luật</div>
            </div>
          </>
        )}
        <div className="relative flex flex-col gap-1 lg:col-span-6 h-20 border">
          <p className={`text-2xl font-semibold`}>Hoạt động</p>
          <div className="">Nội dung hoạt động</div>
        </div>
      </div>
    </div>
  );
}

export default AccountDetail;

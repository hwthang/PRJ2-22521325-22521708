import React, { useEffect, useState } from "react";
import useForm from "../../../core/hooks/useForm";
import { toDateInputValue } from "../../../utils/date";
import ChapterService from "../../chapter/services/ChapterService";
import UserService from "../services/UserService";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

const ROLE = {
  role: ["admin", "member"],
  admin: { label: "Quản trị", color: "bg-purple-200 text-purple-800" },
  manager: { label: "Quản lý", color: "bg-orange-200 text-orange-800" },
  member: { label: "Đoàn viên", color: "bg-cyan-200 text-cyan-800" },
};

const STATUS = {
  status: ["active", "locked", "pending"],
  active: { label: "Hoạt động", color: "bg-green-200 text-green-800" },
  locked: { label: "Khóa", color: "bg-red-200 text-red-800" },
  pending: { label: "Chờ duyệt", color: "bg-yellow-200 text-yellow-800" },
};

const GENDER = {
  gender: ["male", "female"],
  male: { label: "Nam", color: "bg-sky-200 text-sky-800" },
  female: { label: "Nữ", color: "bg-fuchsia-200 text-fuchsia-800" },
};

const POSITION = {
  position: ["bt", "pbt", "uv", "dv"],
  bt: { label: "Bí thư", color: "bg-sky-200 text-sky-800" },
  pbt: { label: "Phó Bí thư", color: "bg-fuchsia-200 text-fuchsia-800" },
  uv: { label: "Ủy viên", color: "bg-indigo-200 text-indigo-800" },
  dv: { label: "Đoàn viên", color: "bg-cyan-200 text-cyan-800" },
};

function CreateUserForm() {
  const [chapters, setChapters] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const account = useForm();
  const profile = useForm();

  const handleChangeAccount = (name, value) => {
    account.handleChangeFieldInForm(name, value);
  };

  const handleChangeProfile = (name, value) => {
    profile.handleChangeFieldInForm(name, value);
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

  const handleCreate = async () => {
    const result = await UserService.createUser(account.form, profile.form);
    console.log(result);
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  return (
    <div className="relative">
      <div className="grid grid-cols-6 gap-x-6 gap-4 auto-rows-10 p-4">
        {/* --- Account Info --- */}
        <div className="relative flex flex-col gap-1 col-span-6 md:col-span-3">
          <p className="font-semibold">Vai trò</p>
          <div className="grid grid-cols-2 bg-gray-200 h-10 overflow-hidden rounded-lg">
            {ROLE.role.map((item) => (
              <button
                key={item}
                type="button"
                className={`rounded-lg ${
                  account?.form?.role === item
                    ? `font-semibold ${ROLE[item].color}`
                    : "text-gray-800"
                }`}
                onClick={() => handleChangeAccount("role", item)}
              >
                {ROLE[item].label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex flex-col gap-1 col-span-6 md:col-span-3">
          <p className="font-semibold">Trạng thái</p>
          <div className="grid grid-cols-3 bg-gray-200 h-10 overflow-hidden rounded-lg">
            {STATUS.status.map((item) => (
              <button
                key={item}
                type="button"
                className={`rounded-lg ${
                  account?.form?.status === item
                    ? `font-semibold ${STATUS[item].color}`
                    : "text-gray-800"
                }`}
                onClick={() => handleChangeAccount("status", item)}
              >
                {STATUS[item].label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex flex-col gap-1 col-span-6 md:col-span-1">
          <p className="font-semibold">Tên người dùng</p>
          <input
            className="border border-gray-300 py-2 px-2 border-2 focus:border-blue-400 outline-none h-10 rounded-lg"
            value={account?.form?.username || ""}
            onChange={(e) => handleChangeAccount("username", e.target.value)}
          />
        </div>

        <div className="relative flex flex-col gap-1 col-span-6 md:col-span-2">
          <p className="font-semibold">Email</p>
          <input
            className="border border-gray-300 py-2 px-2 border-2 focus:border-blue-400 outline-none h-10 rounded-lg"
            value={account?.form?.email || ""}
            onChange={(e) => handleChangeAccount("email", e.target.value)}
          />
        </div>

        <div className="relative flex flex-col gap-1 col-span-6 md:col-span-1">
          <p className="font-semibold">Số điện thoại</p>
          <input
            className="border border-gray-300 py-2 px-2 border-2 focus:border-blue-400 outline-none h-10 rounded-lg"
            value={account?.form?.phone || ""}
            onChange={(e) => handleChangeAccount("phone", e.target.value)}
          />
        </div>

        {/* --- Password --- */}
        <div className="relative flex flex-col gap-1 w-full col-span-6 md:col-span-2">
          <p className="font-medium text-blue-900">Mật khẩu</p>
          <input
            className="outline-none border-2 border-gray-300 focus:border-blue-500 h-10 px-2 pr-12 rounded-lg"
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

        {/* --- Profile Info --- */}
        <div className="relative flex flex-col gap-1 col-span-6 md:col-span-3">
          <p className="font-semibold">Họ và tên</p>
          <input
            className="border border-gray-300 py-2 px-2 border-2 focus:border-blue-400 outline-none h-10 rounded-lg"
            value={profile?.form?.fullname || ""}
            onChange={(e) => handleChangeProfile("fullname", e.target.value)}
          />
        </div>

        <div className="relative flex flex-col gap-1 col-span-6 md:col-span-2">
          <p className="font-semibold">Giới tính</p>
          <div className="grid grid-cols-2 bg-gray-200 h-10 overflow-hidden rounded-lg">
            {GENDER.gender.map((item) => (
              <button
                key={item}
                type="button"
                className={`rounded-lg ${
                  profile?.form?.gender === item
                    ? `font-semibold ${GENDER[item].color}`
                    : "text-gray-800"
                }`}
                onClick={() => handleChangeProfile("gender", item)}
              >
                {GENDER[item].label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex flex-col gap-1 col-span-6 md:col-span-1">
          <p className="font-semibold">Ngày sinh</p>
          <input
            type="date"
            className="border border-gray-300 py-2 px-2 border-2 focus:border-blue-400 outline-none h-10 rounded-lg"
            value={toDateInputValue(profile?.form?.birthdate)}
            onChange={(e) => handleChangeProfile("birthdate", e.target.value)}
            onKeyDown={(e) => e.preventDefault()}
          />
        </div>

        {/* --- Address --- */}
        <div className="relative flex flex-col gap-1 col-span-6 row-span-3 md:col-span-6">
          <p className="font-semibold">Địa chỉ</p>
          <textarea
            className="border border-gray-300 py-2 px-2 h-full border-2 focus:border-blue-400 outline-none resize-none rounded-lg"
            value={profile?.form?.address || ""}
            onChange={(e) => handleChangeProfile("address", e.target.value)}
          ></textarea>
        </div>

        {account?.form?.role === "member" && (
          <>
            <div className="relative flex flex-col gap-1 col-span-6 md:col-span-1">
              <p className="font-semibold">Số thẻ đoàn</p>
              <input
                className="border border-gray-300 py-2 px-2 border-2 focus:border-blue-400 outline-none h-10 rounded-lg"
                value={profile?.form?.cardCode || ""}
                onChange={(e) =>
                  handleChangeProfile("cardCode", e.target.value)
                }
              />
            </div>

            <div className="relative flex flex-col gap-1 col-span-6 md:col-span-1">
              <p className="font-semibold">Ngày vào đoàn</p>
              <input
                type="date"
                className="border border-gray-300 py-2 px-2 border-2 focus:border-blue-400 outline-none h-10 rounded-lg"
                value={profile?.form?.joinedDate}
                onChange={(e) =>
                  handleChangeProfile("joinedDate", e.target.value)
                }
                onKeyDown={(e) => e.preventDefault()}
              />
            </div>

            {/* --- Chapter --- */}
            <div className="relative flex flex-col col-span-6 md:col-span-4 gap-1">
              <p className="font-medium text-blue-900">Chi đoàn</p>
              <select
                className="outline-none border-2 border-gray-300 focus:border-blue-500 h-10 px-2 rounded-lg"
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

            {/* --- Position --- */}
            <div className="relative flex flex-col gap-1 col-span-6">
              <p className="font-semibold">Chức vụ</p>
              <div className="grid grid-cols-2 md:grid-cols-4 bg-gray-200 overflow-hidden rounded-lg">
                {POSITION.position.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`h-11 rounded-lg ${
                      profile?.form?.position === item
                        ? `font-semibold ${POSITION[item].color}`
                        : "text-gray-800"
                    }`}
                    onClick={() => handleChangeProfile("position", item)}
                  >
                    {POSITION[item].label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* --- Create Button --- */}
        <div className="relative flex flex-col gap-1 col-span-2 col-start-3 mt-2 justify-center items-center">
          <button
            className="h-10 md:w-1/2 w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-400 text-white font-semibold rounded-lg"
            onClick={handleCreate}
          >
            Tạo mới
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateUserForm;

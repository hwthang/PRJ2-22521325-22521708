import React, { useEffect, useState } from "react";
import UserService from "../services/UserService";
import { toast } from "react-toastify";
import { GENDER, POSITION, STATUS } from "../../../utils/map";
import useForm from "../../../core/hooks/useForm";
import { toDateInputValue } from "../../../utils/date";
import defAvatar from "../../../core/assets/images/avatar.png";

const ROLE = {
  admin: {
    label: "Quản trị",
    color: "bg-purple-200 text-purple-800",
  },
  manager: {
    label: "Quản lý",
    color: "bg-orange-200 text-orange-800",
  },
  member: {
    label: "Đoàn viên",
    color: "bg-cyan-200 text-cyan-800",
  },
};

function UserDetail({ id }) {
  const [account, setAccount] = useState(null);
  const [profile, setProfile] = useState(null);
  const [chapter, setChapter] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const updatingAccount = useForm();
  const updatingProfile = useForm();

  const handleChangeAccount = (name, value) => {
    setAccount((prev) => ({ ...prev, [name]: value }));
    updatingAccount.handleChangeFieldInForm(name, value);
    setIsEditing(true);
  };

  const handleChangeProfile = (name, value) => {
    setProfile((prev) => ({ ...prev, [name]: value }));
    updatingProfile.handleChangeFieldInForm(name, value);
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    if (!isEditing) return;
    try {
      setIsEditing(false);
      const result = await UserService.updateUser(
        id,
        updatingAccount.form,
        updatingProfile.form
      );
      if (result.success) toast.success("Cập nhật thành công!");
      else toast.error(result.message);
    } catch (err) {
      toast.error("Lỗi khi cập nhật người dùng!");
      console.error(err);
    }
  };

  const handleActive = async () => {
    await UserService.activeUser(id);
    await fetchUser();
  };

  const handleLock = async () => {
    await UserService.lockUser(id);
    await fetchUser();
  };

  const fetchUser = async () => {
    try {
      const result = await UserService.fetchUser(id);
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      const acc = {
        username: result.data.username || "",
        email: result.data.email || "",
        phone: result.data.phone || "",
        role: result.data.role || "",
        status: result.data.status || "",
      };
      setAccount(acc);

      if (result.data.profile) {
        const prf = {
          fullname: result.data.profile?.fullname || "",
          birthdate: result.data.profile?.birthdate || "",
          gender: result.data.profile?.gender || "",
          address: result.data.profile?.address || "",
          cardCode: result.data.profile?.cardCode || "",
          joinedDate: result.data.profile?.joinedDate || "",
          position: result.data.profile?.position || "",
          chapter: result.data.profile?.chapter || null,
        };
        setProfile(prf);

        const chapterText = [
          result.data.profile?.chapter?.name,
          result.data.profile?.chapter?.affiliated,
        ]
          .filter(Boolean)
          .join(", ");

        setChapter(chapterText);
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải thông tin người dùng!");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  return (
    <div className="relative">
      <div className="grid grid-cols-6 gap-x-6 gap-4 auto-rows-10 p-4">
        {/* --- Avatar + Role + Status --- */}
        <div className="row-span-2 flex flex-col items-center justify-center gap-3 col-span-6 lg:col-span-1 md:row-span-3">
          <img
            src={defAvatar}
            className="max-w-40 w-full object-cover aspect-square"
            alt="avatar"
          />
        </div>

        <div
          className={`text-sm flex items-center justify-center p-2 font-semibold col-span-3 md:col-span-1 md:row-start-4 ${
            ROLE[account?.role]?.color
          }`}
        >
          {ROLE[account?.role]?.label}
        </div>

        <div
          className={`text-sm flex items-center justify-center p-2 font-semibold col-span-3  md:col-span-1 md:row-start-5 ${
            STATUS.find((s) => s.value === account?.status)?.style
          }`}
        >
          {STATUS.find((s) => s.value === account?.status)?.label}
        </div>

        {/* --- Account Info --- */}
        <div className="relative flex flex-col gap-1 col-span-6 md:col-span-2">
          <p className="font-semibold">Tên người dùng</p>
          <input
            className="border border-gray-300 py-2 px-2 border-2 focus:border-blue-400 outline-none"
            value={account?.username || ""}
            onChange={(e) => handleChangeAccount("username", e.target.value)}
          />
        </div>

        <div className="relative flex flex-col gap-1 col-span-6 md:col-span-2">
          <p className="font-semibold">Email</p>
          <input
            className="border border-gray-300 py-2 px-2 border-2 focus:border-blue-400 outline-none"
            value={account?.email || ""}
            onChange={(e) => handleChangeAccount("email", e.target.value)}
          />
        </div>

        <div className="relative flex flex-col gap-1 col-span-6 md:col-span-1">
          <p className="font-semibold">Số điện thoại</p>
          <input
            className="border border-gray-300 py-2 px-2 border-2 focus:border-blue-400 outline-none"
            value={account?.phone || ""}
            onChange={(e) => handleChangeAccount("phone", e.target.value)}
          />
        </div>

        {/* --- Profile Info (if exists) --- */}

        <div className="relative flex flex-col gap-1 col-span-6 md:col-span-3">
          <p className="font-semibold">Họ và tên</p>
          <input
            className="border border-gray-300 py-2 px-2 border-2 focus:border-blue-400 outline-none"
            value={profile?.fullname || ""}
            onChange={(e) => handleChangeProfile("fullname", e.target.value)}
          />
        </div>

        <div className="relative flex flex-col gap-1 col-span-6 md:col-span-1">
          <p className="font-semibold">Giới tính</p>
          <div className="grid grid-cols-2 bg-gray-200 h-11 overflow-hidden">
            {GENDER.map((g) => (
              <button
                key={g.value}
                type="button"
                className={`py-2 ${
                  profile?.gender === g.value
                    ? `font-semibold ${g.style}`
                    : "text-gray-800"
                }`}
                onClick={() => handleChangeProfile("gender", g.value)}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex flex-col gap-1 col-span-6 md:col-span-1">
          <p className="font-semibold">Ngày sinh</p>
          <input
            type="date"
            className="border border-gray-300 py-2 px-2 border-2 focus:border-blue-400 outline-none"
            value={toDateInputValue(profile?.birthdate)}
            onChange={(e) => handleChangeProfile("birthdate", e.target.value)}
            onKeyDown={(e) => e.preventDefault()}
          />
        </div>

        <div className="relative flex flex-col gap-1 col-span-6 row-span-3 md:col-span-5">
          <p className="font-semibold">Địa chỉ</p>
          <textarea
            className="border border-gray-300 py-2 px-2 h-full border-2 focus:border-blue-400 outline-none resize-none"
            value={profile?.address || ""}
            onChange={(e) => handleChangeProfile("address", e.target.value)}
          ></textarea>
        </div>
        {account?.role == "member" && (
          <>
            {" "}
            <div className="relative flex flex-col gap-1 col-span-6 md:col-span-1">
              <p className="font-semibold">Số thẻ đoàn</p>
              <input
                className="border border-gray-300 py-2 px-2 border-2 focus:border-blue-400 outline-none"
                value={profile?.cardCode || ""}
                onChange={(e) =>
                  handleChangeProfile("cardCode", e.target.value)
                }
              />
            </div>
            <div className="relative flex flex-col gap-1 col-span-6 md:col-span-1">
              <p className="font-semibold">Ngày vào đoàn</p>
              <input
                type="date"
                className="border border-gray-300 py-2 px-2 border-2 focus:border-blue-400 outline-none"
                value={toDateInputValue(profile?.joinedDate)}
                onChange={(e) =>
                  handleChangeProfile("joinedDate", e.target.value)
                }
                onKeyDown={(e) => e.preventDefault()}
              />
            </div>
            <div className="relative flex flex-col gap-1 col-span-6 md:col-span-4">
              <p className="font-semibold">Chi đoàn sinh hoạt</p>
              <div className="min-h-11 flex items-center px-3 py-1 bg-blue-100 text-blue-900">
                {chapter}
              </div>
            </div>
            <div className="relative flex flex-col gap-1 col-span-6">
              <p className="font-semibold">Chức vụ</p>
              <div className="grid grid-cols-2 md:grid-cols-4 bg-gray-100 overflow-hidden">
                {POSITION.map((pos) => (
                  <button
                    key={pos.value}
                    type="button"
                    className={`py-2 ${
                      profile?.position === pos.value
                        ? `${pos.style} font-semibold`
                        : "text-gray-700"
                    }`}
                    onClick={() => handleChangeProfile("position", pos.value)}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* --- Buttons --- */}

        <button
          className={`mt-2 relative flex flex-col gap-1 col-span-3 px-4 py-2 text-white font-semibold md:col-span-1 md:col-start-3 ${
            isEditing
              ? "bg-indigo-600 hover:bg-indigo-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleUpdate}
        >
          Cập nhật
        </button>

        {account?.status !== "active" ? (
          <button
            className="mt-2 relative flex flex-col gap-1 col-span-3 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold md:col-span-1"
            onClick={handleActive}
          >
            Kích hoạt
          </button>
        ) : (
          <button
            className=" mt-2 relative flex flex-col gap-1 col-span-3 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold md:col-span-1"
            onClick={handleLock}
          >
            Khóa
          </button>
        )}
      </div>
    </div>
  );
}

export default UserDetail;

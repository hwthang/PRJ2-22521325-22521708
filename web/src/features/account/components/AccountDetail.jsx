import React, { useState } from "react";
import defAvatar from "../../../core/assets/images/avatar.png";
import { LuImagePlus } from "react-icons/lu";
import { useLocation } from "react-router-dom";

// Array 2: chi tiết (gồm role + status + toàn bộ thông tin khác)
const ACCOUNT_DETAIL = {
  user1: {
    fullName: "Nguyễn Văn A",
    username: "nguyenvana",
    email: "vana@example.com",
    phone: "0901234567",
    dob: "1998-05-10",
    gender: "male",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    cardNumber: "",
    joinedDate: "",
    chapter: "",
    position: "",
    role: "admin",
    status: "active",
  },
  user2: {
    fullName: "Trần Thị B",
    username: "tranthib",
    email: "thib@example.com",
    phone: "0912345678",
    dob: "1995-03-22",
    gender: "female",
    address: "456 Đường DEF, Quận 3, TP.HCM",
    cardNumber: "",
    joinedDate: "",
    chapter: "donga",
    position: "",
    role: "manager",
    status: "locked",
  },
  user3: {
    fullName: "Lê Văn C",
    username: "levanc",
    email: "levanc@example.com",
    phone: "0923456789",
    dob: "2000-12-01",
    gender: "male",
    address: "789 Đường XYZ, Quận 5, TP.HCM",
    cardNumber: "1122334455",
    joinedDate: "2020-01-10",
    chapter: "tayb",
    position: "doan_vien",
    role: "member",
    status: "pending",
  },
};

function AccountDetail({id}) {
  const user = ACCOUNT_DETAIL[id];
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(defAvatar);
  const [role, setRole] = useState(user.role || "member");
  const [status, setStatus] = useState(user.status || "pending");

  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    username: user.username || "",
    email: user.email || "",
    phone: user.phone || "",
    dob: user.dob || "",
    gender: user.gender || "",
    address: user.address || "",
    cardNumber: user.cardNumber || "",
    joinedDate: user.joinedDate || "",
    chapter: user.chapter || "",
    position: user.position || "",
  });

  // update dữ liệu form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // chọn avatar mới
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  // lưu
  const handleSave = () => {
    console.log("Dữ liệu lưu:", formData);
    console.log("Avatar:", avatar);
    setIsEditing(false);
  };

  // hủy
  const handleCancel = () => {
    setIsEditing(false);
    // TODO: có thể reset lại formData nếu cần
  };
  const roleMap = {
    admin: {
      label: "Quản trị viên",
      className: "bg-blue-200 text-blue-950",
    },
    manager: {
      label: "Quản lý",
      className: "bg-purple-200 text-purple-950",
    },
    member: {
      label: "Đoàn viên",
      className: "bg-gray-200 text-gray-950",
    },
  };

  const statusMap = {
    active: {
      label: "Đã kích hoạt",
      className: "bg-green-200 text-green-950",
    },
    locked: {
      label: "Đã khóa",
      className: "bg-red-200 text-red-950",
    },
    pending: {
      label: "Chờ duyệt",
      className: "bg-yellow-200 text-yellow-950",
    },
  };
  const statusActionMap = {
    active: {
      label: "Khóa",
      className: "bg-red-700 hover:bg-red-600",
    },
    locked: {
      label: "Mở khóa",
      className: "bg-blue-700 hover:bg-blue-600",
    },
    pending: {
      label: "Phê duyệt",
      className: "bg-green-700 hover:bg-green-600",
    },
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-6 p-4 rounded-lg">
        {/* Avatar */}
        <div className="w-full md:w-60 flex flex-col justify-start items-center gap-6 rounded-lg">
          <div className="relative">
            <img src={avatar} className="w-60 h-60 rounded-full object-cover" />
            {isEditing && (
              <>
                <label
                  htmlFor="avatarUpload"
                  className="absolute bottom-4 right-4 bg-blue-600 p-2 rounded-full text-white cursor-pointer"
                >
                  <LuImagePlus size={24} />
                </label>
                <input
                  id="avatarUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </>
            )}
          </div>

          {/* trạng thái */}
          <div className="w-full justify-center flex gap-4">
            <div
              className={`text-sm w-full py-2 text-center rounded-lg font-semibold ${roleMap[role].className}`}
            >
              {roleMap[role].label}
            </div>
            <div
              className={`text-sm w-full py-2 text-center rounded-lg font-semibold ${statusMap[status].className}`}
            >
              {statusMap[status].label}
            </div>
          </div>

          {/* button */}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-900 w-full rounded-lg p-2 text-white active:bg-blue-800"
            >
              Chỉnh sửa
            </button>
          ) : (
            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={handleSave}
                className="bg-green-700 w-full rounded-lg p-2 text-white active:bg-green-600"
              >
                Lưu
              </button>
            </div>
          )}

          <button
            onClick={handleCancel}
            className={`w-full rounded-lg p-2 text-white ${statusActionMap[status].className}`}
          >
            {statusActionMap[status].label}
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Họ và tên */}
            <div className="flex flex-col gap-1">
              <p>Họ và tên</p>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                disabled={!isEditing}
                className="outline-none border-2 rounded-lg px-2 py-1 border-gray-200 focus:border-blue-600 disabled:bg-gray-100"
              />
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1">
              <p>Tên người dùng</p>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nhập tên người dùng"
                disabled={!isEditing}
                className="outline-none border-2 rounded-lg px-2 py-1 border-gray-200 focus:border-blue-600 disabled:bg-gray-100"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <p>Email</p>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email"
                disabled={!isEditing}
                className="outline-none border-2 rounded-lg px-2 py-1 border-gray-200 focus:border-blue-600 disabled:bg-gray-100"
              />
            </div>

            {/* Số điện thoại */}
            <div className="flex flex-col gap-1">
              <p>Số điện thoại</p>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                disabled={!isEditing}
                className="outline-none border-2 rounded-lg px-2 py-1 border-gray-200 focus:border-blue-600 disabled:bg-gray-100"
              />
            </div>

            {/* Ngày sinh */}
            <div className="flex flex-col gap-1">
              <p>Ngày sinh</p>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                disabled={!isEditing}
                className="outline-none border-2 rounded-lg px-2 py-1 border-gray-200 focus:border-blue-600 disabled:bg-gray-100"
              />
            </div>

            {/* Giới tính */}
            <div className="flex flex-col gap-1">
              <p>Giới tính</p>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!isEditing}
                className="outline-none border-2 rounded-lg px-2 py-1 border-gray-200 focus:border-blue-600 disabled:bg-gray-100"
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>

            {/* Địa chỉ */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <p>Địa chỉ</p>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Nhập địa chỉ"
                rows="3"
                disabled={!isEditing}
                className="outline-none border-2 rounded-lg px-2 py-1 border-gray-200 focus:border-blue-600 resize-none disabled:bg-gray-100"
              ></textarea>
            </div>

            {/* Số thẻ đoàn (chỉ member mới có) */}
            {role === "member" && (
              <div className="flex flex-col gap-1">
                <p>Số thẻ đoàn</p>
                <input
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="Nhập số thẻ đoàn"
                  disabled={!isEditing}
                  className="outline-none border-2 rounded-lg px-2 py-1 border-gray-200 focus:border-blue-600 disabled:bg-gray-100"
                />
              </div>
            )}

            {/* Ngày vào đoàn (chỉ member mới có) */}
            {role === "member" && (
              <div className="flex flex-col gap-1">
                <p>Ngày vào đoàn</p>
                <input
                  type="date"
                  name="joinedDate"
                  value={formData.joinedDate}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="outline-none border-2 rounded-lg px-2 py-1 border-gray-200 focus:border-blue-600 disabled:bg-gray-100"
                />
              </div>
            )}

            {/* Chi đoàn sinh hoạt (admin không có) */}
            {role !== "admin" && (
              <div className={`flex flex-col gap-1 ${role=='manager' && 'md:col-span-2'}`}>
                <p>Chi đoàn liên quan</p>
                <select
                  name="chapter"
                  value={formData.chapter}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="outline-none border-2 rounded-lg px-2 py-1 border-gray-200 focus:border-blue-600 disabled:bg-gray-100"
                >
                  <option value="">Chọn chi đoàn</option>
                  <option value="dongb">Chi đoàn khu phố Đông B</option>
                  <option value="donga">Chi đoàn khu phố Đông A</option>
                  <option value="tayb">Chi đoàn khu phố Tây B</option>
                </select>
              </div>
            )}

            {/* Chức vụ (chỉ member mới có) */}
            {role === "member" && (
              <div className="flex flex-col gap-1">
                <p>Chức vụ</p>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="outline-none border-2 rounded-lg px-2 py-1 border-gray-200 focus:border-blue-600 disabled:bg-gray-100"
                >
                  <option value="">Chọn chức vụ</option>
                  <option value="bi_thu">Bí thư</option>
                  <option value="pho_bi_thu">Phó Bí thư</option>
                  <option value="uy_vien">Ủy viên BCH</option>
                  <option value="doan_vien">Đoàn viên</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Các section khác */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <p className="font-bold text-2xl">Khen thưởng</p>
          Nội dung khen thưởng
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold text-2xl">Kỷ luật</p>
          Nội dung kỷ luật
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold text-2xl">Nhật ký hoạt động</p>
          Nội dung nhật ký
        </div>
      </div>
    </div>
  );
}

export default AccountDetail;

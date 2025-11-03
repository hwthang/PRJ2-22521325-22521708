import { CameraIcon, Eye, EyeClosed, Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CheckOption } from "../../../core/components/CheckOption";
import defAvatar from "../../../core/assets/images/avatar.png";
import { useNavigate } from "react-router-dom";
import AccountService from "../services/AccountService";
import { toast } from "react-toastify";

function AccountForm({ account = null, isUpdated = false }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Map label ↔ value
  const accountTypeMap = {
    "Quản trị viên": "admin",
    "Chi đoàn": "chapter",
    "Đoàn viên": "member",
  };
  const accountTypeReverseMap = Object.fromEntries(
    Object.entries(accountTypeMap).map(([k, v]) => [v, k])
  );

  const statusMap = {
    "Chờ duyệt": "pending",
    "Đang hoạt động": "active",
    "Đã khóa": "locked",
  };
  const statusReverseMap = Object.fromEntries(
    Object.entries(statusMap).map(([k, v]) => [v, k])
  );

  useEffect(() => {
    setFormValues({
      username: account?.username || "",
      type: account ? accountTypeReverseMap[account.type] : "Quản trị viên",
      status: account ? statusReverseMap[account.status] : "Chờ duyệt",
      email: account?.email || "",
      phoneNumber: account?.phoneNumber || "",
      password: account?.password || "",
      avatar: account?.avatar?.path || defAvatar,
    });
  }, [account]);

  const accountTypes = Object.keys(accountTypeMap);
  const accountTypeColors = {
    "Quản trị viên": "pink",
    "Chi đoàn": "orange",
    "Đoàn viên": "sky",
  };

  const statusTypes = Object.keys(statusMap);
  const statusColors = {
    "Chờ duyệt": "yellow",
    "Đang hoạt động": "green",
    "Đã khóa": "red",
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") setFormValues({ ...formValues, [name]: files[0] });
    else setFormValues({ ...formValues, [name]: value });
  };

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!formValues.username.trim())
      newErrors.username = "Tên đăng nhập là bắt buộc";

    if (!formValues.email.trim()) newErrors.email = "Email là bắt buộc";
    else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formValues.email))
      newErrors.email = "Email không hợp lệ";

    if (!formValues.phoneNumber.trim())
      newErrors.phoneNumber = "Số điện thoại là bắt buộc";
    else if (!/^\+?\d{9,15}$/.test(formValues.phoneNumber))
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";

    if (!isUpdated && !formValues.password)
      newErrors.password = "Mật khẩu là bắt buộc";
    else if (formValues.password && formValues.password.length < 6)
      newErrors.password = "Mật khẩu tối thiểu 6 ký tự";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildFormData = () => {
    const formData = new FormData();
    Object.keys(formValues).forEach((key) => {
      const newValue = formValues[key];
      let oldValue;

      if (account) {
        oldValue =
          key === "type"
            ? accountTypeReverseMap[account[key]]
            : key === "status"
            ? statusReverseMap[account[key]]
            : account[key];
      }

      if (key === "avatar" && newValue instanceof File)
        formData.append(key, newValue);
      else if (!isUpdated || newValue !== oldValue) {
        let value = newValue;
        if (key === "type") value = accountTypeMap[value] || value;
        if (key === "status") value = statusMap[value] || value;
        formData.append(key, value);
      }
    });
    return formData;
  };

  // Handlers with try/catch and toast
  const handleAddNew = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const formData = buildFormData();
      const res = await AccountService.createAccount(formData);
      if (res) toast.success("Thêm tài khoản thành công");
      console.log(res);
      switch (res.type) {
        case "admin": {
          navigate(`../accounts/${res._id}`);
          return;
        }
        case "chapter": {
          navigate(`../chapters/${res.chapterId}`);
          return;
        }
        case "member": {
          navigate(`../members/${res.memberId}`);
          return;
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Thêm tài khoản thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const formData = buildFormData();
      const res = await AccountService.updateAccount(account._id, formData);
      if (res) toast.success("Cập nhật tài khoản thành công");

      console.log(res);
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật tài khoản thất bại");
    } finally {
      setLoading(false);
    }
  };
  const handleActivate = async () => {
    setLoading(true);
    try {
      const res = await AccountService.activateAccount(account._id);
      if (res) {
        toast.success("Kích hoạt tài khoản thành công");
        // Cập nhật trạng thái trực tiếp
        setFormValues((prev) => ({ ...prev, status: "Đang hoạt động" }));
      }
      console.log(res);
    } catch (error) {
      console.error(error);
      toast.error("Kích hoạt tài khoản thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleLock = async () => {
    setLoading(true);
    try {
      const res = await AccountService.lockAccount(account._id);
      if (res) {
        toast.success("Khóa tài khoản thành công");
        // Cập nhật trạng thái trực tiếp
        setFormValues((prev) => ({ ...prev, status: "Đã khóa" }));
      }
      console.log(res);
    } catch (error) {
      console.error(error);
      toast.error("Khóa tài khoản thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = () => {
    try {
      switch (formValues.type) {
        case "Chi đoàn":
          navigate(`/chapters/${account?._id}`);
          break;
        default:
          navigate(`/users/${account?._id}`);
          break;
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể mở hồ sơ");
    }
  };

  const handleChangePassword = async () => {
    setLoading(true);
    try {
      const res = await AccountService.changePassword(
        account._id,
        formValues.password
      );
      toast.success("Đổi mật khẩu thành công");
      console.log(res);
    } catch (error) {
      console.error(error);
      toast.error("Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-12 md:col-span-8 md:col-start-3 grid grid-cols-8 gap-6">
        {/* Avatar */}
        <div className="col-span-12 flex flex-col gap-1 md:col-span-2 md:row-span-2 items-center">
          <div className="relative w-fit h-fit">
            <img
              src={
                formValues.avatar instanceof File
                  ? URL.createObjectURL(formValues.avatar)
                  : formValues.avatar || defAvatar
              }
              alt="avatar"
              className="w-40 h-full aspect-square rounded-full bg-gray-200 shadow-xl border border-blue-500"
            />
            <label
              htmlFor="avatar"
              className="absolute bottom-0 right-0 bg-blue-500 text-white border border-blue-500 flex w-10 h-10 items-center justify-center rounded-full"
            >
              <CameraIcon />
              <input
                id="avatar"
                name="avatar"
                type="file"
                className="hidden"
                onChange={handleChange}
              />
            </label>
          </div>
        </div>

        {/* Username */}
        <div className="col-span-12 flex flex-col gap-1 md:col-span-6">
          <label className="font-semibold">Tên đăng nhập</label>
          <div className="border h-10 rounded-md border-gray-300 px-4">
            <input
              name="username"
              value={formValues.username}
              onChange={handleChange}
              className="h-full w-full outline-none bg-transparent"
            />
          </div>
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}
        </div>

        {/* Account Type */}
        <div className="col-span-12 flex flex-col gap-1 md:col-span-3">
          <label className="font-semibold">Loại tài khoản</label>
          <CheckOption
            options={accountTypes}
            value={formValues.type}
            onChange={(val) => setFormValues({ ...formValues, type: val })}
            colors={accountTypeColors}
            disabled={isUpdated}
          />
        </div>

        {/* Status */}
        <div className="col-span-12 flex flex-col gap-1 md:col-span-3">
          <label className="font-semibold">Trạng thái</label>
          <CheckOption
            options={statusTypes}
            value={formValues.status}
            onChange={(val) => setFormValues({ ...formValues, status: val })}
            colors={statusColors}
            disabled={isUpdated}
          />
        </div>

        {/* Email */}
        <div className="col-span-12 flex flex-col gap-1 md:col-span-3">
          <label className="font-semibold">Email</label>
          <div className="border h-10 rounded-md border-gray-300 px-4">
            <input
              name="email"
              value={formValues.email}
              onChange={handleChange}
              className="h-full w-full outline-none bg-transparent"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="col-span-12 flex flex-col gap-1 md:col-span-2">
          <label className="font-semibold">Số điện thoại</label>
          <div className="border h-10 rounded-md border-gray-300 px-4">
            <input
              name="phoneNumber"
              value={formValues.phoneNumber}
              onChange={handleChange}
              className="h-full w-full outline-none bg-transparent"
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Password */}
        <div className="col-span-12 flex flex-col gap-1 md:col-span-3">
          <label className="font-semibold">Mật khẩu</label>
          <div className="border h-10 rounded-md border-gray-300 px-4 flex items-center gap-2">
            <input
              name="password"
              type={showPassword && !isUpdated ? "text" : "password"}
              disabled={isUpdated}
              value={formValues.password}
              onChange={handleChange}
              className="h-full w-full outline-none bg-transparent"
            />
            {showPassword ? (
              <EyeClosed onClick={() => setShowPassword(false)} />
            ) : (
              <Eye onClick={() => setShowPassword(true)} />
            )}
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="col-span-12 flex flex-wrap gap-6 md:col-span-8 items-center justify-center mt-4">
          {isUpdated ? (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-blue-500 text-white h-10 min-w-fit flex-1 px-4 rounded-md flex items-center justify-center gap-2"
              >
                {loading && <Loader className="animate-spin w-4 h-4" />}
                Lưu thay đổi
              </button>
              {statusMap[formValues.status] == "active" &&
              account.type != "admin" ? (
                <button
                  onClick={handleLock}
                  disabled={loading}
                  className="bg-red-500 text-white h-10 min-w-fit flex-1 px-4 rounded-md"
                >
                  Khóa
                </button>
              ) : (
                <>
                  {account.type != "admin" && (
                    <button
                      onClick={handleActivate}
                      disabled={loading}
                      className="bg-blue-500 text-white h-10 min-w-fit flex-1 px-4 rounded-md"
                    >
                      Kích hoạt
                    </button>
                  )}
                </>
              )}
              {account.type != "admin" && (
                <button
                  onClick={handleViewProfile}
                  disabled={loading}
                  className="bg-blue-500 text-white h-10 min-w-fit flex-1 px-4 rounded-md"
                >
                  Xem hồ sơ chi tiết
                </button>
              )}

              {/* <button
                onClick={handleChangePassword}
                disabled={loading}
                className="bg-blue-500 text-white h-10 min-w-fit flex-1 px-4 rounded-md"
              >
                Đổi mật khẩu mới
              </button> */}
            </>
          ) : (
            <button
              onClick={handleAddNew}
              disabled={loading}
              className="bg-blue-500 text-white h-10 w-full px-4 rounded-md flex items-center justify-center gap-2"
            >
              {loading && <Loader className="animate-spin w-4 h-4" />}
              Thêm mới
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountForm;

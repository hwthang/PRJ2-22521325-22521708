import React, { useEffect, useState } from "react";
import AccountAvatar from "../../component/AccountAvatar";
import CustomInput from "../../component/custom/CustomInput";
import CustomTextArea from "../../component/custom/CustomTextArea";
import { CHAPTER_AFFILIATED } from "../shared/ChapterMap";
import useForm from "../../../core/hooks/useForm";
import {
  RotateCcwKey,
  SquareX,
  UserPen,
  Loader2,
  CheckCircle,
  AlertCircle,
  Lock,
  Unlock,
} from "lucide-react";
import useChapterUpdate from "../hook/useChapterUpdate";
import { toDateInputValue } from "../../../utils/date";
import apiClient from "../../../utils/api";

// --- Sub-component: Change Password Popup ---
const ChangePasswordPopup = ({ isOpen, onClose, accountId }) => {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleRecover = async () => {
    if (!newPassword || newPassword.length < 6) {
      setStatus({ type: "error", message: "Mật khẩu phải từ 6 ký tự trở lên" });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      await apiClient.patch(`/api/accounts/${accountId}/recover-password`, {
        password: newPassword,
      });
      setStatus({ type: "success", message: "Đổi mật khẩu thành công!" });
      setTimeout(() => {
        setNewPassword("");
        setStatus({ type: "", message: "" });
        onClose();
      }, 1500);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Không thể đổi mật khẩu",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
        <div className="p-5 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <RotateCcwKey className="w-5 h-5 text-orange-700" /> Đặt lại mật
            khẩu
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <SquareX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới..."
              className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 transition-all"
            />
          </div>

          {status.message && (
            <div
              className={`p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
                status.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {status.message}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded-md font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleRecover}
              disabled={loading}
              className="flex-1 py-2 bg-orange-700 hover:bg-orange-800 text-white rounded-md font-medium flex items-center justify-center gap-2 disabled:bg-gray-400 transition-all"
            >
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Xác nhận"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const ChapterDetailForm = ({ data }) => {
  const formInstance = useForm();
  const { updateChapter } = useChapterUpdate();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [errors, setErrors] = useState({});
  const [initialForm, setInitialForm] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    formInstance.handleChangeFieldInForm(name, value);
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{9,15}$/;

    if (!formInstance.getFieldInForm("username"))
      newErrors.username = "Tên đăng nhập không được để trống";
    const email = formInstance.getFieldInForm("email");
    if (!email) newErrors.email = "Email không được để trống";
    else if (!emailRegex.test(email)) newErrors.email = "Email không hợp lệ";
    const phone = formInstance.getFieldInForm("phoneNumber");
    if (!phone) newErrors.phoneNumber = "Số điện thoại không được để trống";
    else if (!phoneRegex.test(phone))
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    if (!formInstance.getFieldInForm("name"))
      newErrors.name = "Tên chi đoàn không được để trống";
    if (!formInstance.getFieldInForm("affiliated"))
      newErrors.affiliated = "Đoàn trực thuộc không được để trống";
    if (!formInstance.getFieldInForm("establishedAt"))
      newErrors.establishedAt = "Ngày thành lập không được để trống";
    if (!formInstance.getFieldInForm("address"))
      newErrors.address = "Địa chỉ không được để trống";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await updateChapter(data.id, formInstance.form);
      if (response.success) {
        setStatus({
          type: "success",
          message: "Cập nhật chi đoàn thành công!",
        });
        setInitialForm(formInstance.form);
        setIsDirty(false);
      } else {
        setStatus({
          type: "error",
          message: response.message || "Có lỗi xảy ra",
        });
      }
    } catch (e) {
      setStatus({ type: "error", message: e.message || "Có lỗi xảy ra" });
    } finally {
      setLoading(false);
    }
  };

  // --- Logic Xử lý Khóa/Mở khóa ---
  const handleToggleActive = async (targetStatus) => {
    setLoading(true);
    setStatus({ type: "", message: "" });
    const action = targetStatus ? "activate" : "inactivate";
    try {
      await apiClient.patch(`/api/accounts/${data.accountId}/${action}`);
      setStatus({
        type: "success",
        message: targetStatus
          ? "Kích hoạt tài khoản thành công!"
          : "Đã khóa tài khoản thành công!",
      });
      // Cập nhật local state của form để đồng bộ UI
      formInstance.handleChangeFieldInForm("isActive", targetStatus);
      setInitialForm((prev) => ({ ...prev, isActive: targetStatus }));
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Thao tác thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = {
      username: data?.username,
      email: data?.email,
      phoneNumber: data?.phoneNumber,
      name: data?.name,
      isActive: data?.isActive,
      affiliated: data?.affiliated,
      establishedAt: toDateInputValue(data?.establishedAt),
      address: data?.address,
    };
    formInstance.setForm(init);
    setInitialForm(init);
  }, [data]);

  useEffect(() => {
    const changed =
      JSON.stringify(formInstance.form) !== JSON.stringify(initialForm);
    setIsDirty(changed);
  }, [formInstance.form, initialForm]);

  return (
    <>
      <div className="grid grid-cols-12 gap-x-6 gap-y-2 border border-gray-200 rounded-md p-6 shadow-md bg-white">
        <div className="col-span-12 flex items-center justify-center mt-2">
          <AccountAvatar id={data?.accountId} defaultSrc={data?.avatar} />
        </div>

        <div className="col-span-12 text-2xl font-medium mt-4 border-b pb-2">
          THÔNG TIN TÀI KHOẢN
        </div>

        <CustomInput
          className="col-span-12 md:col-span-4"
          label="Tên đăng nhập"
          name="username"
          value={formInstance.getFieldInForm("username")}
          onChange={handleChange}
          error={errors.username}
        />

        <CustomInput
          className="col-span-12 md:col-span-5"
          label="Email"
          name="email"
          value={formInstance.getFieldInForm("email")}
          onChange={handleChange}
          error={errors.email}
        />

        <CustomInput
          className="col-span-12 md:col-span-3"
          label="Số điện thoại"
          name="phoneNumber"
          value={formInstance.getFieldInForm("phoneNumber")}
          onChange={handleChange}
          error={errors.phoneNumber}
        />

        <div className="col-span-12 mt-6 text-2xl font-medium border-b pb-2">
          THÔNG TIN CHI ĐOÀN
        </div>

        <CustomInput
          className="col-span-12 md:col-span-4"
          label="Tên chi đoàn"
          name="name"
          value={formInstance.getFieldInForm("name")}
          onChange={handleChange}
          error={errors.name}
        />

        <div className="col-span-12 md:col-span-5">
          <CustomInput
            label="Đoàn trực thuộc"
            name="affiliated"
            list="affiliatedList"
            value={formInstance.getFieldInForm("affiliated")}
            onChange={handleChange}
            error={errors.affiliated}
          />
          <datalist id="affiliatedList">
            {CHAPTER_AFFILIATED.map((item) => (
              <option value={item} key={item} />
            ))}
          </datalist>
        </div>

        <CustomInput
          className="col-span-12 md:col-span-3"
          label="Ngày thành lập"
          type="date"
          name="establishedAt"
          value={formInstance.getFieldInForm("establishedAt")}
          onChange={handleChange}
          error={errors.establishedAt}
        />

        <CustomTextArea
          className="col-span-12 mt-2"
          label="Địa chỉ"
          name="address"
          value={formInstance.getFieldInForm("address")}
          onChange={handleChange}
          error={errors.address}
        />

        {/* --- Action Buttons --- */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-10 gap-3 mt-8">
          <button
            onClick={handleUpdate}
            disabled={loading || !isDirty}
            className={`text-sm font-semibold md:col-start-2 md:col-span-2 flex items-center justify-center p-2.5 gap-2 rounded-md text-white transition-all
              ${
                isDirty && !loading
                  ? "bg-blue-600 hover:bg-blue-700 shadow-md"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <UserPen size={18} />
            )}
            {loading ? "Đang lưu..." : "Cập nhật"}
          </button>

          <button
            disabled={!isDirty || loading}
            onClick={() => formInstance.setForm(initialForm)}
            className={`text-sm font-semibold md:col-span-2 flex p-2.5 gap-2 items-center justify-center rounded-md text-white transition-all
              ${
                isDirty
                  ? "bg-red-600 hover:bg-red-700 shadow-md"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            <SquareX size={18} />
            Hủy thay đổi
          </button>

          {/* Logic Toggle Khóa/Kích hoạt */}
          {formInstance.getFieldInForm("isActive") ? (
            <button
              type="button"
              disabled={loading}
              onClick={() => handleToggleActive(false)}
              className="text-sm font-semibold md:col-span-2 flex p-2.5 gap-2 bg-red-700 hover:bg-red-800 text-white items-center justify-center rounded-md shadow-md transition-all active:scale-95 disabled:bg-gray-400"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Lock size={18} />
              )}
              Khóa
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={() => handleToggleActive(true)}
              className="text-sm font-semibold md:col-span-2 flex p-2.5 gap-2 bg-green-700 hover:bg-green-800 text-white items-center justify-center rounded-md shadow-md transition-all active:scale-95 disabled:bg-gray-400"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Unlock size={18} />
              )}
              Kích hoạt
            </button>
          )}

          <button
            type="button"
            disabled={loading}
            onClick={() => setShowPasswordPopup(true)}
            className="text-sm font-semibold md:col-span-2 flex p-2.5 gap-2 bg-orange-700 hover:bg-orange-800 text-white items-center justify-center rounded-md shadow-md transition-all active:scale-95 disabled:bg-gray-400"
          >
            <RotateCcwKey size={18} />
            Đổi mật khẩu
          </button>
        </div>

        {/* --- Status Message --- */}
        {status.message && (
          <div
            className={`col-span-12 mt-4 flex items-center gap-2 p-3 rounded-md text-sm font-bold animate-in slide-in-from-top-2 duration-300 ${
              status.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            {status.message}
          </div>
        )}
      </div>

      <ChangePasswordPopup
        isOpen={showPasswordPopup}
        onClose={() => setShowPasswordPopup(false)}
        accountId={data?.accountId}
      />
    </>
  );
};

export default ChapterDetailForm;

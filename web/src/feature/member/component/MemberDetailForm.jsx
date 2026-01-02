import React, { useEffect, useState } from "react";
import AccountAvatar from "../../component/AccountAvatar";
import CustomInput from "../../component/custom/CustomInput";
import {
  RotateCcwKey,
  SquareX,
  UserPen,
  Loader2,
  CheckCircle,
  AlertCircle,
  Venus,
  Mars,
  ChevronDown,
} from "lucide-react";
import useForm from "../../../core/hooks/useForm";
import useMemberUpdate from "../hook/useMemberUpdate";
import { toDateInputValue } from "../../../utils/date";
import apiClient from "../../../utils/api";

// --- Sub-component: Change Password Popup ---
// (Giữ nguyên logic cũ của bạn)
const ChangePasswordPopup = ({ isOpen, onClose, accountId }) => {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleRecover = async () => {
    if (!newPassword || newPassword.length < 6) {
      setStatus({ type: "error", message: "Mật khẩu phải có ít nhất 6 ký tự" });
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
        message: error.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu",
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
            <RotateCcwKey className="w-5 h-5 text-amber-600" /> Đặt lại mật khẩu
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <SquareX className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Mật khẩu mới</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới..."
              className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
          </div>
          {status.message && (
            <div className={`p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${status.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {status.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {status.message}
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition-colors">Hủy</button>
            <button onClick={handleRecover} disabled={loading} className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 disabled:bg-gray-400 disabled:shadow-none transition-all">
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Xác nhận"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const MemberDetailForm = ({ data }) => {
  const formInstance = useForm();
  const { updateMember } = useMemberUpdate();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [errors, setErrors] = useState({});
  const [initialForm, setInitialForm] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);

  // 1. Lấy thông tin Chi đoàn từ LocalStorage
  const myAccountRaw = localStorage.getItem("my_account");
  const myAccount = myAccountRaw ? JSON.parse(myAccountRaw) : null;
  const isChapterAdmin = myAccount?.type === "chapter";
  const myChapterId = myAccount?.chapter?._id;
  const myChapterName = myAccount?.chapter?.name;

  const requiredFields = {
    username: "Tên đăng nhập",
    email: "Email",
    phoneNumber: "Số điện thoại",
    fullName: "Họ và tên",
    chapterId: "Chi đoàn",
    gender: "Giới tính",
    dateOfBirth: "Ngày sinh",
    hometown: "Quê quán",
    address: "Địa chỉ",
    ethnicity: "Dân tộc",
    religion: "Tôn giáo",
    education: "Học vấn",
    qualification: "Trình độ chuyên môn",
    politicalTheory: "Lý luận chính trị",
    memberCode: "Mã đoàn viên",
    joinedAt: "Ngày vào đoàn",
    position: "Chức vụ",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    formInstance.handleChangeFieldInForm(name, value);
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const fetchChapters = async () => {
    // Nếu là admin chi đoàn, không cần fetch danh sách chi đoàn khác
    if (isChapterAdmin) return;
    
    try {
      const res = await apiClient.get("/api/chapters");
      const formattedChapters = res.data.chapters.map((item) => ({
        id: item._id,
        name: item.name,
      }));
      setChapters(formattedChapters);
    } catch (error) {
      console.error("Lỗi khi tải danh sách chi đoàn:", error);
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    Object.keys(requiredFields).forEach((key) => {
      if (!formInstance.getFieldInForm(key)) {
        newErrors[key] = `${requiredFields[key]} không được để trống`;
      }
    });

    const email = formInstance.getFieldInForm("email");
    if (email && !emailRegex.test(email)) newErrors.email = "Email không hợp lệ";

    const phone = formInstance.getFieldInForm("phoneNumber");
    if (phone && !phoneRegex.test(phone)) newErrors.phoneNumber = "Số điện thoại không hợp lệ (10–15 số)";

    const dob = formInstance.getFieldInForm("dateOfBirth");
    if (dob && new Date(dob) > new Date()) newErrors.dateOfBirth = "Ngày sinh không hợp lệ";

    const fullName = formInstance.getFieldInForm("fullName");
    if (fullName && /\d/.test(fullName)) newErrors.fullName = "Tên không được chứa số";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    setLoading(true);
    setStatus({ type: "", message: "" });
    try {
      const response = await updateMember(data.id, formInstance.form);
      if (response.success) {
        setStatus({ type: "success", message: "Cập nhật đoàn viên thành công!" });
        setInitialForm(formInstance.form);
        setIsDirty(false);
      } else {
        setStatus({ type: "error", message: response.message || "Có lỗi xảy ra" });
      }
    } catch (e) {
      setStatus({ type: "error", message: e.message || "Có lỗi xảy ra" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = {
      username: data?.username || "",
      password: "",
      email: data?.email || "",
      phoneNumber: data?.phoneNumber || "",
      fullName: data?.fullName || "",
      // Nếu là ChapterAdmin thì ép dùng myChapterId, ngược lại dùng chapterId từ data
      chapterId: isChapterAdmin ? myChapterId : (data?.chapterId || ""),
      gender: data?.gender || "",
      dateOfBirth: toDateInputValue(data?.dateOfBirth),
      hometown: data?.hometown || "",
      address: data?.address || "",
      ethnicity: data?.ethnicity || "",
      religion: data?.religion || "",
      education: data?.education || "",
      qualification: data?.qualification || "",
      politicalTheory: data?.politicalTheory || "",
      memberCode: data?.memberCode || "",
      joinedAt: toDateInputValue(data?.joinedAt),
      position: data?.position || "",
    };
    formInstance.setForm(init);
    setInitialForm(init);
  }, [data, isChapterAdmin, myChapterId]);

  useEffect(() => {
    fetchChapters();
  }, [isChapterAdmin]);

  useEffect(() => {
    setIsDirty(JSON.stringify(formInstance.form) !== JSON.stringify(initialForm));
  }, [formInstance.form, initialForm]);

  return (
    <>
      <div className="grid grid-cols-12 gap-x-6 gap-y-4 border border-gray-200 rounded-md p-6 shadow-md bg-white">
        {/* Avatar Section */}
        <div className="col-span-12 flex items-center justify-center mb-4">
          <AccountAvatar id={data?.accountId} defaultSrc={data?.avatar} />
        </div>

        <div className="col-span-12 text-xl font-bold text-gray-800 border-b pb-2 mb-2">
          THÔNG TIN TÀI KHOẢN
        </div>

        <CustomInput className="col-span-12 md:col-span-4" label="Tên đăng nhập" name="username" value={formInstance.getFieldInForm("username")} onChange={handleChange} error={errors.username} />
        <CustomInput className="col-span-12 md:col-span-5" label="Email" name="email" value={formInstance.getFieldInForm("email")} onChange={handleChange} error={errors.email} />
        <CustomInput className="col-span-12 md:col-span-3" label="Số điện thoại" name="phoneNumber" value={formInstance.getFieldInForm("phoneNumber")} onChange={handleChange} error={errors.phoneNumber} />

        <div className="col-span-12 text-xl font-bold text-gray-800 border-b pb-2 mt-4 mb-2">
          THÔNG TIN ĐOÀN VIÊN
        </div>

        <CustomInput className="col-span-12 md:col-span-4" label="Họ và tên" name="fullName" value={formInstance.getFieldInForm("fullName")} onChange={handleChange} error={errors.fullName} />

        {/* Chapter Selection Logic */}
        <div className="col-span-12 md:col-span-4">
          <label className="text-sm font-medium block text-gray-700 mb-1.5">
            Chi đoàn sinh hoạt
          </label>
          <div className="relative h-10 text-sm">
            {isChapterAdmin ? (
              // Nếu là ChapterAdmin: Khóa trường này, chỉ hiển thị tên chi đoàn hiện tại
              <div className="w-full h-full pl-2 flex items-center bg-gray-100 border border-gray-300 rounded-lg text-gray-600 font-medium">
                {myChapterName}
              </div>
            ) : (
              // Nếu không phải ChapterAdmin: Hiển thị dropdown như cũ
              <>
                <select
                  name="chapterId"
                  value={formInstance.getFieldInForm("chapterId")}
                  onChange={handleChange}
                  className={`w-full h-full pl-2 bg-gray-50 border rounded-lg appearance-none outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${errors.chapterId ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">-- Chọn chi đoàn --</option>
                  {chapters.map((chapter) => (
                    <option key={chapter.id} value={chapter.id}>{chapter.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </>
            )}
          </div>
          {errors.chapterId && <div className="text-red-600 text-xs mt-1">{errors.chapterId}</div>}
        </div>

        {/* Gender Section */}
        <div className="col-span-12 md:col-span-4">
          <label className="text-sm font-medium mb-1.5 block text-gray-700">Giới tính</label>
          <div className="flex gap-2">
            {["Nam", "Nữ"].map((g) => {
              const isSelected = formInstance.getFieldInForm("gender") === g;
              const Icon = g === "Nam" ? Mars : Venus;
              const activeClass = isSelected ? (g === "Nam" ? "bg-sky-500 text-white border-sky-600" : "bg-pink-500 text-white border-pink-600") : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200";
              return (
                <label key={g} className={`flex-1 cursor-pointer px-4 py-2 rounded-lg border flex items-center justify-center gap-2 text-sm font-medium transition-all ${activeClass}`}>
                  <input type="radio" name="gender" value={g} checked={isSelected} onChange={handleChange} className="hidden" />
                  <Icon className="w-4 h-4" />
                  {g}
                </label>
              );
            })}
          </div>
        </div>

        {/* Other Inputs (Giữ nguyên) */}
        <CustomInput className="col-span-12 md:col-span-4" label="Ngày sinh" type="date" name="dateOfBirth" value={formInstance.getFieldInForm("dateOfBirth")} onChange={handleChange} error={errors.dateOfBirth} />
        <CustomInput className="col-span-12 md:col-span-4" label="Ngày vào đoàn" type="date" name="joinedAt" value={formInstance.getFieldInForm("joinedAt")} onChange={handleChange} error={errors.joinedAt} />
        <CustomInput className="col-span-12 md:col-span-4" label="Mã đoàn viên" name="memberCode" value={formInstance.getFieldInForm("memberCode")} onChange={handleChange} error={errors.memberCode} />
        <CustomInput className="col-span-12 md:col-span-6" label="Quê quán" name="hometown" value={formInstance.getFieldInForm("hometown")} onChange={handleChange} error={errors.hometown} />
        <CustomInput className="col-span-12 md:col-span-6" label="Địa chỉ" name="address" value={formInstance.getFieldInForm("address")} onChange={handleChange} error={errors.address} />
        <CustomInput className="col-span-12 md:col-span-4" label="Dân tộc" name="ethnicity" value={formInstance.getFieldInForm("ethnicity")} onChange={handleChange} error={errors.ethnicity} />
        <CustomInput className="col-span-12 md:col-span-4" label="Tôn giáo" name="religion" value={formInstance.getFieldInForm("religion")} onChange={handleChange} error={errors.religion} />
        <CustomInput className="col-span-12 md:col-span-4" label="Học vấn" name="education" value={formInstance.getFieldInForm("education")} onChange={handleChange} error={errors.education} />
        <CustomInput className="col-span-12 md:col-span-4" label="Trình độ chuyên môn" name="qualification" value={formInstance.getFieldInForm("qualification")} onChange={handleChange} error={errors.qualification} />
        <CustomInput className="col-span-12 md:col-span-4" label="Lý luận chính trị" name="politicalTheory" value={formInstance.getFieldInForm("politicalTheory")} onChange={handleChange} error={errors.politicalTheory} />
        <CustomInput className="col-span-12 md:col-span-4" label="Chức vụ" name="position" value={formInstance.getFieldInForm("position")} onChange={handleChange} error={errors.position} />

        {/* Action Buttons */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-6 gap-3 mt-6">
          <button onClick={handleUpdate} disabled={loading || !isDirty} className={`md:col-start-1 md:col-span-2 flex items-center justify-center p-2.5 gap-2 rounded-lg text-white font-semibold transition-all ${isDirty && !loading ? "bg-blue-600 hover:bg-blue-700 shadow-md" : "bg-gray-400 cursor-not-allowed"}`}>
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <UserPen className="w-5 h-5" />}
            {loading ? "Đang cập nhật..." : "Cập nhật thông tin"}
          </button>
          <button disabled={!isDirty || loading} onClick={() => formInstance.setForm(initialForm)} className={`md:col-span-2 flex items-center justify-center p-2.5 gap-2 rounded-lg text-white font-semibold transition-all ${isDirty ? "bg-red-500 hover:bg-red-600 shadow-md" : "bg-gray-400 cursor-not-allowed"}`}>
            <SquareX className="w-5 h-5" /> Hủy thay đổi
          </button>
          <button type="button" onClick={() => setShowPasswordPopup(true)} className="md:col-span-2 flex items-center justify-center p-2.5 gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-md transition-all active:scale-95">
            <RotateCcwKey className="w-5 h-5" /> Đổi mật khẩu
          </button>
        </div>

        {/* Success/Error Status */}
        {status.message && (
          <div className={`col-span-12 mt-4 flex items-center gap-3 p-3 rounded-lg text-sm font-bold animate-in fade-in duration-300 ${status.type === "success" ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"}`}>
            {status.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {status.message}
          </div>
        )}
      </div>

      <ChangePasswordPopup isOpen={showPasswordPopup} onClose={() => setShowPasswordPopup(false)} accountId={data?.accountId} />
    </>
  );
};

export default MemberDetailForm;
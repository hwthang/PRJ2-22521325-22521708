import React, { useEffect, useState } from "react";
import {
  PlusSquare,
  Loader2,
  CheckCircle,
  AlertCircle,
  Venus,
  Mars,
  ChevronDown,
} from "lucide-react";
import useForm from "../../../core/hooks/useForm";
import CustomInput from "../../component/custom/CustomInput";
import CustomPassword from "../../component/custom/CustomPassword";
import useMemberCreate from "../hook/useMemberCreate";
import apiClient from "../../../utils/api";

const MemberCreateForm = () => {
  const formInstance = useForm();
  const { createNewMember } = useMemberCreate();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [errors, setErrors] = useState({});
  const [chapters, setChapters] = useState([]);

  // 1. Lấy thông tin tài khoản từ localStorage
  const myAccountRaw = localStorage.getItem("my_account");
  const myAccount = myAccountRaw ? JSON.parse(myAccountRaw) : null;
  const isChapterAdmin = myAccount?.type === "chapter";
  const myChapterId = myAccount?.chapter?._id;
  const myChapterName = myAccount?.chapter?.name;

  const handleChange = (e) => {
    const { name, value } = e.target;
    formInstance.handleChangeFieldInForm(name, value);
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Fetch danh sách chi đoàn (chỉ khi không phải là admin chi đoàn)
  const fetchChapters = async () => {
    if (isChapterAdmin) return;
    try {
      const res = await apiClient.get("/api/chapters");
      const formatted = res.data.chapters.map((item) => ({
        id: item._id,
        name: item.name,
      }));
      setChapters(formatted);
    } catch (error) {
      console.error("Lỗi khi tải danh sách chi đoàn:", error);
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    const requiredFields = {
      username: "Tên đăng nhập",
      password: "Mật khẩu",
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

    Object.keys(requiredFields).forEach((key) => {
      if (!formInstance.getFieldInForm(key)) {
        newErrors[key] = `${requiredFields[key]} không được để trống`;
      }
    });

    const email = formInstance.getFieldInForm("email");
    if (email && !emailRegex.test(email)) newErrors.email = "Email không hợp lệ";

    const phone = formInstance.getFieldInForm("phoneNumber");
    if (phone && !phoneRegex.test(phone)) newErrors.phoneNumber = "Số điện thoại không hợp lệ";

    const pwd = formInstance.getFieldInForm("password");
    if (pwd && pwd.length < 6) newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const { success, message } = await createNewMember(formInstance.form);
      if (success) {
        setStatus({ type: "success", message: "Tạo đoàn viên thành công!" });
        formInstance.resetForm();
        // Sau khi reset, nếu là ChapterAdmin thì cần set lại chapterId mặc định
        if (isChapterAdmin) {
          formInstance.handleChangeFieldInForm("chapterId", myChapterId);
        }
      } else {
        setStatus({ type: "error", message: message || "Có lỗi xảy ra" });
      }
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Có lỗi xảy ra" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
    // 2. Tự động set Chi đoàn nếu là tài khoản Chapter
    if (isChapterAdmin && myChapterId) {
      formInstance.handleChangeFieldInForm("chapterId", myChapterId);
    }
  }, [isChapterAdmin, myChapterId]);

  return (
    <div className="grid grid-cols-12 gap-x-6 gap-y-3 border-gray-200 border p-6 rounded-md shadow bg-white">
      <div className="col-span-12 font-bold text-xl text-gray-800 border-b pb-2">THÔNG TIN TÀI KHOẢN</div>
      
      <CustomInput className="col-span-12 md:col-span-3" label="Tên đăng nhập" name="username" value={formInstance.getFieldInForm("username")} onChange={handleChange} error={errors.username} />
      <CustomPassword className="col-span-12 md:col-span-3" label="Mật khẩu" name="password" value={formInstance.getFieldInForm("password")} onChange={handleChange} error={errors.password} />
      <CustomInput className="col-span-12 md:col-span-3" label="Email" name="email" value={formInstance.getFieldInForm("email")} onChange={handleChange} error={errors.email} />
      <CustomInput className="col-span-12 md:col-span-3" label="Số điện thoại" name="phoneNumber" value={formInstance.getFieldInForm("phoneNumber")} onChange={handleChange} error={errors.phoneNumber} />

      <div className="col-span-12 font-bold text-xl mt-4 text-gray-800 border-b pb-2">THÔNG TIN ĐOÀN VIÊN</div>
      
      <CustomInput className="col-span-12 md:col-span-4" label="Họ và tên" name="fullName" value={formInstance.getFieldInForm("fullName")} onChange={handleChange} error={errors.fullName} />

      {/* Logic Chi đoàn sinh hoạt */}
      <div className="col-span-12 md:col-span-4">
        <label className="text-sm font-medium mb-2 block text-gray-700">Chi đoàn sinh hoạt</label>
        {isChapterAdmin ? (
          <div className="h-10 px-3 flex items-center bg-gray-100 border border-gray-300 rounded-lg text-gray-600 font-medium italic">
            {myChapterName}
          </div>
        ) : (
          <div className="relative h-10">
            <select
              name="chapterId"
              value={formInstance.getFieldInForm("chapterId")}
              onChange={handleChange}
              className={`w-full h-full pl-2 pr-8 bg-gray-50 border rounded-lg appearance-none outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                errors.chapterId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">-- Chọn chi đoàn --</option>
              {chapters.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        )}
        {errors.chapterId && <div className="text-red-600 text-xs mt-1">{errors.chapterId}</div>}
      </div>

      <div className="col-span-12 md:col-span-4">
        <label className="text-sm font-medium mb-2 block text-gray-700">Giới tính</label>
        <div className="flex gap-2">
          {["Nam", "Nữ"].map((g) => {
            const isSelected = formInstance.getFieldInForm("gender") === g;
            const Icon = g === "Nam" ? Mars : Venus;
            const bgClass = isSelected
              ? g === "Nam" ? "bg-sky-500 text-white border-sky-500" : "bg-pink-500 text-white border-pink-500"
              : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200";

            return (
              <label key={g} className={`cursor-pointer px-4 py-2 rounded-lg border w-full flex items-center justify-center gap-2 font-medium transition-all ${bgClass}`}>
                <input type="radio" name="gender" value={g} checked={isSelected} onChange={handleChange} className="hidden" />
                <Icon className="w-4 h-4" /> {g}
              </label>
            );
          })}
        </div>
        {errors.gender && <div className="text-red-600 text-xs mt-1">{errors.gender}</div>}
      </div>

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

      <div className="col-span-12 flex justify-center mt-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="min-w-[200px] flex p-3 gap-2 bg-blue-600 hover:bg-blue-700 items-center justify-center text-white rounded-lg font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <PlusSquare />}
          {loading ? "Đang xử lý..." : "Tạo đoàn viên"}
        </button>
      </div>

      {status.message && (
        <div className={`col-span-12 mt-4 flex items-center gap-3 p-3 rounded-lg text-sm font-bold animate-in fade-in duration-300 ${
          status.type === "success" ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"
        }`}>
          {status.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {status.message}
        </div>
      )}
    </div>
  );
};

export default MemberCreateForm;
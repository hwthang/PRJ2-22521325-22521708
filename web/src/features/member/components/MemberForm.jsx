import { CameraIcon, Eye, EyeClosed, Loader } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
// import ChapterService from "../services/ChapterService";
import defAvatar from "../../../core/assets/images/avatar.png";
import apiClient from "../../../utils/api";
import { toDateInputValue } from "../../../utils/date";
import { CheckOption } from "../../../core/components/CheckOption";

function MemberForm({ memberId = null }) {
  const [member, setMember] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [formValues, setFormValues] = useState({
    avatar: null,
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    fullName: "",
    dateOfBirth: "",
    gender: "",
    hometown: "",
    address: "",
    ethnicity: "",
    religion: "",
    education: "",
    qualification: "",
    politicalTheory: "",
    memberCode: "",
    joinedAt: "",
    position: "",
    status: "pending",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchMember = async () => {
      if (!memberId) return;
      setLoading(true);
      try {
        const res = await apiClient.get(`/api/members/${memberId}`);
        const data = res.data;
        setMember(data);
        if (data) {
          setFormValues((prev) => ({
            ...prev,
            avatar: data?.accountId?.avatar || null,
            username: data?.accountId?.username || "",
            email: data?.accountId?.email || "",
            phoneNumber: data?.accountId?.phoneNumber || "",
            password: data?.accountId?.password || "",
            fullName: data.fullName || "",
            dateOfBirth: toDateInputValue(data.dateOfBirth) || "",
            gender: data.gender || "",
            hometown: data.hometown || "",
            address: data.address || "",
            ethnicity: data.ethnicity || "",
            religion: data.religion || "",
            education: data.education || "",
            qualification: data.qualification || "",
            politicalTheory: data.politicalTheory || "",
            memberCode: data.memberCode || "",
            joinedAt: toDateInputValue(data.joinedAt) || "",
            position: data.position || "",
             chapterId: data.chapterId || "",
            status: data?.accountId?.status || "pending",
          }));
        }
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải dữ liệu chi đoàn");
      } finally {
        setLoading(false);
      }
    };
    const fetchChapters = async (params) => {
      const response = await apiClient.get("/api/chapters");
      const data = response.data; // data từ backend
      console.log(data);
      setChapters(data.map((item) => ({ id: item._id, name: item.name })));
    };
    fetchMember();
    fetchChapters();
  }, [memberId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files?.length) {
      setFormValues((prev) => ({ ...prev, avatar: files[0] }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  };

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
    if (!memberId && !formValues.password)
      newErrors.password = "Mật khẩu là bắt buộc";
    else if (!memberId && formValues.password && formValues.password.length < 6)
      newErrors.password = "Mật khẩu tối thiểu 6 ký tự";
    if (!formValues.fullName.trim())
      newErrors.fullName = "Họ và tên là bắt buộc";
    if (!formValues.hometown.trim())
      newErrors.hometown = "Quê quán là bắt buộc";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildFormData = () => {
    const formData = new FormData();
    Object.keys(formValues).forEach((key) => {
      if (key === "avatar" && formValues.avatar instanceof File) {
        formData.append(key, formValues.avatar);
      } else if (formValues[key] !== undefined && formValues[key] !== null) {
        formData.append(key, formValues[key]);
      }
    });
    return formData;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const formData = buildFormData();
      const res = memberId
        ? await apiClient.put(`/api/members/${memberId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await apiClient.post("/api/members", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      toast.success(
        memberId ? "Lưu thay đổi thành công" : "Thêm chi đoàn thành công"
      );

      if (!memberId) {
        setFormValues({
          avatar: null,
          username: "",
          email: "",
          phoneNumber: "",
          password: "",
          fullName: "",
          dateOfBirth: "",
          gender: "",
          hometown: "",
          address: "",
          ethnicity: "",
          religion: "",
          education: "",
          qualification: "",
          politicalTheory: "",
          memberCode: "",
          joinedAt: "",
          position: "",
          status: "pending",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(
        memberId ? "Lưu thay đổi thất bại" : "Thêm chi đoàn thất bại"
      );
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
                  : formValues.avatar?.path || defAvatar
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
        <div className="col-span-12 flex flex-col gap-1 md:col-span-2">
          <label className="font-semibold">Tên đăng nhập</label>
          <input
            name="username"
            value={formValues.username}
            onChange={handleChange}
            className="border h-10 rounded-md border-gray-300 px-4 outline-none bg-transparent"
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}
        </div>
        {/* Email */}
        <div className="col-span-12 flex flex-col gap-1 md:col-span-4">
          <label className="font-semibold">Email</label>
          <input
            name="email"
            value={formValues.email}
            onChange={handleChange}
            className="border h-10 rounded-md border-gray-300 px-4 outline-none bg-transparent"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>
        {/* Phone */}
        <div className="col-span-12 flex flex-col gap-1 md:col-span-2">
          <label className="font-semibold">Số điện thoại</label>
          <input
            name="phoneNumber"
            value={formValues.phoneNumber}
            onChange={handleChange}
            className="border h-10 rounded-md border-gray-300 px-4 outline-none bg-transparent"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
          )}
        </div>
        {/* Password */}
        <div className="col-span-12 flex flex-col gap-1 md:col-span-4">
          <label className="font-semibold">Mật khẩu</label>
          <div className="border h-10 rounded-md border-gray-300 px-4 flex items-center gap-2">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
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
        {/* Full Name */}
        <div className="col-span-12 flex flex-col gap-1 md:col-span-4">
          <label className="font-semibold">Họ và tên</label>
          <input
            name="fullName"
            value={formValues.fullName}
            onChange={handleChange}
            className="border h-10 rounded-md border-gray-300 px-4 outline-none bg-transparent"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName}</p>
          )}
        </div>
        {/* Date of Birth */}
        <div className="col-span-12 flex flex-col gap-1 md:col-span-2">
          <label className="font-semibold">Ngày sinh</label>
          <input
            name="dateOfBirth"
            type="date"
            value={formValues.dateOfBirth}
            onChange={handleChange}
            className="border h-10 rounded-md border-gray-300 px-4 outline-none bg-transparent"
          />
        </div>
        {/* Gender */}
        <div className="col-span-12 md:col-span-2">
          <label className="font-semibold">Giới tính</label>
          <CheckOption
            options={["Nam", "Nữ"]}
            value={formValues.gender}
            onChange={(val) => setFormValues({ ...formValues, gender: val })}
            colors={{ Nam: "sky", Nữ: "pink" }}
            disabled={false}
          />
        </div>
        <div className="col-span-12 flex flex-col gap-1 md:col-span-4">
          {" "}
          <label className="font-semibold">Quê quán</label>{" "}
          <input
            name="hometown"
            value={formValues.hometown || ""}
            onChange={handleChange}
            className="border h-10 rounded-md border-gray-300 px-4 outline-none bg-transparent"
          />{" "}
        </div>{" "}
        <div className="col-span-12 flex flex-col gap-1 md:col-span-4">
          {" "}
          <label className="font-semibold">Địa chỉ</label>{" "}
          <input
            name="address"
            value={formValues.address || ""}
            onChange={handleChange}
            className="border h-10 rounded-md border-gray-300 px-4 outline-none bg-transparent"
          />{" "}
        </div>{" "}
        <div className="col-span-12 flex flex-col gap-1 md:col-span-2">
          {" "}
          <label className="font-semibold">Dân tộc</label>{" "}
          <input
            name="ethnicity"
            value={formValues.ethnicity || ""}
            onChange={handleChange}
            className="border h-10 rounded-md border-gray-300 px-4 outline-none bg-transparent"
          />{" "}
        </div>{" "}
        <div className="col-span-12 flex flex-col gap-1 md:col-span-2">
          {" "}
          <label className="font-semibold">Tôn giáo</label>{" "}
          <input
            name="religion"
            value={formValues.religion || ""}
            onChange={handleChange}
            className="border h-10 rounded-md border-gray-300 px-4 outline-none bg-transparent"
          />{" "}
        </div>{" "}
        {/* Trình độ học vấn */}{" "}
        <div className="col-span-12 flex flex-col gap-1 md:col-span-4">
          {" "}
          <label className="font-semibold">Trình độ học vấn</label>{" "}
          <select
            name="education"
            value={formValues.education || ""}
            onChange={handleChange}
            className="border h-10 rounded-md border-gray-300 px-4 outline-none bg-transparent"
          >
            {" "}
            <option value="" disabled>
              {" "}
              Chọn trình độ học vấn{" "}
            </option>{" "}
            <option value="Tiểu học">Tiểu học</option>{" "}
            <option value="Trung học cơ sở">Trung học cơ sở</option>{" "}
            <option value="Trung học phổ thông hệ 10/10">
              {" "}
              Trung học phổ thông hệ 10/10{" "}
            </option>{" "}
            <option value="Hệ 12/12">Hệ 12/12</option>{" "}
          </select>{" "}
        </div>{" "}
        {/* Trình độ chuyên môn */}{" "}
        <div className="col-span-12 flex flex-col gap-1 md:col-span-4">
          {" "}
          <label className="font-semibold">Trình độ chuyên môn</label>{" "}
          <select
            name="qualification"
            value={formValues.qualification || ""}
            onChange={handleChange}
            className="border h-10 rounded-md border-gray-300 px-4 outline-none bg-transparent"
          >
            {" "}
            <option value="" disabled>
              {" "}
              Chọn trình độ chuyên môn{" "}
            </option>{" "}
            <option value="Sơ cấp">Sơ cấp</option>{" "}
            <option value="Trung cấp chuyên nghiệp">
              {" "}
              Trung cấp chuyên nghiệp{" "}
            </option>{" "}
            <option value="Cao đẳng">Cao đẳng</option>{" "}
            <option value="Cử nhân">Cử nhân</option>{" "}
            <option value="Thạc sĩ">Thạc sĩ</option>{" "}
            <option value="Tiến sĩ">Tiến sĩ</option>{" "}
            <option value="Chưa có">Chưa có</option>{" "}
          </select>{" "}
        </div>{" "}
        {/* Lý luận chính trị */}{" "}
        <div className="col-span-12 flex flex-col gap-1 md:col-span-4">
          {" "}
          <label className="font-semibold">Lý luận chính trị</label>{" "}
          <select
            name="politicalTheory"
            value={formValues.politicalTheory || ""}
            onChange={handleChange}
            className="border h-10 rounded-md border-gray-300 px-4 outline-none bg-transparent"
          >
            {" "}
            <option value="" disabled>
              {" "}
              Chọn lý luận chính trị{" "}
            </option>{" "}
            <option value="Chưa có">Chưa có</option>{" "}
            <option value="Sơ cấp">Sơ cấp</option>{" "}
            <option value="Trung cấp">Trung cấp</option>{" "}
            <option value="Cao cấp">Cao cấp</option>{" "}
            <option value="Cử nhân">Cử nhân</option>{" "}
          </select>{" "}
        </div>{" "}
        <div className="col-span-12 flex flex-col gap-1 md:col-span-2">
          {" "}
          <label className="font-semibold">Số thẻ đoàn</label>{" "}
          <input
            name="memberCode"
            value={formValues.memberCode || ""}
            onChange={handleChange}
            className="border h-10 rounded-md border-gray-300 px-4 outline-none bg-transparent"
          />{" "}
        </div>{" "}
        <div className="col-span-12 flex flex-col gap-1 md:col-span-2">
          {" "}
          <label className="font-semibold">Ngày vào đoàn</label>{" "}
          <input
            name="joinedAt"
            type="date"
            value={formValues.joinedAt || ""}
            onChange={handleChange}
            className="border h-10 rounded-md border-gray-300 px-4 outline-none bg-transparent"
          />{" "}
        </div>{" "}
        <div className="col-span-12 flex flex-col gap-1 md:col-span-4">
          {" "}
          <label className="font-semibold">Chức vụ</label>{" "}
          <select
            name="position"
            value={formValues.position || ""}
            onChange={handleChange}
            className="border h-10 rounded-md border-gray-300 px-4 outline-none bg-transparent"
          >
            {" "}
            <option value="" disabled>
              {" "}
              Chọn chức vụ{" "}
            </option>{" "}
            <option value="Chưa có">Bí thư</option>{" "}
            <option value="Sơ cấp">Phó Bí thư</option>{" "}
            <option value="Trung cấp">Ủy viên Ban chấp hành</option>{" "}
            <option value="Cao cấp">Đoàn viên</option>{" "}
          </select>{" "}
        </div>
        <div className="col-span-12 flex flex-col gap-1 md:col-span-8">
          {" "}
          <label className="font-semibold">Chi đoàn sinh hoạt</label>{" "}
          <select
            name="chapterId"
            value={formValues.chapterId || ""}
            onChange={handleChange}
            className="border h-10 rounded-md border-gray-300 px-4 outline-none bg-transparent"
          >
            {" "}
            <option value="" disabled>
              {" "}
              Chọn chi đoàn sinh hoạt{" "}
            </option>{" "}
           {chapters.map(chapter => <option key={chapter.id} value={chapter.id}>{chapter.name}</option>)}
          </select>{" "}
        </div>
        <div className="col-span-12 flex flex-wrap gap-6 md:col-span-8 items-center justify-center mt-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-500 text-white h-10 min-w-fit flex-1 px-4 rounded-md flex items-center justify-center gap-2"
          >
            {loading && <Loader className="animate-spin w-4 h-4" />}
            {memberId ? "Lưu thay đổi" : "Thêm mới"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MemberForm;

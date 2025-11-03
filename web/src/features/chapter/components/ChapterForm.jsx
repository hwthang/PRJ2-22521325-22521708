import { CameraIcon, Eye, EyeClosed, Loader } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ChapterService from "../services/ChapterService";
import defAvatar from "../../../core/assets/images/avatar.png";
import apiClient from "../../../utils/api";
import { toDateInputValue } from "../../../utils/date";

function ChapterForm({ chapterId = null }) {
  const [chapter, setChapter] = useState(null);
  const [formValues, setFormValues] = useState({
    avatar: null, // Có thể là File hoặc object { path, ... }
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    establishedAt: "",
    name: "",
    affiliated: "",
    address: "",
    status: "pending",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Load dữ liệu chi đoàn nếu có chapterId
  useEffect(() => {
    const fetchChapter = async () => {
      if (!chapterId) return;
      setLoading(true);
      try {
        const res = await apiClient.get(`/api/chapters/${chapterId}`);
        const data = res.data;

        setChapter(data);
        if (data) {
          setFormValues({
            avatar: data?.accountId?.avatar || null,
            username: data?.accountId?.username || "",
            email: data?.accountId?.email || "",
            phoneNumber: data?.accountId?.phoneNumber || "",
            password: data?.accountId?.password|| "",
            establishedAt: toDateInputValue(data.establishedAt) || "",
            name: data.name || "",
            affiliated: data.affiliated || "",
            address: data.address || "",
            status: data?.accountId?.status || "pending",
          });
        }
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải dữ liệu chi đoàn");
      } finally {
        setLoading(false);
      }
    };
    fetchChapter();
  }, [chapterId]);

  // Xử lý input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files?.length) {
      setFormValues((prev) => ({ ...prev, avatar: files[0] }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
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

    if (!chapterId && !formValues.password)
      newErrors.password = "Mật khẩu là bắt buộc";
    else if (
      !chapterId &&
      formValues.password &&
      formValues.password.length < 6
    )
      newErrors.password = "Mật khẩu tối thiểu 6 ký tự";

    if (!formValues.name.trim()) newErrors.name = "Tên chi đoàn là bắt buộc";
    if (!formValues.affiliated.trim())
      newErrors.affiliated = "Đoàn trực thuộc là bắt buộc";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Build FormData cho create/update
  const buildFormData = () => {
    const formData = new FormData();
    Object.keys(formValues).forEach((key) => {
      if (key === "avatar") {
        if (formValues.avatar instanceof File) {
          formData.append(key, formValues.avatar);
        }
        // Nếu avatar là object, backend có thể dùng path cũ, không cần append File
      } else if (formValues[key] !== undefined && formValues[key] !== null) {
        formData.append(key, formValues[key]);
      }
    });
    return formData;
  };

  // Tạo hoặc cập nhật chi đoàn
  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const formData = buildFormData();
      const res = chapterId
        ? await apiClient.put(`/api/chapters/${chapterId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await apiClient.post("/api/chapters", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      toast.success(
        chapterId ? "Lưu thay đổi thành công" : "Thêm chi đoàn thành công"
      );

      if (!chapterId) {
        setFormValues({
          avatar: null,
          username: "",
          email: "",
          phoneNumber: "",
          password: "",
          establishedAt: "",
          name: "",
          affiliated: "",
          address: "",
          status: "pending",
        });
      } else {
        setFormValues((prev) => ({
          ...prev,
          avatar: res.avatar || prev.avatar,
          status: res.status || prev.status,
        }));
      }
    } catch (error) {
      console.error(error);
      toast.error(
        chapterId ? "Lưu thay đổi thất bại" : "Thêm chi đoàn thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  // Kích hoạt chi đoàn
  const handleActivate = async () => {
    if (!chapterId) return;
    setLoading(true);
    try {
      await ChapterService.activateChapter(chapterId);
      toast.success("Kích hoạt chi đoàn thành công");
      setFormValues((prev) => ({ ...prev, status: "active" }));
    } catch (error) {
      console.error(error);
      toast.error("Kích hoạt chi đoàn thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Khóa chi đoàn
  const handleLock = async () => {
    if (!chapterId) return;
    setLoading(true);
    try {
      await ChapterService.lockChapter(chapterId);
      toast.success("Khóa chi đoàn thành công");
      setFormValues((prev) => ({ ...prev, status: "locked" }));
    } catch (error) {
      console.error(error);
      toast.error("Khóa chi đoàn thất bại");
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

        {/* Other fields: establishedAt, name, affiliated, address */}
        <div className="col-span-12 flex flex-col gap-1 md:col-span-2">
          <label className="font-semibold">Ngày thành lập</label>
          <input
            type="date"
            name="establishedAt"
            value={formValues.establishedAt}
            onChange={handleChange}
            className="border h-10 rounded-md border-gray-300 px-4 outline-none bg-transparent"
          />
        </div>

        <div className="col-span-12 flex flex-col gap-1 md:col-span-6">
          <label className="font-semibold">Tên chi đoàn</label>
          <input
            name="name"
            value={formValues.name}
            onChange={handleChange}
            className="border h-10 rounded-md border-gray-300 px-4 outline-none bg-transparent"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="col-span-12 flex flex-col gap-1 md:col-span-4">
          <label className="font-semibold">Đoàn trực thuộc</label>
          <textarea
            name="affiliated"
            value={formValues.affiliated}
            onChange={handleChange}
            className="border h-20 resize-none rounded-md border-gray-300 p-2 outline-none bg-transparent"
          />
          {errors.affiliated && (
            <p className="text-red-500 text-sm">{errors.affiliated}</p>
          )}
        </div>

        <div className="col-span-12 flex flex-col gap-1 md:col-span-4">
          <label className="font-semibold">Địa chỉ</label>
          <textarea
            name="address"
            value={formValues.address}
            onChange={handleChange}
            className="border h-20 resize-none rounded-md border-gray-300 p-2 outline-none bg-transparent"
          />
        </div>

        {/* Buttons */}
        <div className="col-span-12 flex flex-wrap gap-6 md:col-span-8 items-center justify-center mt-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-500 text-white h-10 min-w-fit flex-1 px-4 rounded-md flex items-center justify-center gap-2"
          >
            {loading && <Loader className="animate-spin w-4 h-4" />}
            {chapterId ? "Lưu thay đổi" : "Thêm mới"}
          </button>

          {/* {chapterId && formValues.status !== "active" && (
            <button
              onClick={handleActivate}
              disabled={loading}
              className="bg-green-500 text-white h-10 min-w-fit flex-1 px-4 rounded-md flex items-center justify-center gap-2"
            >
              {loading && <Loader className="animate-spin w-4 h-4" />}
              Kích hoạt
            </button>
          )}

          {chapterId && formValues.status === "active" && (
            <button
              onClick={handleLock}
              disabled={loading}
              className="bg-red-500 text-white h-10 min-w-fit flex-1 px-4 rounded-md flex items-center justify-center gap-2"
            >
              {loading && <Loader className="animate-spin w-4 h-4" />}
              Khóa
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default ChapterForm;

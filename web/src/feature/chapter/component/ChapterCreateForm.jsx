import React, { useState } from "react";
import CustomInput from "../../component/custom/CustomInput";
import CustomPassword from "../../component/custom/CustomPassword";
import CustomTextArea from "../../component/custom/CustomTextArea";
import { PlusSquare, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import useForm from "../../../core/hooks/useForm";
import useChapterCreate from "../hook/useChapterCreate";
import { CHAPTER_AFFILIATED } from "../shared/ChapterMap";

const ChapterCreateForm = () => {
  const formInstance = useForm();
  const { createNewChapter } = useChapterCreate();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [errors, setErrors] = useState({}); // state lưu lỗi validate

  const handleChange = (e) => {
    const { name, value } = e.target;
    formInstance.handleChangeFieldInForm(name, value);
    setErrors((prev) => ({ ...prev, [name]: "" })); // xóa lỗi khi user sửa
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/; // tùy chuẩn bạn muốn

    if (!formInstance.getFieldInForm("username")) {
      newErrors.username = "Tên đăng nhập không được để trống";
    }

    if (!formInstance.getFieldInForm("email")) {
      newErrors.email = "Email không được để trống";
    } else if (!emailRegex.test(formInstance.getFieldInForm("email"))) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formInstance.getFieldInForm("phoneNumber")) {
      newErrors.phoneNumber = "Số điện thoại không được để trống";
    } else if (!phoneRegex.test(formInstance.getFieldInForm("phoneNumber"))) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    }

    if (!formInstance.getFieldInForm("password")) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (formInstance.getFieldInForm("password").length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formInstance.getFieldInForm("name")) {
      newErrors.name = "Tên chi đoàn không được để trống";
    }

    const affiliatedValue = formInstance.getFieldInForm("affiliated");
    if (!affiliatedValue) {
      newErrors.affiliated = "Đoàn trực thuộc không được để trống";
    } else if (!CHAPTER_AFFILIATED.includes(affiliatedValue)) {
      newErrors.affiliated = "Đoàn trực thuộc không hợp lệ";
    }

    if (!formInstance.getFieldInForm("establishedAt")) {
      newErrors.establishedAt = "Ngày thành lập không được để trống";
    }

    if (!formInstance.getFieldInForm("address")) {
      newErrors.address = "Địa chỉ không được để trống";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return; // nếu không hợp lệ, dừng submit

    setLoading(true);
    setStatus({ type: "", message: "" });
    try {
      const response = await createNewChapter(formInstance.form);

      if (response.success) {
        setStatus({ type: "success", message: "Tạo chi đoàn thành công!" });
      } else {
        setStatus({
          type: "error",
          message: response.message || "Có lỗi xảy ra",
        });
      }
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Có lỗi xảy ra" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-x-6 gap-y-2 border-gray-200 border shadow-md rounded-md p-6 ">
      <div className="col-span-12 font-medium text-xl">THÔNG TIN TÀI KHOẢN</div>

      <CustomInput
        className="col-span-12 md:col-span-3"
        label="Tên đăng nhập"
        name="username"
        value={formInstance.getFieldInForm("username")}
        onChange={handleChange}
        error={errors.username}
      />

      <CustomInput
        className="col-span-12 md:col-span-3"
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

      <CustomPassword
        className="col-span-12 md:col-span-3"
        label="Mật khẩu"
        name="password"
        value={formInstance.getFieldInForm("password")}
        onChange={handleChange}
        error={errors.password}
      />

      <div className="col-span-12 font-medium text-xl mt-4">
        THÔNG TIN CHI ĐOÀN
      </div>

      <CustomInput
        className="col-span-12 md:col-span-5"
        label="Tên chi đoàn"
        name="name"
        value={formInstance.getFieldInForm("name")}
        onChange={handleChange}
        error={errors.name}
      />

      <CustomInput
        className="col-span-12 md:col-span-4"
        label="Đoàn trực thuộc"
        name="affiliated"
        value={formInstance.getFieldInForm("affiliated")}
        onChange={handleChange}
        error={errors.affiliated}
        list={"affiliatedList"}
      />

      <datalist id="affiliatedList">
        {CHAPTER_AFFILIATED.map((item) => (
          <option value={item} />
        ))}
      </datalist>

      <CustomInput
        className="col-span-12 md:col-span-3"
        label="Ngày thành lập"
        type="date"
        name="establishedAt"
        value={formInstance.getFieldInForm("establishedAt")}
        onChange={handleChange}
        error={errors.establishedAt}
      />

      <CustomInput
        className="col-span-12"
        label="Địa chỉ"
        name="address"
        value={formInstance.getFieldInForm("address")}
        onChange={handleChange}
        error={errors.address}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="text-sm font-medium col-span-12 mt-4 h-fit md:col-start-6 md:col-span-2 flex p-2 gap-2 bg-blue-600 items-center justify-center text-white rounded-md active:bg-blue-500 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="animate-spin w-5 h-5" />
        ) : (
          <PlusSquare />
        )}
        {loading ? "Đang tạo..." : "Tạo chi đoàn"}
      </button>

      {status.message && (
        <div
          className={`col-span-12 mt-2 flex items-center gap-2 p-2 rounded-md text-sm font-medium ${
            status.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {status.type === "success" ? <CheckCircle /> : <AlertCircle />}
          {status.message}
        </div>
      )}
    </div>
  );
};

export default ChapterCreateForm;

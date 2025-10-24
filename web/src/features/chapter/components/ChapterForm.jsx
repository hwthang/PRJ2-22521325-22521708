import React, { useEffect } from "react";
import useForm from "../../../core/hooks/useForm";
import { toDateInputValue } from "../../../utils/date";
import ChapterService from "../services/ChapterService";
import Avatar from "../../../core/components/Avatar";
import { getStatusBadge, getTypeBadge } from "../../../utils/badge";
import address from "../../../utils/address";

function ChapterForm({ data, onSubmit, ...props }) {
  const [officeProvinces, setOfficeProvinces] = React.useState([]);
  const [officeCommunes, setOfficeCommunes] = React.useState([]);
  const [isEditing, setIsEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [pendingFormData, setPendingFormData] = React.useState(null);
  const [errors, setErrors] = React.useState({});

  const chapter = useForm();

  // Validation rules
  const validateRules = {
    username: {
      required: true,
      pattern: /^[a-zA-Z0-9_]{3,20}$/,
      message: "Tên đăng nhập phải từ 3-20 ký tự, chỉ chứa chữ cái, số và dấu _"
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Email không đúng định dạng"
    },
    name: {
      required: true,
      pattern: /^[a-zA-Z0-9À-ỹ\s.,-]{5,100}$/,
      message: "Tên chi đoàn phải từ 5-100 ký tự"
    },
    affiliated: {
      required: true,
      pattern: /^[a-zA-Z0-9À-ỹ\s.,-]{5,100}$/,
      message: "Tên đơn vị trực thuộc phải từ 5-100 ký tự"
    },
    office_detail: {
      pattern: /^[a-zA-Z0-9À-ỹ\s\/.,-]{0,200}$/,
      message: "Địa chỉ không được vượt quá 200 ký tự"
    }
  };

  const validateField = (name, value) => {
    const rule = validateRules[name];
    if (!rule) return true;

    let isValid = true;
    let errorMessage = "";

    if (rule.required && (!value || value.trim() === "")) {
      isValid = false;
      errorMessage = "Trường này là bắt buộc";
    } else if (rule.pattern && value && !rule.pattern.test(value)) {
      isValid = false;
      errorMessage = rule.message;
    } else if (rule.validate && value && !rule.validate(value)) {
      isValid = false;
      errorMessage = rule.message;
    }

    setErrors(prev => ({
      ...prev,
      [name]: isValid ? "" : errorMessage
    }));

    return isValid;
  };

  const validateForm = () => {
    const formData = prepareFormData();
    let isValid = true;
    const newErrors = {};

    Object.keys(validateRules).forEach(field => {
      const value = formData[field] || chapter.getFieldInForm(field);
      const rule = validateRules[field];
      
      if (rule.required && (!value || value.trim() === "")) {
        isValid = false;
        newErrors[field] = "Trường này là bắt buộc";
      } else if (rule.pattern && value && !rule.pattern.test(value)) {
        isValid = false;
        newErrors[field] = rule.message;
      } else if (rule.validate && value && !rule.validate(value)) {
        isValid = false;
        newErrors[field] = rule.message;
      }
    });

    // Additional validation for select fields
    const requiredSelectFields = ['office_province'];

    requiredSelectFields.forEach(field => {
      const value = chapter.getFieldInForm(field);
      if (!value) {
        isValid = false;
        newErrors[field] = "Trường này là bắt buộc";
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (name, value) => {
    if (isEditing) {
      chapter.handleChangeFieldInForm(name, value);
      // Validate field on change
      validateField(name, value);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    // Clear errors when starting to edit
    setErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Clear errors when canceling
    setErrors({});
    // Reset form to original data
    if (data) {
      chapter.setForm({
        username: data?.username || "",
        email: data?.email || "",
        name: data?.profile?.name || "",
        affiliated: data?.profile?.affiliated || "",
        establishedAt: toDateInputValue(data?.profile?.establishedAt) || "",
        office_province: data?.profile?.office?.province || "",
        office_commune: data?.profile?.office?.commune || "",
        office_detail: data?.profile?.office?.detail || "",
      });
    }
  };

  const prepareFormData = () => {
    return {
      username: chapter.getFieldInForm("username"),
      email: chapter.getFieldInForm("email"),
      name: chapter.getFieldInForm("name"),
      affiliated: chapter.getFieldInForm("affiliated"),
      establishedAt: chapter.getFieldInForm("establishedAt"),
      office: {
        province: chapter.getFieldInForm("office_province"),
        commune: chapter.getFieldInForm("office_commune"),
        detail: chapter.getFieldInForm("office_detail"),
      },
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEditing) return;

    // Validate entire form before submission
    if (!validateForm()) {
      alert("Vui lòng kiểm tra lại các trường thông tin");
      return;
    }

    const formData = prepareFormData();
    setPendingFormData(formData);
    setShowConfirmDialog(true);
  };

  const handleConfirmUpdate = async () => {
    setLoading(true);
    try {
      console.log("Submitted data:", pendingFormData);
      await ChapterService.update(data._id, pendingFormData);
      setIsEditing(false);
      setShowConfirmDialog(false);
      setPendingFormData(null);
      setErrors({}); // Clear errors after successful update
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelUpdate = () => {
    setShowConfirmDialog(false);
    setPendingFormData(null);
  };

  useEffect(() => {
    const fetchAddressData = async () => {
      const provinces = await address.getProvinces();
      setOfficeProvinces(provinces || []);
    };

    fetchAddressData();
  }, []);

  useEffect(() => {
    setOfficeCommunes(
      address.getCommunesByProvince(
        chapter.getFieldInForm("office_province") || ""
      )
    );
  }, [chapter.getFieldInForm("office_province")]);

  useEffect(() => {
    if (data) {
      chapter.setForm({
        username: data?.username || "",
        email: data?.email || "",
        name: data?.profile?.name || "",
        affiliated: data?.profile?.affiliated || "",
        establishedAt: toDateInputValue(data?.profile?.establishedAt) || "",
        office_province: data?.profile?.office?.province || "",
        office_commune: data?.profile?.office?.commune || "",
        office_detail: data?.profile?.office?.detail || "",
      });
    }
  }, [data]);

  const getInputClass = (isEditing, hasError = false) => {
    return `px-2 relative h-10 w-full border-2 rounded-lg transition-all ${
      hasError 
        ? "border-red-500 bg-red-50" 
        : `border-gray-300 ${isEditing
            ? "has-[input:focus]:border-blue-700 has-[select:focus]:border-blue-700 bg-white"
            : "bg-gray-100"}`
    }`;
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-12 gap-6 p-6">
          {/* Avatar và badges */}
          <div className="col-span-12 flex gap-6 justify-around flex-col md:col-span-2 md:row-span-4 rounded-lg">
            <Avatar userId={data?._id} src={data?.profile?.avatar?.path}/>
            <div className="flex gap-6 md:flex-col">
              <div className="justify-center items-center flex relative h-10 w-full rounded-lg transition-all">
                {getStatusBadge(data?.status)}
              </div>
              <div className="relative h-10 w-full justify-center items-center flex rounded-lg transition-all">
                {getTypeBadge(data?.profile?.type)}
              </div>
            </div>
          </div>

          {/* Thông tin đăng nhập */}
          <div className="col-span-12 flex gap-1 flex-col md:col-span-5">
            <label className="font-semibold">Tên đăng nhập</label>
            <div className={getInputClass(isEditing, errors.username)}>
              <input
                className="h-full w-full outline-none bg-transparent"
                value={chapter.getFieldInForm("username") || ""}
                onChange={(e) => handleChange("username", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            {errors.username && (
              <span className="text-red-500 text-sm">{errors.username}</span>
            )}
          </div>

          <div className="col-span-12 flex gap-1 flex-col md:col-span-5">
            <label className="font-semibold">Email</label>
            <div className={getInputClass(isEditing, errors.email)}>
              <input
                className="h-full w-full outline-none bg-transparent"
                value={chapter.getFieldInForm("email") || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          {/* Thông tin chi đoàn */}
          <div className="col-span-12 flex gap-1 flex-col md:col-span-4">
            <label className="font-semibold">Tên chi đoàn</label>
            <div className={getInputClass(isEditing, errors.name)}>
              <input
                className="h-full w-full outline-none bg-transparent"
                value={chapter.getFieldInForm("name") || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </div>

          <div className="col-span-12 flex gap-1 flex-col md:col-span-4">
            <label className="font-semibold">Đơn vị trực thuộc</label>
            <div className={getInputClass(isEditing, errors.affiliated)}>
              <input
                className="h-full w-full outline-none bg-transparent"
                value={chapter.getFieldInForm("affiliated") || ""}
                onChange={(e) => handleChange("affiliated", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            {errors.affiliated && (
              <span className="text-red-500 text-sm">{errors.affiliated}</span>
            )}
          </div>

          <div className="col-span-12 flex gap-1 flex-col md:col-span-2">
            <label className="font-semibold">Ngày thành lập</label>
            <div className={getInputClass(isEditing)}>
              <input
                type="date"
                className="h-full w-full outline-none bg-transparent"
                value={chapter.getFieldInForm("establishedAt") || ""}
                onChange={(e) => handleChange("establishedAt", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Địa chỉ trụ sở */}
          <div className="col-span-12 flex gap-1 flex-col md:col-span-10">
            <label className="font-semibold">Địa chỉ trụ sở</label>
            <div className="relative w-full grid md:grid-cols-3 gap-6 rounded-lg transition-all">
              <div className={getInputClass(isEditing, errors.office_province)}>
                <select
                  className="w-full h-full outline-none bg-transparent"
                  value={chapter.getFieldInForm("office_province") || ""}
                  onChange={(e) =>
                    handleChange("office_province", e.target.value)
                  }
                  disabled={!isEditing}
                >
                  <option value="" disabled>
                    Tỉnh/Thành phố
                  </option>
                  {officeProvinces.map((province, index) => (
                    <option key={index} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>
              <div className={getInputClass(isEditing, errors.office_commune)}>
                <select
                  className="w-full h-full outline-none bg-transparent"
                  value={chapter.getFieldInForm("office_commune") || ""}
                  onChange={(e) =>
                    handleChange("office_commune", e.target.value)
                  }
                  disabled={!isEditing}
                >
                  <option value={""} disabled>
                    Phường/Xã
                  </option>
                  {officeCommunes.map((item, index) => (
                    <option key={index} value={item.commune}>
                      {item.commune}
                    </option>
                  ))}
                </select>
              </div>
              <div className={getInputClass(isEditing, errors.office_detail)}>
                <input
                  className="h-full w-full outline-none bg-transparent"
                  value={chapter.getFieldInForm("office_detail") || ""}
                  onChange={(e) =>
                    handleChange("office_detail", e.target.value)
                  }
                  placeholder="Nhập số nhà, đường, khu phố, ..."
                  disabled={!isEditing}
                />
              </div>
            </div>
            {(errors.office_province || errors.office_commune || errors.office_detail) && (
              <span className="text-red-500 text-sm">
                {errors.office_province || errors.office_commune || errors.office_detail}
              </span>
            )}
          </div>

          {/* Nút submit ở cuối form */}
          <div className="col-span-12 flex justify-center items-center grid grid-cols-12 mb-4 gap-6 md:col-span-10 md:mb-0">
            {!isEditing ? (
              <button
                type="button"
                onClick={handleEdit}
                className="col-span-12 md:col-span-2 md:col-start-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-all"
              >
                Chỉnh sửa
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className=" col-span-6 md:col-span-2  md:col-start-5 bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className=" col-span-6 md:col-span-2  bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                >
                  {loading ? "Đang xử lý..." : "Cập nhật"}
                </button>
              </>
            )}
          </div>
        </div>
      </form>

      {/* Popup xác nhận */}
      {showConfirmDialog && (
        <div className="fixed inset-0 0 flex items-center justify-center z-50">
          <div className="bg-gray-400 opacity-50 h-full w-full absolute top-0 left-0 z-10"></div>
          <div className="bg-white opacity-100 rounded-lg p-6 max-w-md w-full mx-4 z-20">
            <h3 className="text-lg font-semibold mb-4">Xác nhận cập nhật</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn cập nhật thông tin chi đoàn này?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelUpdate}
                disabled={loading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmUpdate}
                disabled={loading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg disabled:opacity-50"
              >
                {loading ? "Đang xử lý..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
      
    </>
  );
}

export default ChapterForm;
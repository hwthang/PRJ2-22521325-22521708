import React, { useEffect } from "react";
import useForm from "../../../core/hooks/useForm";
import { toDateInputValue } from "../../../utils/date";
import { ethnicities } from "../../../core/assets/data/ethnicities";
import { religions } from "../../../core/assets/data/religions";
import { educations } from "../../../core/assets/data/educations";
import { qualifications } from "../../../core/assets/data/qualifications";
import { politicals } from "../../../core/assets/data/politicals";
import ChapterService from "../../chapter/services/ChapterService";
import Avatar from "../../../core/components/Avatar";
import { getStatusBadge, getTypeBadge } from "../../../utils/badge";
import MemberService from "../services/MemberService";
import address from "../../../utils/address";

function MemberForm({ data, onSubmit, ...props }) {
  const [hometownCommunes, setHometownCommunes] = React.useState([]);
  const [hometownProvinces, setHometownProvinces] = React.useState([]);
  const [addressCommunes, setAddressCommunes] = React.useState([]);
  const [addressProvinces, setAddressProvinces] = React.useState([]);
  const [chapters, setChapters] = React.useState([]);
  const [isEditing, setIsEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [pendingFormData, setPendingFormData] = React.useState(null);
  const [errors, setErrors] = React.useState({});

  const member = useForm();

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
    fullname: {
      required: true,
      pattern: /^[a-zA-ZÀ-ỹ\s]{2,50}$/,
      message: "Họ tên phải từ 2-50 ký tự và chỉ chứa chữ cái"
    },
    phone: {
      required: true,
      pattern: /^(0[3|5|7|8|9])+([0-9]{8})$/,
      message: "Số điện thoại phải bắt đầu bằng 03,05,07,08,09 và có 10 số"
    },
    dateOfBirth: {
      required: true,
      validate: (value) => {
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= 16 && age <= 100;
      },
      message: "Tuổi phải từ 16 đến 100"
    },
    memberNumber: {
      pattern: /^[A-Z0-9]{6,20}$/,
      message: "Số thẻ đoàn phải từ 6-20 ký tự chữ in hoa và số"
    },
    hometown_detail: {
      required: true,
      pattern: /^[a-zA-Z0-9À-ỹ\s\/.,-]{5,200}$/,
      message: "Địa chỉ phải từ 5-200 ký tự"
    },
    address_detail: {
      required: true,
      pattern: /^[a-zA-Z0-9À-ỹ\s\/.,-]{5,200}$/,
      message: "Địa chỉ phải từ 5-200 ký tự"
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
      const value = formData[field] || member.getFieldInForm(field);
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
    const requiredSelectFields = [
      'gender', 'hometown_province', 'hometown_commune', 
      'address_province', 'address_commune', 'ethnicity', 
      'religion', 'education', 'qualification', 'political',
      'chapter', 'position'
    ];

    requiredSelectFields.forEach(field => {
      const value = member.getFieldInForm(field);
      if (!value) {
        isValid = false;
        newErrors[field] = "Trường này là bắt buộc";
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const fetchChapters = async () => {
    const chaptersData = await ChapterService.getChapters();
    setChapters(
      chaptersData.map((item) => ({
        id: item?._id,
        name: `${item?.name}, ${item?.affiliated}, ${item?.office?.province}`,
      })) || []
    );
  };

  const handleChange = (name, value) => {
    if (isEditing) {
      member.handleChangeFieldInForm(name, value);
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
      member.setForm({
        username: data?.username || "",
        email: data?.email || "",
        fullname: data?.profile?.fullname || "",
        phone: data?.profile?.phone || "",
        dateOfBirth: toDateInputValue(data?.profile?.dateOfBirth) || "",
        gender: data?.profile?.gender || "",
        hometown_province: data?.profile?.hometown?.province || "",
        hometown_commune: data?.profile?.hometown?.commune || "",
        hometown_detail: data?.profile?.hometown?.detail || "",
        ethnicity: data?.profile?.ethnicity || "",
        religion: data?.profile?.religion || "",
        education: data?.profile?.education || "",
        qualification: data?.profile?.qualification || "",
        political: data?.profile?.political || "",
        memberNumber: data?.profile?.memberNumber || "",
        joinedAt: toDateInputValue(data?.profile?.joinedAt) || "",
        position: data?.profile?.position || "",
        chapter: data?.profile?.chapter || "",
        address_province: data?.profile?.address?.province || "",
        address_commune: data?.profile?.address?.commune || "",
        address_detail: data?.profile?.address?.detail || "",
      });
    }
  };

  const prepareFormData = () => {
    return {
      username: member.getFieldInForm("username"),
      email: member.getFieldInForm("email"),
      fullname: member.getFieldInForm("fullname"),
      phone: member.getFieldInForm("phone"),
      dateOfBirth: member.getFieldInForm("dateOfBirth"),
      gender: member.getFieldInForm("gender"),
      hometown: {
        province: member.getFieldInForm("hometown_province"),
        commune: member.getFieldInForm("hometown_commune"),
        detail: member.getFieldInForm("hometown_detail"),
      },
      address: {
        province: member.getFieldInForm("address_province"),
        commune: member.getFieldInForm("address_commune"),
        detail: member.getFieldInForm("address_detail"),
      },
      ethnicity: member.getFieldInForm("ethnicity"),
      religion: member.getFieldInForm("religion"),
      education: member.getFieldInForm("education"),
      qualification: member.getFieldInForm("qualification"),
      political: member.getFieldInForm("political"),
      memberNumber: member.getFieldInForm("memberNumber"),
      joinedAt: member.getFieldInForm("joinedAt"),
      position: member.getFieldInForm("position"),
      chapter: member.getFieldInForm("chapter"),
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
      await MemberService.update(data._id, pendingFormData);
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
      setHometownProvinces(provinces || []);
      setAddressProvinces(provinces || []);
    };

    fetchAddressData();
    fetchChapters();
  }, []);

  useEffect(() => {
    setAddressCommunes(
      address.getCommunesByProvince(
        member.getFieldInForm("address_province") || ""
      )
    );
    setHometownCommunes(
      address.getCommunesByProvince(
        member.getFieldInForm("hometown_province") || ""
      )
    );
  }, [
    member.getFieldInForm("address_province"),
    member.getFieldInForm("hometown_province"),
  ]);

  useEffect(() => {
    if (data) {
      member.setForm({
        username: data?.username || "",
        email: data?.email || "",
        fullname: data?.profile?.fullname || "",
        phone: data?.profile?.phone || "",
        dateOfBirth: toDateInputValue(data?.profile?.dateOfBirth) || "",
        gender: data?.profile?.gender || "",
        hometown_province: data?.profile?.hometown?.province || "",
        hometown_commune: data?.profile?.hometown?.commune || "",
        hometown_detail: data?.profile?.hometown?.detail || "",
        ethnicity: data?.profile?.ethnicity || "",
        religion: data?.profile?.religion || "",
        education: data?.profile?.education || "",
        qualification: data?.profile?.qualification || "",
        political: data?.profile?.political || "",
        memberNumber: data?.profile?.memberNumber || "",
        joinedAt: toDateInputValue(data?.profile?.joinedAt) || "",
        position: data?.profile?.position || "",
        chapter: data?.profile?.chapter || "",
        address_province: data?.profile?.address?.province || "",
        address_commune: data?.profile?.address?.commune || "",
        address_detail: data?.profile?.address?.detail || "",
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
                value={member.getFieldInForm("username") || ""}
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
                value={member.getFieldInForm("email") || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          {/* Thông tin cá nhân */}
          <div className="col-span-12 flex gap-1 flex-col md:col-span-4">
            <label className="font-semibold">Họ và tên</label>
            <div className={getInputClass(isEditing, errors.fullname)}>
              <input
                className="h-full w-full outline-none bg-transparent"
                value={member.getFieldInForm("fullname") || ""}
                onChange={(e) => handleChange("fullname", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            {errors.fullname && (
              <span className="text-red-500 text-sm">{errors.fullname}</span>
            )}
          </div>

          <div className="col-span-12 flex gap-1 flex-col md:col-span-2">
            <label className="font-semibold">Số điện thoại</label>
            <div className={getInputClass(isEditing, errors.phone)}>
              <input
                className="h-full w-full outline-none bg-transparent"
                value={member.getFieldInForm("phone") || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            {errors.phone && (
              <span className="text-red-500 text-sm">{errors.phone}</span>
            )}
          </div>

          <div className="col-span-12 flex gap-1 flex-col md:col-span-2">
            <label className="font-semibold">Ngày sinh</label>
            <div className={getInputClass(isEditing, errors.dateOfBirth)}>
              <input
                type="date"
                className="h-full w-full outline-none bg-transparent"
                value={member.getFieldInForm("dateOfBirth") || ""}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            {errors.dateOfBirth && (
              <span className="text-red-500 text-sm">{errors.dateOfBirth}</span>
            )}
          </div>

          <div className="col-span-12 flex gap-1 flex-col md:col-span-2">
            <label className="font-semibold">Giới tính</label>
            <div
              className={`relative h-10 w-full bg-gray-300 grid grid-cols-2 rounded-lg transition-all ${
                !isEditing ? "opacity-50" : ""
              } ${errors.gender ? "border-2 border-red-500" : ""}`}
            >
              <label
                htmlFor="male"
                className={`flex justify-center items-center has-[input:checked]:bg-blue-500 has-[input:checked]:text-white font-semibold rounded-lg text-gray-500 cursor-pointer ${
                  !isEditing ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                Nam
                <input
                  id="male"
                  className="hidden"
                  name="gender"
                  value="male"
                  type="radio"
                  checked={member.getFieldInForm("gender") === "male"}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  disabled={!isEditing}
                />
              </label>
              <label
                htmlFor="female"
                className={`flex justify-center items-center has-[input:checked]:bg-pink-500 has-[input:checked]:text-white font-semibold rounded-lg text-gray-500 cursor-pointer ${
                  !isEditing ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                Nữ
                <input
                  id="female"
                  className="hidden"
                  name="gender"
                  value="female"
                  type="radio"
                  checked={member.getFieldInForm("gender") === "female"}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  disabled={!isEditing}
                />
              </label>
            </div>
            {errors.gender && (
              <span className="text-red-500 text-sm">{errors.gender}</span>
            )}
          </div>

          {/* Quê quán */}
          <div className="col-span-12 flex gap-1 flex-col md:col-span-10">
            <label className="font-semibold">Quê quán</label>
            <div className="relative w-full grid md:grid-cols-3 gap-6 rounded-lg transition-all">
              <div className={getInputClass(isEditing, errors.hometown_province)}>
                <select
                  className="w-full h-full outline-none bg-transparent"
                  value={member.getFieldInForm("hometown_province") || ""}
                  onChange={(e) =>
                    handleChange("hometown_province", e.target.value)
                  }
                  disabled={!isEditing}
                >
                  <option value="" disabled>
                    Tỉnh/Thành phố
                  </option>
                  {hometownProvinces.map((province, index) => (
                    <option key={index} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>
              <div className={getInputClass(isEditing, errors.hometown_commune)}>
                <select
                  className="w-full h-full outline-none bg-transparent"
                  value={member.getFieldInForm("hometown_commune") || ""}
                  onChange={(e) =>
                    handleChange("hometown_commune", e.target.value)
                  }
                  disabled={!isEditing}
                >
                  <option value={""} disabled>
                    Phường/Xã
                  </option>
                  {hometownCommunes.map((item, index) => (
                    <option key={index} value={item.commune}>
                      {item.commune}
                    </option>
                  ))}
                </select>
              </div>
              <div className={getInputClass(isEditing, errors.hometown_detail)}>
                <input
                  className="h-full w-full outline-none bg-transparent"
                  value={member.getFieldInForm("hometown_detail") || ""}
                  onChange={(e) =>
                    handleChange("hometown_detail", e.target.value)
                  }
                  placeholder="Nhập số nhà, đường, khu phố, ..."
                  disabled={!isEditing}
                />
              </div>
            </div>
            {(errors.hometown_province || errors.hometown_commune || errors.hometown_detail) && (
              <span className="text-red-500 text-sm">
                {errors.hometown_province || errors.hometown_commune || errors.hometown_detail}
              </span>
            )}
          </div>

          {/* Nơi thường trú */}
          <div className="col-span-12 flex gap-1 flex-col md:col-span-10">
            <label className="font-semibold">Nơi thường trú</label>
            <div className="relative w-full grid md:grid-cols-3 gap-6 rounded-lg transition-all">
              <div className={getInputClass(isEditing, errors.address_province)}>
                <select
                  className="w-full h-full outline-none bg-transparent"
                  value={member.getFieldInForm("address_province") || ""}
                  onChange={(e) =>
                    handleChange("address_province", e.target.value)
                  }
                  disabled={!isEditing}
                >
                  <option value="" disabled>
                    Tỉnh/Thành phố
                  </option>
                  {addressProvinces.map((province, index) => (
                    <option key={index} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>
              <div className={getInputClass(isEditing, errors.address_commune)}>
                <select
                  className="w-full h-full outline-none bg-transparent"
                  value={member.getFieldInForm("address_commune") || ""}
                  onChange={(e) =>
                    handleChange("address_commune", e.target.value)
                  }
                  disabled={!isEditing}
                >
                  <option value={""} disabled>
                    Phường/Xã
                  </option>
                  {addressCommunes.map((item, index) => (
                    <option key={index} value={item.commune}>
                      {item.commune}
                    </option>
                  ))}
                </select>
              </div>
              <div className={getInputClass(isEditing, errors.address_detail)}>
                <input
                  className="h-full w-full outline-none bg-transparent"
                  value={member.getFieldInForm("address_detail") || ""}
                  onChange={(e) =>
                    handleChange("address_detail", e.target.value)
                  }
                  placeholder="Nhập số nhà, đường, khu phố, ..."
                  disabled={!isEditing}
                />
              </div>
            </div>
            {(errors.address_province || errors.address_commune || errors.address_detail) && (
              <span className="text-red-500 text-sm">
                {errors.address_province || errors.address_commune || errors.address_detail}
              </span>
            )}
          </div>

          {/* Thông tin khác */}
          <div className="col-span-12 flex gap-1 flex-col md:col-span-2">
            <label className="font-semibold">Dân tộc</label>
            <div className={getInputClass(isEditing, errors.ethnicity)}>
              <select
                className="w-full h-full outline-none bg-transparent"
                value={member.getFieldInForm("ethnicity") || ""}
                onChange={(e) => handleChange("ethnicity", e.target.value)}
                disabled={!isEditing}
              >
                <option value={""} disabled>
                  Dân tộc
                </option>
                {ethnicities.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            {errors.ethnicity && (
              <span className="text-red-500 text-sm">{errors.ethnicity}</span>
            )}
          </div>

          <div className="col-span-12 flex gap-1 flex-col md:col-span-2">
            <label className="font-semibold">Tôn giáo</label>
            <div className={getInputClass(isEditing, errors.religion)}>
              <select
                className="w-full h-full outline-none bg-transparent"
                value={member.getFieldInForm("religion") || ""}
                onChange={(e) => handleChange("religion", e.target.value)}
                disabled={!isEditing}
              >
                <option value={""} disabled>
                  Tôn giáo
                </option>
                {religions.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            {errors.religion && (
              <span className="text-red-500 text-sm">{errors.religion}</span>
            )}
          </div>

          <div className="col-span-12 flex gap-1 flex-col md:col-span-2">
            <label className="font-semibold">Trình độ văn hóa</label>
            <div className={getInputClass(isEditing, errors.education)}>
              <select
                className="w-full h-full outline-none bg-transparent"
                value={member.getFieldInForm("education") || ""}
                onChange={(e) => handleChange("education", e.target.value)}
                disabled={!isEditing}
              >
                <option value={""} disabled>
                  Trình độ văn hóa
                </option>
                {educations.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            {errors.education && (
              <span className="text-red-500 text-sm">{errors.education}</span>
            )}
          </div>

          <div className="col-span-12 flex gap-1 flex-col md:col-span-2">
            <label className="font-semibold">Trình độ chuyên môn</label>
            <div className={getInputClass(isEditing, errors.qualification)}>
              <select
                className="w-full h-full outline-none bg-transparent"
                value={member.getFieldInForm("qualification") || ""}
                onChange={(e) => handleChange("qualification", e.target.value)}
                disabled={!isEditing}
              >
                <option value={""} disabled>
                  Trình độ chuyên môn
                </option>
                {qualifications.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            {errors.qualification && (
              <span className="text-red-500 text-sm">{errors.qualification}</span>
            )}
          </div>

          <div className="col-span-12 flex gap-1 flex-col md:col-span-4">
            <label className="font-semibold">Lý luận chính trị</label>
            <div className={getInputClass(isEditing, errors.political)}>
              <select
                className="w-full h-full outline-none bg-transparent"
                value={member.getFieldInForm("political") || ""}
                onChange={(e) => handleChange("political", e.target.value)}
                disabled={!isEditing}
              >
                <option value={""} disabled>
                  Lý luận chính trị
                </option>
                {politicals.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            {errors.political && (
              <span className="text-red-500 text-sm">{errors.political}</span>
            )}
          </div>

          {/* Thông tin đoàn */}
          <div className="col-span-12 flex gap-1 flex-col md:col-span-2">
            <label className="font-semibold">Số thẻ đoàn</label>
            <div className={getInputClass(isEditing, errors.memberNumber)}>
              <input
                className="h-full w-full outline-none bg-transparent"
                value={member.getFieldInForm("memberNumber") || ""}
                onChange={(e) => handleChange("memberNumber", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            {errors.memberNumber && (
              <span className="text-red-500 text-sm">{errors.memberNumber}</span>
            )}
          </div>

          <div className="col-span-12 flex gap-1 flex-col md:col-span-2">
            <label className="font-semibold">Ngày vào đoàn</label>
            <div className={getInputClass(isEditing)}>
              <input
                type="date"
                className="h-full w-full outline-none bg-transparent"
                value={member.getFieldInForm("joinedAt") || ""}
                onChange={(e) => handleChange("joinedAt", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="col-span-12 flex gap-1 flex-col md:col-span-8">
            <label className="font-semibold">Chức danh</label>
            <div
              className={`relative w-full bg-gray-300 grid md:grid-cols-4 rounded-lg transition-all ${
                !isEditing ? "opacity-50" : ""
              } ${errors.position ? "border-2 border-red-500" : ""}`}
            >
              <label
                htmlFor="position_bt"
                className={`flex py-2 justify-center items-center has-[input:checked]:bg-blue-500 has-[input:checked]:text-white font-semibold rounded-lg text-gray-500 ${
                  !isEditing ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                Bí thư
                <input
                  id="position_bt"
                  className="hidden"
                  name="position"
                  value="bt"
                  type="radio"
                  checked={member.getFieldInForm("position") === "bt"}
                  onChange={(e) => handleChange("position", e.target.value)}
                  disabled={!isEditing}
                />
              </label>
              <label
                htmlFor="position_pbt"
                className={`flex py-2 justify-center items-center has-[input:checked]:bg-blue-500 has-[input:checked]:text-white font-semibold rounded-lg text-gray-500 ${
                  !isEditing ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                Phó Bí thư
                <input
                  id="position_pbt"
                  className="hidden"
                  name="position"
                  value="pbt"
                  type="radio"
                  checked={member.getFieldInForm("position") === "pbt"}
                  onChange={(e) => handleChange("position", e.target.value)}
                  disabled={!isEditing}
                />
              </label>
              <label
                htmlFor="position_uv"
                className={`flex py-2 justify-center items-center has-[input:checked]:bg-blue-500 has-[input:checked]:text-white font-semibold rounded-lg text-gray-500 ${
                  !isEditing ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                Ủy viên BCH
                <input
                  id="position_uv"
                  className="hidden"
                  name="position"
                  value="uv"
                  type="radio"
                  checked={member.getFieldInForm("position") === "uv"}
                  onChange={(e) => handleChange("position", e.target.value)}
                  disabled={!isEditing}
                />
              </label>
              <label
                htmlFor="position_dv"
                className={`flex py-2 justify-center items-center has-[input:checked]:bg-blue-500 has-[input:checked]:text-white font-semibold rounded-lg text-gray-500 ${
                  !isEditing ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                Đoàn viên
                <input
                  id="position_dv"
                  className="hidden"
                  name="position"
                  value="dv"
                  type="radio"
                  checked={member.getFieldInForm("position") === "dv"}
                  onChange={(e) => handleChange("position", e.target.value)}
                  disabled={!isEditing}
                />
              </label>
            </div>
            {errors.position && (
              <span className="text-red-500 text-sm">{errors.position}</span>
            )}
          </div>

          <div className="col-span-12 flex gap-1 flex-col">
            <label className="font-semibold">Chi đoàn sinh hoạt</label>
            <div className={getInputClass(isEditing, errors.chapter)}>
              <select
                className="w-full h-full outline-none bg-transparent"
                value={member.getFieldInForm("chapter") || ""}
                onChange={(e) => handleChange("chapter", e.target.value)}
                disabled={!isEditing}
              >
                <option value="">Chọn chi đoàn</option>
                {chapters.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.chapter && (
              <span className="text-red-500 text-sm">{errors.chapter}</span>
            )}
          </div>

          {/* Nút submit ở cuối form */}
          <div className="col-span-12 flex justify-center items-center grid grid-cols-12 mb-4 gap-6">
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
              Bạn có chắc chắn muốn cập nhật thông tin thành viên này?
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

export default MemberForm;
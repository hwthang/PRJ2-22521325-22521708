import React, { useEffect, useState, useMemo } from "react";
import CustomInput from "../../component/custom/CustomInput";
import { toast } from 'react-toastify';
import { surveyStatuses } from "../page/SurveyListPage";
import { CheckOption } from "../../../core/components/CheckOption";

const EditSurveyForm = ({ survey, onSubmit }) => {
  // Lấy giá trị mặc định cho form
  const defaultStatusKey = survey?.status || Object.keys(surveyStatuses)[0];

  const [form, setForm] = useState({
    name: "",
    startedAt: "",
    endedAt: "",
    status: [defaultStatusKey],
  });

  const [initialForm, setInitialForm] = useState(null);

  // ================================
  // PREFILL DATA & SET INITIAL STATE
  // ================================
  useEffect(() => {
    // Chỉ chạy nếu có dữ liệu khảo sát được truyền vào (chế độ Edit)
    if (survey) {
        const defaultState = {
            name: survey.name || "",
            // Cắt ngày thành định dạng YYYY-MM-DD
            startedAt: survey.startedAt?.slice(0, 10) || "", 
            endedAt: survey.endedAt?.slice(0, 10) || "",
            status: survey.status ? [survey.status] : [defaultStatusKey], // Đảm bảo là mảng
        };

        setForm(defaultState);
        setInitialForm(defaultState); // Lưu trạng thái gốc
    } else {
        // Nếu không có survey (chế độ Create), thiết lập trạng thái ban đầu để nút Lưu hoạt động ngay
        const emptyState = { name: "", startedAt: "", endedAt: "", status: [defaultStatusKey] };
        setForm(emptyState);
        setInitialForm({ ...emptyState, name: 'dummy' }); // Dùng dummy để hasFormChanged = true
    }
  }, [survey]);

  const update = (key, val) =>
    setForm((prev) => ({ ...prev, [key]: val }));
    
  // ================================
  // LOGIC SO SÁNH THAY ĐỔI
  // ================================
  const hasFormChanged = useMemo(() => {
    if (!initialForm) return false;

    // So sánh các trường
    const isNameChanged = form.name !== initialForm.name;
    const isStartedAtChanged = form.startedAt !== initialForm.startedAt;
    const isEndedAtChanged = form.endedAt !== initialForm.endedAt;

    // So sánh trường Status
    const currentStatus = form.status[0] || null;
    const initialStatus = initialForm.status[0] || null;
    const isStatusChanged = currentStatus !== initialStatus;

    // Nếu đang ở chế độ Create, luôn bật nút nếu có ít nhất tên
    if (!survey && form.name) return true;
    
    // Chế độ Edit
    return (
      isNameChanged ||
      isStartedAtChanged ||
      isEndedAtChanged ||
      isStatusChanged
    );
  }, [form, initialForm, survey]);
  
  // ================================
  // SUBMIT
  // ================================
  const handleSubmit = () => {
    if (!form.name || !form.startedAt || !form.endedAt || !form.status.length) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }
    
    // Kiểm tra logic ngày: Bắt đầu không được sau Kết thúc
    if (new Date(form.startedAt) > new Date(form.endedAt)) {
        toast.error("Ngày bắt đầu không thể sau ngày kết thúc!");
        return;
    }

    onSubmit({
      name: form.name,
      startedAt: form.startedAt,
      endedAt: form.endedAt,
      status: form.status[0],
    });
  };

  // Nút Lưu thay đổi sẽ bị vô hiệu hóa nếu: Form chưa hề được chỉnh sửa HOẶC Tên trống.
  const isSaveDisabled = !hasFormChanged || !form.name;

  return (
    <div className="space-y-4">
      <CustomInput
        label="Tên khảo sát"
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <CustomInput
          type="date"
          label="Ngày bắt đầu"
          value={form.startedAt}
          onChange={(e) => update("startedAt", e.target.value)}
        />
        <CustomInput
          type="date"
          label="Ngày kết thúc"
          value={form.endedAt}
          onChange={(e) => update("endedAt", e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-semibold">Trạng thái</label>
        <CheckOption
          options={surveyStatuses}
          multiple={false}
          value={form.status}
          onChange={(val) => update("status", val)}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSaveDisabled}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded w-full disabled:opacity-60 disabled:cursor-not-allowed font-medium"
      >
        {survey ? "Lưu thay đổi" : "Tạo khảo sát"}
      </button>
    </div>
  );
};

export default EditSurveyForm;
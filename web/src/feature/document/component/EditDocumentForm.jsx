import React, { useEffect, useState, useMemo } from "react";
import { Upload, Loader2, FileText } from "lucide-react";
import { documentTypes } from "../page/DocumentListPage";
import { onUpload } from "../../../utils/cloudinary";
import { CheckOption } from "../../../core/components/CheckOption";
import CustomInput from "../../component/custom/CustomInput";

const EditDocumentForm = ({ document, onSubmit }) => {
  if (!document) return null;

  // Trạng thái Form hiện tại
  const [form, setForm] = useState({
    name: "",
    type: [],
    docCode: "",
    issuedAt: "",
    uploadedFile: null,
  });

  // Trạng thái Form ban đầu để so sánh
  const [initialForm, setInitialForm] = useState(null);

  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // ================================
  // PREFILL DATA & SET INITIAL STATE
  // ================================
  useEffect(() => {
    const defaultState = {
      name: document.name || "",
      // Luôn đặt type vào mảng để dễ so sánh, vì CheckOption xử lý mảng
      type: document.type ? [document.type] : [], 
      docCode: document.docCode || "",
      issuedAt: document.issuedAt?.slice(0, 10) || "",
      uploadedFile: document.file || null,
    };

    setForm(defaultState);
    setInitialForm(defaultState); // Lưu trạng thái gốc

    const url = document.file?.secure_url || document.file?.url;
    setPreviewUrl(url || null);
  }, [document]);

  const update = (key, val) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  // ================================
  // LOGIC SO SÁNH THAY ĐỔI (FIXED: So sánh File)
  // ================================
  const hasFormChanged = useMemo(() => {
    if (!initialForm) return false;

    // So sánh các trường cơ bản
    const isNameChanged = form.name !== initialForm.name;
    const isDocCodeChanged = form.docCode !== initialForm.docCode;
    const isIssuedAtChanged = form.issuedAt !== initialForm.issuedAt;

    // So sánh trường Type
    const currentType = form.type[0] || null;
    const initialType = initialForm.type[0] || null;
    const isTypeChanged = currentType !== initialType;

    // So sánh trường File bằng cách kiểm tra ID duy nhất hoặc URL
    const currentFileIdentifier = 
        form.uploadedFile?.public_id || 
        form.uploadedFile?.url || 
        form.uploadedFile?._id || 
        null;

    const initialFileIdentifier = 
        initialForm.uploadedFile?.public_id || 
        initialForm.uploadedFile?.url ||
        initialForm.uploadedFile?._id ||
        null;

    const isFileChanged = currentFileIdentifier !== initialFileIdentifier;

    return (
      isNameChanged ||
      isDocCodeChanged ||
      isIssuedAtChanged ||
      isTypeChanged ||
      isFileChanged
    );
  }, [form, initialForm]);


  // ================================
  // UPLOAD FILE + PREVIEW
  // ================================
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await onUpload(file, "raw");

      update("uploadedFile", res);
      setPreviewUrl(res.secure_url || res.url); // preview ngay
      e.target.value = null; // Quan trọng: Reset input file
    } catch (err) {
      console.error(err);
      alert("Upload file thất bại!");
    }
    setIsUploading(false);
  };

  // ================================
  // SUBMIT
  // ================================
  const handleSubmit = () => {
    if (!form.name || !form.type.length || !form.docCode || !form.issuedAt) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    
    if (!form.uploadedFile) {
        alert("Vui lòng tải lên tệp tài liệu!");
        return;
    }

    onSubmit({
      name: form.name,
      type: form.type[0],
      docCode: form.docCode,
      issuedAt: form.issuedAt,
      file: form.uploadedFile,
    });
  };
  
  // Điều kiện vô hiệu hóa nút Lưu
  // Chỉ bật (enabled) khi không upload VÀ đã có thay đổi (hasFormChanged)
  const isSaveDisabled = isUploading || !hasFormChanged; 

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
      <h2 className="font-semibold text-lg mb-6">Chỉnh sửa tài liệu</h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================= LEFT: FORM ================= */}
        <div className="lg:col-span-6 space-y-4">
          <CustomInput
            label="Tên tài liệu"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />

          <div>
            <label className="text-sm font-semibold">Loại tài liệu</label>
            <CheckOption
              options={documentTypes}
              multiple={false}
              value={form.type}
              onChange={(val) => update("type", val)}
            />
          </div>

          <CustomInput
            label="Số hiệu"
            value={form.docCode}
            onChange={(e) => update("docCode", e.target.value)}
          />

          <CustomInput
            type="date"
            label="Ngày ban hành"
            value={form.issuedAt}
            onChange={(e) => update("issuedAt", e.target.value)}
          />

          {/* FILE UPLOAD */}
          <div>
            <label className="text-sm font-semibold">Tệp tài liệu (PDF)</label>

            <label
              className={`border border-dashed p-3 rounded-md flex items-center justify-between cursor-pointer mt-1
                ${isUploading ? "opacity-60 cursor-not-allowed" : ""}
              `}
            >
              <span className="text-sm text-gray-600">
                {isUploading ? "Đang tải..." : "Thay thế file PDF"}
              </span>

              {isUploading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Upload />
              )}

              <input
                type="file"
                className="hidden"
                accept="application/pdf"
                disabled={isUploading}
                onChange={handleFileUpload}
              />
            </label>
            {/* Hiển thị tên file hiện tại */}
            {form.uploadedFile && (
                <p className="text-xs text-green-600 mt-1 truncate">
                    Đã chọn: {form.uploadedFile.original_filename || 'Tệp hiện tại'}
                </p>
            )}
          </div>

          {/* NÚT LƯU THAY ĐỔI */}
          <button
            onClick={handleSubmit}
            disabled={isSaveDisabled} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Lưu thay đổi
          </button>
        </div>

        {/* ================= RIGHT: PDF PREVIEW ================= */}
        <div className="lg:col-span-6">
          <div className="border border-gray-200 rounded-lg h-full p-3 shadow-sm bg-[#3c3c3c]">
            <div className="flex items-center gap-2 mb-2 text-white">
              <FileText size={18} />
              <span className="font-medium ">Xem trước tài liệu</span>
            </div>

            {previewUrl ? (
              <iframe
                src={`${previewUrl}#toolbar=1&navpanes=0&scrollbar=0&zoom=56`}
                title="PDF Preview"
                className="w-full h-[70vh] rounded-md p-1"
              />
            ) : (
              <div className="h-[70vh] flex items-center justify-center text-gray-500 border border-dashed rounded-md">
                Chưa có file PDF
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDocumentForm;
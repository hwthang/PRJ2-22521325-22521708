import React, { useEffect, useState } from "react";
import { X, Upload, Loader2, FileCheck } from "lucide-react";

import { documentTypes } from "../page/DocumentListPage";
import { onUpload } from "../../../utils/cloudinary";
import { CheckOption } from "../../../core/components/CheckOption";
import CustomInput from "../../component/custom/CustomInput";

const EditDocumentModal = ({ open, onClose, onSubmit, document }) => {
  if (!open || !document) return null;

  const [form, setForm] = useState({
    name: "",
    type: [],
    docCode: "",
    issuedAt: "",
    file: null,
    uploadedFile: null,
  });

  const [isUploading, setIsUploading] = useState(false);

  // ================================
  // PREFILL DATA
  // ================================
  useEffect(() => {
    if (!document) return;

    setForm({
      name: document.name || "",
      type: document.type ? [document.type] : [],
      docCode: document.docCode || "",
      issuedAt: document.issuedAt
        ? document.issuedAt.slice(0, 10)
        : "",
      file: null,
      uploadedFile: document.file || null,
    });
  }, [document]);

  const update = (key, val) =>
    setForm((prev) => ({
      ...prev,
      [key]: val,
    }));

  // ================================
  // FILE UPLOAD
  // ================================
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    update("file", file);
    setIsUploading(true);

    try {
      const res = await onUpload(file, "raw");
      update("uploadedFile", res);
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

    const payload = {
      name: form.name,
      type: form.type[0],
      docCode: form.docCode,
      issuedAt: form.issuedAt,
      file: form.uploadedFile, // có thể là file cũ hoặc mới
    };

    onSubmit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg animate-fadeIn p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Chỉnh sửa tài liệu</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="col-span-1 md:col-span-2">
            <CustomInput
              label="Tên tài liệu"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>

          {/* Type */}
          <div className="col-span-1 md:col-span-2">
            <label className="text-sm font-semibold">Loại tài liệu</label>
            <CheckOption
              options={documentTypes}
              multiple={false}
              value={form.type}
              onChange={(val) => update("type", val)}
            />
          </div>

          {/* docCode */}
          <CustomInput
            label="Số hiệu"
            value={form.docCode}
            onChange={(e) => update("docCode", e.target.value)}
          />

          {/* issuedAt */}
          <CustomInput
            type="date"
            label="Ngày ban hành"
            value={form.issuedAt}
            onChange={(e) => update("issuedAt", e.target.value)}
          />

          {/* File Upload */}
          <div className="col-span-1 md:col-span-2">
            <label className="text-sm font-semibold">Tệp tài liệu</label>

            <label
              className={`border border-dashed p-3 rounded-md flex items-center justify-between cursor-pointer mt-1
                ${isUploading ? "opacity-60 cursor-not-allowed" : ""}
              `}
            >
              <span className="text-gray-600 text-sm">
                {isUploading
                  ? "Đang tải lên..."
                  : form.file
                  ? form.file.name
                  : "Thay thế file (nếu cần)..."}
              </span>

              {isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}

              <input
                type="file"
                className="hidden"
                disabled={isUploading}
                onChange={handleFileUpload}
              />
            </label>

            {/* Current file */}
            {form.uploadedFile && !isUploading && (
              <div className="text-green-600 text-sm mt-1 flex items-center gap-1">
                <FileCheck size={16} /> File hiện tại đã sẵn sàng
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6 gap-3">
          <button className="px-4 py-2 rounded border" onClick={onClose}>
            Hủy
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
            disabled={isUploading}
            onClick={handleSubmit}
          >
            {isUploading ? "Đang tải..." : "Cập nhật"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDocumentModal;

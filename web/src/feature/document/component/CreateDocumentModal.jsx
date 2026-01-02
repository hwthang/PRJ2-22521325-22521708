import React, { useState } from "react";
import { X, Upload, Loader2 } from "lucide-react";

import { documentTypes } from "../page/DocumentListPage";
import { onUpload } from "../../../utils/cloudinary";
import { CheckOption } from "../../../core/components/CheckOption";
import CustomInput from "../../component/custom/CustomInput";

const CreateDocumentModal = ({ open, onClose, onSubmit }) => {
  if (!open) return null;

  const [form, setForm] = useState({
    name: "",
    type: [],
    docCode: "",
    issuedAt: "",
    file: null,
    uploadedFile: null,
  });

  const [isUploading, setIsUploading] = useState(false);

  const update = (key, val) =>
    setForm((prev) => ({
      ...prev,
      [key]: val,
    }));

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

  const handleSubmit = () => {
    if (!form.name || !form.type.length || !form.docCode || !form.issuedAt) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const newDocument = {
      name: form.name,
      type: form.type,
      docCode: form.docCode,
      issuedAt: form.issuedAt,
      file: form.uploadedFile,
    };

    onSubmit(newDocument);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg animate-fadeIn p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Thêm tài liệu</h2>
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
              placeholder="Nhập tên tài liệu"
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
            placeholder="VD: 123/QĐ-ĐTN"
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

            {/* Upload Button */}
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
                  : "Chọn file PDF/DOC..."}
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

            {/* Uploaded success */}
            {form.uploadedFile && !isUploading && (
              <div className="text-green-600 text-sm mt-1">
                File đã tải lên ✓
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
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isUploading}
            onClick={handleSubmit}
          >
            {isUploading ? "Đang tải..." : "Lưu tài liệu"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDocumentModal;

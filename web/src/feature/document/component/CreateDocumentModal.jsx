import React, { useState } from "react";
import { X, Upload, Loader2, AlertCircle, CheckCircle } from "lucide-react";

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
  const [isSaving, setIsSaving] = useState(false); // Trạng thái khi gọi API onSubmit
  const [error, setError] = useState("");

  const update = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (error) setError(""); 
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    update("file", file);
    setIsUploading(true);
    setError("");

    try {
      const res = await onUpload(file, "raw");
      update("uploadedFile", res);
    } catch (err) {
      setError("Tải tệp lên thất bại. Vui lòng thử lại!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    // 1. Validation nội bộ
    if (!form.name || !form.type.length || !form.docCode || !form.issuedAt) {
      setError("Vui lòng nhập đầy đủ tất cả các thông tin!");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(form.issuedAt) > today) {
      setError("Ngày ban hành không thể lớn hơn ngày hiện tại!");
      return;
    }

    if (!form.uploadedFile) {
      setError("Vui lòng đính kèm tệp tài liệu!");
      return;
    }

    // 2. Gọi API thông qua onSubmit
    setIsSaving(true);
    setError("");

    const result = await onSubmit({
      name: form.name.trim(),
      type: form.type,
      docCode: form.docCode.trim(),
      issuedAt: form.issuedAt,
      file: form.uploadedFile,
    });

    if (result?.success) {
      onClose(); // Thành công mới đóng Modal
    } else {
      // Hiển thị lỗi từ BE trả về
      setError(result?.message || "Lưu tài liệu thất bại!");
    }
    setIsSaving(false);
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="font-bold text-xl text-gray-800">Thêm tài liệu mới</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[70vh] overflow-y-auto">
          <div className="col-span-1 md:col-span-2">
            <CustomInput
              label="Tên tài liệu"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="VD: Quyết định thành lập..."
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="text-sm font-bold text-gray-700 block mb-2">Loại tài liệu</label>
            <CheckOption
              options={documentTypes}
              multiple={false}
              value={form.type}
              onChange={(val) => update("type", val)}
            />
          </div>

          <CustomInput
            label="Số hiệu văn bản"
            value={form.docCode}
            onChange={(e) => update("docCode", e.target.value)}
            placeholder="VD: 123/QĐ-ĐTN"
          />

          <CustomInput
            type="date"
            label="Ngày ban hành"
            value={form.issuedAt}
            max={todayStr}
            onChange={(e) => update("issuedAt", e.target.value)}
          />

          <div className="col-span-1 md:col-span-2">
            <label className="text-sm font-bold text-gray-700 block mb-2">Tệp đính kèm</label>
            <label className={`border-2 border-dashed p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all ${isUploading ? "bg-gray-50" : "hover:bg-blue-50 border-gray-200"} ${form.uploadedFile ? "border-green-300 bg-green-50" : ""}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${form.uploadedFile ? "bg-green-500" : "bg-blue-500"} text-white`}>
                  {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{form.file ? form.file.name : "Chỉ chọn tệp PDF"}</span>
                </div>
              </div>
              {form.uploadedFile && !isUploading && <CheckCircle className="text-green-600" />}
              <input type="file" className="hidden" disabled={isUploading} accept=".pdf" onChange={handleFileUpload} />
            </label>
          </div>

          {/* ERROR SECTION - Nơi hiển thị lỗi từ Validate hoặc Backend */}
          {error && (
            <div className="col-span-1 md:col-span-2 flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <p className="text-sm font-bold">Cảnh báo</p>
                <p className="text-xs">{error}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <button 
            disabled={isSaving || isUploading}
            className="px-5 py-2.5 rounded-lg border text-gray-700 hover:bg-white" 
            onClick={onClose}
          >
            Hủy bỏ
          </button>
          <button
            className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold flex items-center gap-2 disabled:opacity-50"
            disabled={isUploading || isSaving}
            onClick={handleSubmit}
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSaving ? "Đang xử lý..." : "Lưu tài liệu"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDocumentModal;
import React, { useState } from "react";
import DocumentUpload from "./DocumentUpload";
import filePdf from "../../../core/assets/file/fileASM.pdf"

const MOCK_DOCUMENT = {
  name: "Quyết định thành lập chi đoàn",
  type: "quyetdinh",
  issueDate: "2023-10-01",
  content: "Quyết định thành lập chi đoàn Thanh Niên ABC thuộc Đoàn Trường XYZ.",
  status: "issued",
  file: {
    name: "quyetdinh_chidoan.pdf",
    url: filePdf,
  },
};

const DocumentDetailForm = () => {
  const [document, setDocument] = useState(MOCK_DOCUMENT);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocument((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (file) => {
    setDocument((prev) => ({ ...prev, file }));
  };

  const handleSubmit = () => {
    console.log("Dữ liệu văn bản:", document);
    alert("Đã lưu thông tin văn bản!");
  };

  return (
    <div className="grid grid-cols-12 gap-6 p-4">
      {/* Tên văn bản */}
      <div className="col-span-12 md:col-span-8 md:col-start-3 flex flex-col gap-2">
        <label className="font-semibold text-gray-700">Tên văn bản</label>
        <input
          name="name"
          value={document.name}
          onChange={handleChange}
          placeholder="Nhập tên văn bản..."
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      {/* Loại văn bản */}
      <div className="col-span-12 md:col-span-4 md:col-start-3 flex flex-col gap-2">
        <label className="font-semibold text-gray-700">Loại văn bản</label>
        <select
          name="type"
          value={document.type}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="">-- Chọn loại văn bản --</option>
          <option value="quyetdinh">Quyết định</option>
          <option value="thongbao">Thông báo</option>
          <option value="huongdan">Hướng dẫn</option>
          <option value="baocao">Báo cáo</option>
        </select>
      </div>

      {/* Ngày ban hành */}
      <div className="col-span-12 md:col-span-4 flex flex-col gap-2">
        <label className="font-semibold text-gray-700">Ngày ban hành</label>
        <input
          name="issueDate"
          type="date"
          value={document.issueDate}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      {/* Nội dung */}
      <div className="col-span-12 md:col-span-8 md:col-start-3 flex flex-col gap-2">
        <label className="font-semibold text-gray-700">Nội dung ban hành</label>
        <textarea
          name="content"
          rows={4}
          value={document.content}
          onChange={handleChange}
          placeholder="Nhập nội dung chi tiết..."
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none resize-none"
        />
      </div>

      {/* Trạng thái */}
      <div className="col-span-12 md:col-span-4 md:col-start-3 flex flex-col gap-2">
        <label className="font-semibold text-gray-700">Trạng thái ban hành</label>
        <select
          name="status"
          value={document.status}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="">-- Chọn trạng thái --</option>
          <option value="draft">Bản nháp</option>
          <option value="issued">Đã ban hành</option>
          <option value="archived">Lưu trữ</option>
        </select>
      </div>

      {/* File đính kèm */}
      <div className="col-span-12 md:col-span-8 md:col-start-3">
        <label className="font-semibold text-gray-700 mb-2 block">Tệp đính kèm</label>
        <DocumentUpload onFileSelect={handleFileSelect} mockFile={document.file} />
      </div>

      {/* Mock UI xem PDF */}
      {document.file?.url && (
        <div className="col-span-12 md:col-span-8 md:col-start-3 mt-4">
          <label className="font-semibold text-gray-700 mb-2 block">Xem file PDF</label>
          <div className="border rounded-md overflow-hidden">
            <iframe
              src={document.file.url}
              title={document.file.name}
              className="w-full h-120"
            ></iframe>
          </div>
        </div>
      )}

      {/* Nút lưu */}
      <div className="col-span-12 md:col-span-8 md:col-start-3 flex justify-end mt-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
        >
          Lưu văn bản
        </button>
      </div>
    </div>
  );
};

export default DocumentDetailForm;

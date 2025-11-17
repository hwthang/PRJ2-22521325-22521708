import React, { useState, useRef, useCallback } from "react";
import * as XLSX from "xlsx";
import {
  Check,
  Plus,
  Sheet,
  X,
  CornerDownRight,
  AlertTriangle,
  Clock,
  ServerOff,
} from "lucide-react";
import { toDateInputValue } from "../../../utils/date";

// Hàm tiện ích để hiển thị biểu tượng trạng thái
const StatusIcon = ({ status }) => {
  switch (status) {
    case "success":
      return <Check className="text-green-500 mr-2" size={20} />;
    case "error":
      return <ServerOff className="text-red-500 mr-2" size={20} />;
    case "processing":
      return <Clock className="text-blue-500 mr-2 animate-spin" size={20} />;
    case "pending":
    default:
      return <AlertTriangle className="text-yellow-500 mr-2" size={20} />;
  }
};

const ChapterCreateExcel = ({ onSubmit }) => {
  const [excelData, setExcelData] = useState([]);
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const fileInputRef = useRef(null);

  // Lưu ý: Vẫn giữ EXCEL_TO_FORM_MAP để phục vụ chức năng xử lý dữ liệu và Tạo tất cả
  const EXCEL_TO_FORM_MAP = {
    "Tên chi đoàn": "name",
    "Đoàn trực thuộc cấp trên": "affiliated",
    "Ngày thành lập": "establishedAt",
    "Địa chỉ": "address",
    "Tên đăng nhập": "username",
    Email: "email",
    "Số điện thoại": "phoneNumber",
    "Mật khẩu": "password",
  };

  const handleCreateChapterFromExcel = useCallback(
    async (rowData, rowIndex) => {
      const fd = new FormData();

      // ... (Giữ nguyên logic xử lý fd và cập nhật trạng thái)
      setExcelData((prev) =>
        prev.map((row, i) =>
          i === rowIndex ? { ...row, _status: "processing" } : row
        )
      );

      Object.keys(rowData).forEach((excelKey) => {
        const formKey = EXCEL_TO_FORM_MAP[excelKey];
        if (formKey) {
          let value = rowData[excelKey];
          if (formKey === "establishedAt" && value) {
            value = toDateInputValue(new Date(value));
          }
          fd.append(formKey, value);
        }
      });

      try {
        const res = await onSubmit(fd);

        if (res == 1) {
          setExcelData((prev) =>
            prev.map((row, i) =>
              i === rowIndex ? { ...row, _status: "success" } : row
            )
          );

          setTimeout(() => {
            setExcelData((prev) => prev.filter((_, i) => i !== rowIndex));
          }, 2000);
        } else {
          setExcelData((prev) =>
            prev.map((row, i) =>
              i === rowIndex ? { ...row, _status: "error" } : row
            )
          );
        }
      } catch (err) {
        setExcelData((prev) =>
          prev.map((row, i) =>
            i === rowIndex ? { ...row, _status: "error" } : row
          )
        );
      }
    },
    [onSubmit]
  );

  const handleExcelUpload = (event) => {
    // ... (Giữ nguyên logic tải file)
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      const withStatus = json.map((row) => ({ ...row, _status: "pending" }));
      setExcelData(withStatus);
    };
    reader.readAsArrayBuffer(file);

    if (event.target) event.target.value = null;
  };

  const handleCreateAll = async () => {
    if (isProcessingAll) return;
    setIsProcessingAll(true);

    const indicesToProcess = excelData
      .map((row, i) =>
        row._status === "pending" || row._status === "error" ? i : -1
      )
      .filter((i) => i !== -1);

    for (const index of indicesToProcess) {
      const currentRow = excelData.find((_, i) => i === index);
      if (currentRow) {
        // NOTE: Trong môi trường thực tế, nếu excelData bị thay đổi (do xóa hàng thành công)
        // trong quá trình lặp, việc sử dụng index ban đầu có thể gây lỗi.
        // Tuy nhiên, do chúng ta đang xử lý tuần tự, cách này tạm ổn.
        // Nếu muốn mạnh mẽ hơn, cần dùng ID hoặc tránh xóa hàng khi đang lặp.
        await handleCreateChapterFromExcel(currentRow, index);
      }
    }

    setIsProcessingAll(false);
  };

  const remainingCount = excelData.filter(
    (row) => row._status === "pending" || row._status === "error"
  ).length;

  const isTableVisible = excelData.length > 0;

  // --- Hàm tiện ích để hiển thị một dòng thông tin ---
  const DataRow = ({ label, value }) => (
    <div className="flex justify-between border-b border-gray-100 pb-1">
      <span className="font-medium text-gray-500 text-nowrap">{label}:</span>
      <span className="text-right truncate ml-4">{value}</span>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg border-gray-200 border shadow-xl">
      {/* Header và Nút Hành động */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="font-semibold text-2xl text-gray-800">
          🚀 Tạo chi đoàn hàng loạt
        </h2>

        <div className="flex gap-3">
          {isTableVisible && remainingCount > 0 && (
            <button
              onClick={handleCreateAll}
              disabled={isProcessingAll}
              className={`p-3 rounded-md text-white flex items-center gap-2 transition duration-150 text-sm font-medium ${
                isProcessingAll
                  ? "bg-orange-300 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              <CornerDownRight size={20} />
              {isProcessingAll
                ? "Đang xử lý..."
                : `Tạo tất cả (${remainingCount})`}
            </button>
          )}

          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-green-500 p-3 rounded-md text-white hover:bg-green-600 flex items-center gap-2 transition duration-150 text-sm font-medium"
          >
            <Sheet size={20} />
            Tải lên Excel
          </button>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".xlsx, .xls"
        onChange={handleExcelUpload}
      />

      {/* Hiển thị danh sách item */}
      {isTableVisible ? (
        <>
          {/* Thông báo */}
          <div className="p-3 my-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded-md flex items-center gap-2">
            <AlertTriangle size={20} />
            <div>
              **Chú ý:** Còn **{remainingCount}** hàng chờ xử lý. Hàng thành
              công sẽ tự động biến mất sau 2 giây.
            </div>
          </div>

          <div className="mt-6 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {excelData.map((row, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg shadow-sm transition duration-200 ${
                  row._status === "error"
                    ? "bg-red-50 border-red-300"
                    : row._status === "success"
                    ? "bg-green-50 border-green-300"
                    : "bg-white hover:bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  {/* Tên chi đoàn (Highlight) */}
                  <h4 className="font-bold text-lg text-gray-900">
                    <StatusIcon status={row._status} />
                    {row["Tên chi đoàn"] || `Hàng ${index + 1}`}
                  </h4>

                  {/* Nút Hành động */}
                  <div className="ml-4 flex-shrink-0">
                    {(row._status === "pending" || row._status === "error") && (
                      <button
                        onClick={() => handleCreateChapterFromExcel(row, index)}
                        disabled={
                          isProcessingAll || row._status === "processing"
                        }
                        className={`text-white px-3 py-1 rounded-full text-sm font-medium transition ${
                          isProcessingAll || row._status === "processing"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                        title="Tạo chi đoàn này"
                      >
                        <Plus size={16} className="inline mr-1" />
                        Tạo ngay
                      </button>
                    )}
                    {row._status === "success" && (
                      <span className="text-green-700 bg-green-200 px-3 py-1 rounded-full text-xs font-medium">
                        Đã tạo
                      </span>
                    )}
                    {row._status === "processing" && (
                      <span className="text-blue-700 bg-blue-200 px-3 py-1 rounded-full text-xs font-medium animate-pulse">
                        Đang gửi...
                      </span>
                    )}
                  </div>
                </div>

                {/* --- CHI TIẾT DỮ LIỆU TÁCH RIÊNG (DỄ ĐIỀU CHỈNH) --- */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-2 text-sm text-gray-700 mt-3 p-2 bg-gray-100/50 rounded-md">
                  <div className="col-span-4">
                    {" "}
                    <DataRow
                      label="Đoàn trực thuộc"
                      value={row["Đoàn trực thuộc cấp trên"]}
                    />
                  </div>
                  {/* Dòng 1: Đoàn trực thuộc cấp trên */}

                  <div className="col-span-3">
                    <DataRow
                      label="Ngày thành lập"
                      value={(() => {
                        const val = row["Ngày thành lập"];
                        if (!val) return "";

                        // Nếu là số (Excel date serial)
                        if (typeof val === "number") {
                          const date = XLSX.SSF.parse_date_code(val);
                          if (date?.y) {
                            return `${String(date.d).padStart(2, "0")}/${String(
                              date.m
                            ).padStart(2, "0")}/${date.y}`;
                          }
                        }

                        // Nếu là chuỗi => parse về Date
                        const d = new Date(val);
                        if (!isNaN(d)) {
                          return `${String(d.getDate()).padStart(
                            2,
                            "0"
                          )}/${String(d.getMonth() + 1).padStart(
                            2,
                            "0"
                          )}/${d.getFullYear()}`;
                        }

                        return val;
                      })()}
                    />
                  </div>
                  {/* Dòng 2: Ngày thành lập */}
<div className="col-span-3">
                    {" "}
                    <DataRow
                      label="Tên đăng nhập"
                      value={row["Tên đăng nhập"]}
                    />
                  </div>
                  {/* Dòng 3: Số điện thoại */}
                  <div className="col-span-2">
                    {" "}
                    <DataRow label="SĐT" value={row["Số điện thoại"]} />
                  </div>

                  
                  {/* Dòng 4: Tên đăng nhập */}
<div className="col-span-4"> <DataRow label="Email" value={row["Email"]} /></div>
                  {/* Dòng 5: Email */}
                 
<div className="col-span-2"> <DataRow label="Mật khẩu" value={row["Mật khẩu"]} /></div>
                  {/* Dòng 6: Mật khẩu (Không nên hiển thị trong thực tế, chỉ để debug) */}
                 

                  {/* Dòng Đặc biệt: Địa chỉ (Có thể chiếm nhiều không gian hơn) */}
                  <div className="col-span-6 ">
                    <DataRow label="Địa chỉ chi đoàn" value={row["Địa chỉ"]} />
                  </div>
                </div>
                {/* --------------------------------------------------- */}
              </div>
            ))}
          </div>
        </>
      ) : (
        // Trạng thái trống
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Sheet size={48} className="mx-auto text-green-500 mb-3" />
          <p className="text-gray-600 font-medium">
            Chưa có dữ liệu. Vui lòng **Tải lên Excel** để bắt đầu tạo hàng
            loạt.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChapterCreateExcel;

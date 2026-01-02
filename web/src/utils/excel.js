import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const excelToJson = async (file) => {
  return new Promise((resolve, reject) => {
    if (!file) reject("File không hợp lệ!");

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);

        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.SheetNames[0]; // lấy sheet đầu tiên
        const worksheet = workbook.Sheets[sheet];

        const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        resolve(json);
      } catch (err) {
        reject(err);
      }
    };

    reader.readAsArrayBuffer(file);
  });
};

export const exportToExcel = ({ header, data, fileName = "data.xlsx" }) => {
  // Thêm cột STT vào header
  const extendedHeader = [{ label: "STT", key: "__stt__" }, ...header];

  // Format data + thêm STT
  const formattedData = data.map((item, index) => {
    const row = {};

    extendedHeader.forEach((h) => {
      if (h.key === "__stt__") {
        row[h.label] = index + 1; // STT
      } else {
        row[h.label] = item[h.key] ?? "";
      }
    });

    return row;
  });

  // Tạo worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // Auto width cho cột
  const columnWidths = extendedHeader.map((h) => ({
    wch: Math.max(
      h.label.length,
      ...formattedData.map((row) => String(row[h.label]).length)
    ) + 2,
  }));
  worksheet["!cols"] = columnWidths;

  // Tạo workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Xuất file
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(blob, fileName);
};

export const downloadPublicFile = (path, fileName) => {
  const link = document.createElement("a");
  link.href = path;         // đường dẫn file trong public
  link.download = fileName; // tên file muốn tải về
  link.click();
};
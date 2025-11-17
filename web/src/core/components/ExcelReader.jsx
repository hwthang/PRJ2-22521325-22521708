import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function ExcelReader() {
  const [jsonData, setJsonData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Lấy sheet đầu tiên
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Chuyển sheet thành JSON
      const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      setJsonData(json);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <h2>Upload Excel file</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      
      <h3>JSON Output:</h3>
      <pre>{JSON.stringify(jsonData, null, 2)}</pre>
    </div>
  );
}

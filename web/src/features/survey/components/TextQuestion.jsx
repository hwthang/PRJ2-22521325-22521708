import React from "react";

const TextQuestion = ({ question, value, onChange }) => {
  return (
    <div className="p-4 border rounded-xl bg-white shadow-sm">
      <p className="font-medium text-gray-700 mb-2">{question}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Nhập câu trả lời..."
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none min-h-[80px]"
      />
    </div>
  );
};

export default TextQuestion;

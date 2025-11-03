import React from "react";

const MultipleChoiceQuestion = ({ question, options, value = [], onChange }) => {
  const handleToggle = (opt) => {
    const updated = value.includes(opt)
      ? value.filter((o) => o !== opt)
      : [...value, opt];
    onChange(updated);
  };

  return (
    <div className="p-4 border rounded-xl bg-white shadow-sm">
      <p className="font-medium text-gray-700 mb-2">{question}</p>
      <div className="flex flex-col gap-2">
        {options.map((opt, idx) => (
          <label key={idx} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value.includes(opt)}
              onChange={() => handleToggle(opt)}
              className="text-blue-500 focus:ring-blue-400"
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;

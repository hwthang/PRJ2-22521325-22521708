import React, { useEffect, useState } from "react";

function ToggleInput({
  label,
  name,
  value,
  onChange,
  options = [
    { value: 1, label: "Một" },
    { value: 2, label: "Hai" },
  ],
}) {
  const [side, setSide] = useState("left");
  useEffect(() => {
    console.log(side);
  }, [side]);

  const handleChange = (e) => {
    const { value, id } = e.target;
    onChange(name, value);
    setSide(id);
  };

  return (
    <div className="relative z-0 flex w-full bg-gray-300 rounded-lg min-h-9 ">
      <label htmlFor="left" className={`w-1/2 relative z-20 flex py-1 items-center justify-center font-medium transition duration-450
        ${
          side == "left" && "text-white"
        }`}>
        {options[0].label}
      </label>
      <input
        type="radio"
        id="left"
        name="gender"
        className="hidden"
        value={options[0].value}
        onChange={handleChange}
        defaultChecked
      />

      <label htmlFor="right" className={`w-1/2 relative z-20 flex py-1 items-center justify-center font-medium transition duration-450
        ${
          side == "right" && "text-white"
        }`}>
        {options[1].label}
      </label>
      <input
        type="radio"
        id="right"
        name="gender"
        className="hidden"
        value={options[1].value}
        onChange={handleChange}
      />

      <div
        className={`rounded-lg bg-blue-600 w-1/2 absolute top-0 z-10 h-full transition duration-450 ${
          side == "left" ? "translate-x-0" : "translate-x-full"
        }`}
      ></div>
    </div>
  );
}

export default ToggleInput;

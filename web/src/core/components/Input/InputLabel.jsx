import React from "react";

function InputLabel({ label, value }) {
  return (
    <label
      className={`absolute z-10 left-0 text-blue-600 transition duration-900 ease-in-out bottom-2
            peer-focus:font-medium  ${
              value
                ? "font-medium -translate-y-7"
                : "peer-focus:-translate-y-7"
            }`}
    >
      {label}
    </label>
  );
}

export default InputLabel;

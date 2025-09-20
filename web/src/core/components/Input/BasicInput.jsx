import React, { useState } from "react";
import InputLabel from "./InputLabel";

function BasicInput({ label, name, value, onChange, ...props }) {
  return (
    <div className={`relative z-0 w-full`}>
      <input
        className={`peer outline-none border-b-2 w-full relative z-20 pt-2 pb-1 border-blue-600 `}
        name={name}
        value={value}
        onChange={onChange}
        {...props}
      />
      <InputLabel label={label} value={value} />
    </div>
  );
}

export default BasicInput;

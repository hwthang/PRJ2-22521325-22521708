import React, { useState } from "react";
import InputLabel from "./InputLabel";

function BasicInput({ className, label, name, value, onChange, ...props }) {
  return (
    <div className={`relative z-0 w-full h-full`}>
      <input
        className={`peer outline-none w-full relative z-20   ${
          className ? className : "border-b-2 border-blue-600 pt-2 pb-1"
        } `}
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

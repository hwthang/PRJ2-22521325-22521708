import React, { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import InputLabel from "./InputLabel";
function PasswordInput({ label, name, value, onChange, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={`relative z-0 `}>
      <input
        className={`peer outline-none border-b-2 w-full relative z-20 pt-2 pb-1 border-blue-600 pr-10`}
        name={name}
        value={value}
        type={showPassword ? "text" : "password"}
        onChange={onChange}
        {...props}

      />

      {showPassword ? (
        <LuEyeOff
          className="absolute right-0 bottom-0 h-full text-blue-600 z-30"
          size={24}
          onClick={() => setShowPassword(false)}
        />
      ) : (
        <LuEye
          className="absolute right-0 bottom-0 h-full text-blue-600 z-30"
          size={24}
          onClick={() => setShowPassword(true)}
        />
      )}

      <InputLabel label={label} value={value}/>
    </div>
  );
}

export default PasswordInput;

import React, { useState } from "react";
import CustomInput from "./CustomInput";
import { Eye, EyeOff } from "lucide-react";

function CustomPassword({ ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <CustomInput
      afterIcon={
        showPassword ? (
          <EyeOff onClick={() => setShowPassword(false)} />
        ) : (
          <Eye onClick={() => setShowPassword(true)} />
        )
      }
      type={showPassword ? "text" : "password"}
      {...props}
    />
  );
}

export default CustomPassword;

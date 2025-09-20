import React, { useEffect, useState } from "react";
import SelectInput from "./SelectInput";
import { provinces } from "../../assets/data/provinces";
import { communes } from "../../assets/data/communes";
import BasicInput from "./BasicInput";

function AddressInput({ label, name, value, onChange, ...props }) {
  const [address, setAddress] = useState({
    province: "",
    commune: "",
    detail: "",
  });

  const handleChange = (name, value) => {
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    onChange(name, address);
    console.log(address);
  }, [address]);
  return (
    <div className="flex flex-col relative z-0 gap-8">
      <div className="text-blue-600 font-medium flex items-center gap-2 -mb-2">
        <div className="border-2 flex-1 h-1 rounded-lg"></div>
        <p className="text-xl">{label}</p>
        <div className="border-2 flex-1 h-1 rounded-lg"></div>
      </div>
      <div className="flex flex-col md:flex-row gap-10 md:gap-8">
        <div className="relative z-50 flex-1">
          <SelectInput
            label={"Tỉnh/Thành phố"}
            name={"province"}
            value={address.province}
            onChange={handleChange}
            {...props}
            options={provinces}
          />
        </div>
        <div className="flex-1">
          <SelectInput
            label={"Phường/Xã"}
            name={"commune"}
            value={address.commune}
            onChange={handleChange}
            {...props}
            options={
              address.province
                ? communes.filter((item) => item.province == address.province)
                : communes
            }
          />
        </div>
      </div>

      <BasicInput
        label={"Địa chỉ cụ thể"}
        name={"detail"}
        value={address.detail}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
      />
    </div>
  );
}

export default AddressInput;

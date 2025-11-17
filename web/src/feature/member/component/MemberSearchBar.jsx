import { ArrowDownWideNarrow, RotateCcw, Search } from "lucide-react";
import React from "react";
import { BiAddToQueue } from "react-icons/bi";
import { Link } from "react-router-dom";
import { STATUS_MAP } from "../../../utils/map";
import CustomBox from "../../chapter/shared/CustomBox";
import CustomInput from "../../chapter/shared/CustomInput";

function MemberSearchBar() {
  return (
    <div className="z-10 w-full mb-6 grid md:grid-cols-12 gap-6 shadow-md p-6 rounded-md bg-white sticky top-0">
      <CustomInput
        beforeIcon={<Search />}
        placeholder="Tìm kiếm theo tên đoàn viên hoặc số thẻ đoàn..."
        className={"col-span-12 md:col-span-5"}
      />

      <CustomBox className={"col-span-12 md:col-span-3"}>
        <ArrowDownWideNarrow className="text-gray-400" size={20} />
        <select className="h-full w-full outline-none cursor-pointer bg-white">
          <option value={0}>Ngày vào đoàn tăng dần</option>
          <option value={1}>Ngày vào đoàn giảm dần</option>
          <option value={2}>Chức vụ tăng dần</option>
          <option value={3}>Chức vụ giảm dần</option>
          <option value={4}>Tên đoàn viên A-Z</option>
        </select>
      </CustomBox>
      <div className="h-10 gap-6 rounded-lg col-span-12 md:col-span-3 flex items-center has-[select:focus]:border-blue-600 transition-all">
        {["active", "pending", "locked"].map((item) => (
          <label
            key={item}
            className={`aspect-square h-full rounded-full font-semibold flex items-center justify-center has-[input:not(:checked)]:bg-gray-300 has-[input:not(:checked)]:text-gray-600 ${STATUS_MAP[item].color}`}
          >
            {STATUS_MAP[item].icon}
            <input
              type="checkbox"
              className="hidden"
              // onClick={() => handleFilterToggle(item)}
              // checked={filter.includes(item)}
            />
          </label>
        ))}
        <div
          // onClick={() => handleResetFilters()}
          className={`aspect-square h-full rounded-full font-semibold flex items-center justify-center active:bg-gray-100 transition-all `}
        >
          <RotateCcw />
        </div>
      </div>
      <div className="h-10 rounded-lg col-span-12 md:col-span-1 flex justify-end">
        <Link
          to="/members/create"
          className="bg-blue-600 h-full w-full text-white flex items-center justify-center rounded-lg font-semibold gap-2 active:bg-blue-500 transition-all hover:bg-blue-700"
        >
          <BiAddToQueue size={24} />
        </Link>
      </div>
    </div>
  );
}

export default MemberSearchBar;

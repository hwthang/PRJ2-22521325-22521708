import React from "react";
import CustomInput from "../../chapter/shared/CustomInput";
import { ArrowDownWideNarrow, Search } from "lucide-react";
import CustomBox from "../../chapter/shared/CustomBox";
import { CheckOption } from "../../../core/components/CheckOption";
import { EVENT_TAGS } from "../shared/EventMap";

const EventSearchBar = ({
  searchText,
  setSearchText,
  sortOrder,
  setSortOrder,
  selectedStatus,
  setSelectedStatus,
  selectedTags,
  setSelectedTags,
}) => {
  // Chuyển EVENT_TAGS thành options cho CheckOption
  const eventTagOptions = Object.fromEntries(
    Object.entries(EVENT_TAGS).map(([key, { label }], index) => [
      key,
      {
        label,
        color: ["blue", "green", "yellow", "red", "purple", "cyan", "pink"][
          index % 7
        ],
      },
    ])
  );

  return (
    <div className="shadow-lg border border-gray-200 p-6 rounded-md grid grid-cols-12 gap-2">
      {/* Input tìm kiếm */}
      <CustomInput
        className={"col-span-12 md:col-span-5"}
        beforeIcon={<Search />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Tìm kiếm sự kiện..."
      />

      {/* Dropdown sắp xếp */}
      <CustomBox
        className={"col-span-12  md:col-span-3"}
        beforeIcon={<ArrowDownWideNarrow className="text-gray-400" size={20} />}
      >
        <select
          className="w-full outline-none"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Ngày bắt đầu tăng dần</option>
          <option value="desc">Ngày bắt đầu giảm dần</option>
        </select>
      </CustomBox>

      {/* CheckOption trạng thái */}
      <div className="col-span-12 md:col-span-4">
        <CheckOption
          options={{
            sap_dien_ra: { label: "Sắp diễn ra", color: "yellow" },
            dang_dien_ra: { label: "Đang diễn ra", color: "blue" },
            da_huy: { label: "Đã hủy", color: "red" },
            da_ket_thuc: { label: "Đã kết thúc", color: "green" },
          }}
          value={selectedStatus}
          onChange={setSelectedStatus}
          multiple={true}
        />
      </div>

      {/* CheckOption tags */}
      <div className="col-span-12">
        <div className="font-medium pb-2">Nhãn</div>
        <CheckOption
          options={eventTagOptions}
          value={selectedTags}
          onChange={setSelectedTags}
          multiple={true}
        />
      </div>
    </div>
  );
};

export default EventSearchBar;

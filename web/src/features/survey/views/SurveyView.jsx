import React, { useState, useRef, useEffect } from "react";
import SurveyTable from "../components/SurveyTable";

// ================= Search Input =================
function SearchInput({ value, onChange }) {
  return (
    <div className="relative flex-1 w-full">
      <input
        placeholder="Tìm kiếm khảo sát"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-2 border-gray-300 focus:border-blue-600 outline-none p-2 w-full rounded-lg"
      />
    </div>
  );
}

// ================= Dropdown Trạng thái =================
function StatusDropdown({ selected = [], onChange }) {
  const statuses = [
    { value: "draft", label: "Nháp" },
    { value: "published", label: "Đang phát hành" },
    { value: "closed", label: "Đã đóng" },
  ];

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (val) => {
    if (selected.includes(val)) onChange(selected.filter((s) => s !== val));
    else onChange([...selected, val]);
  };

  const renderSummary = () => {
    if (selected.length === 0) return "Chọn trạng thái";
    if (selected.length <= 2)
      return statuses
        .filter((s) => selected.includes(s.value))
        .map((s) => s.label)
        .join(", ");
    return `${selected.length} mục đã chọn`;
  };

  const clearAll = (e) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <div
      className="flex-1 flex items-end gap-4 py-[0px] rounded-lg md:justify-around"
      ref={ref}
    >
      <span className="text-nowrap font-medium w-30 md:w-fit relative -top-2">
        Trạng thái:
      </span>

      <div className="relative flex-1 min-w-0">
        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          className={`w-full h-[42px] border-2 rounded-lg p-2 flex items-center justify-between bg-white outline-none
            ${open ? "border-blue-600" : "border-gray-300 hover:border-blue-400"}`}
        >
          <div className="min-w-0">
            <span
              className="block overflow-hidden text-ellipsis whitespace-nowrap"
              title={renderSummary()}
            >
              {renderSummary()}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {selected.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
              >
                Xóa
              </button>
            )}
            <svg
              className={`w-4 h-4 transform transition-transform duration-200 ${
                open ? "rotate-180" : "rotate-0"
              }`}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 7l5 5 5-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>

        {open && (
          <div className="absolute top-full left-0 z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <ul className="max-h-48 overflow-y-auto p-2">
              {statuses.map((it) => (
                <li
                  key={it.value}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(it.value);
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(it.value)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleOption(it.value);
                    }}
                  />
                  <span className="min-w-0 block overflow-hidden text-ellipsis whitespace-nowrap">
                    {it.label}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center p-2 border-t">
              <small className="text-gray-500">
                Chọn nhiều bằng checkbox
              </small>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(statuses.map((i) => i.value));
                  }}
                  className="px-3 py-1 text-sm bg-blue-100 rounded hover:bg-blue-200"
                >
                  Chọn tất cả
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange([]);
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                >
                  Bỏ chọn
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ================= Search Button =================
function SearchButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full h-[42px] rounded-lg bg-blue-900 text-white text-nowrap flex items-center justify-center hover:bg-blue-800 active:scale-95 transition"
    >
      Tìm kiếm
    </button>
  );
}

// ================= Header Component =================
function SurveyHeader({ onRefresh, onAdd }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
      <p className="font-medium text-2xl text-nowrap">Danh sách khảo sát</p>
      <div className="flex w-full justify-between md:justify-end gap-6 items-center">
        <button
          onClick={onRefresh}
          className="px-6 py-2 bg-blue-900 active:bg-blue-800 text-white rounded-lg"
        >
          Làm mới
        </button>
        <button
          onClick={onAdd}
          className="px-6 py-2 bg-blue-900 active:bg-blue-800 text-white rounded-lg"
        >
          Thêm khảo sát
        </button>
      </div>
    </div>
  );
}

// ================= Main Component =================
function SurveyListView() {
  const [searchText, setSearchText] = useState("");
  const [statuses, setStatuses] = useState([]);

  const handleSearchClick = () => {
    console.log("🔍 Search:", { searchText, statuses });
  };

  const handleRefreshClick = () => {
    setSearchText("");
    setStatuses([]);
  };

  const handleAddSurveyClick = () => {
    console.log("➕ Thêm khảo sát mới");
  };

  return (
    <div className="h-full w-full relative z-10">
      <div className="h-fit w-full p-6 md:p-10 flex flex-col gap-6 md:gap-10">
        {/* Bộ lọc */}
        <div className="bg-white rounded-lg p-6 flex flex-col gap-6 relative">
          <SearchInput value={searchText} onChange={setSearchText} />
          <div className="flex flex-col md:flex-row md:items-end gap-6 w-full">
            <div className="flex-1 flex items-end">
              <StatusDropdown selected={statuses} onChange={setStatuses} />
            </div>
            <div className="w-full md:w-[150px] flex items-end">
              <SearchButton onClick={handleSearchClick} />
            </div>
          </div>
        </div>

        {/* Bảng khảo sát */}
        <div className="flex flex-col gap-2">
          <div className="bg-white p-6 rounded-lg h-full w-full overflow-auto flex flex-col gap-6">
            <SurveyHeader
              onRefresh={handleRefreshClick}
              onAdd={handleAddSurveyClick}
            />
            <div className="h-fit w-full overflow-auto">
              <SurveyTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SurveyListView;

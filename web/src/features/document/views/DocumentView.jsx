// import React from 'react'

// function DocumentView() {
//   return (
//     <div>DocumentView</div>
//   )
// }

// export default DocumentView
import React, { useState, useRef, useEffect } from "react";
import DocumentTable from "../components/DocumentTable";

// ================= Filter Components =================
function SearchInput({ value, onChange }) {
  return (
    <div className="relative flex-1 w-full">
      <input
        placeholder="Tìm kiếm tài liệu"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-2 border-gray-300 focus:border-blue-600 outline-none p-2 w-full rounded-lg"
      />
    </div>
  );
}

function TypeFilter({ selected, onChange }) {
  const types = [
    { value: "Quy định", label: "Quy định" },
    { value: "Hướng dẫn", label: "Hướng dẫn" },
    { value: "Báo cáo", label: "Báo cáo" },
    { value: "Quyết định", label: "Quyết định" },
    { value: "Thông tư", label: "Thông tư" },
  ];

  const toggle = (type) => {
    if (selected.includes(type)) {
      onChange(selected.filter((t) => t !== type));
    } else {
      onChange([...selected, type]);
    }
  };

  return (
    <div className="flex-1 flex gap-4 items-center md:justify-around bg-blue-100 p-2 rounded-lg">
      <span className="text-nowrap font-medium w-30 md:w-fit">Loại tài liệu:</span>
      <ul className="flex gap-4 w-full items-center md:justify-around flex-wrap">
        {types.map((t) => (
          <li key={t.value} className="flex gap-2 items-center justify-center">
            <input
              type="checkbox"
              value={t.value}
              checked={selected.includes(t.value)}
              onChange={() => toggle(t.value)}
            />
            {t.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ================= IssuedByFilter: dropdown with checkboxes =================
function IssuedByFilter({ selected = [], onChange }) {
  const issuers = [
    { value: "Sở Nội vụ", label: "Sở Nội vụ" },
    { value: "Phòng Hành chính", label: "Phòng Hành chính" },
    { value: "Ủy ban Nhân dân Tỉnh", label: "Ủy ban Nhân dân Tỉnh" },
    { value: "Bộ Thông tin và Truyền thông", label: "Bộ Thông tin và Truyền thông" },
    { value: "Cục Văn thư Lưu trữ Nhà nước", label: "Cục Văn thư Lưu trữ Nhà nước" },
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

  const clearAll = (e) => {
    e.stopPropagation();
    onChange([]);
  };

  const renderSummary = () => {
    if (!selected || selected.length === 0) return "Chọn nơi ban hành";
    if (selected.length <= 3) return selected.join(", ");
    const remaining = selected.length - 3;
    return `${selected.slice(0, 3).join(", ")}, +${remaining} ...`;
  };


  return (
    <div className="flex-1 flex items-end gap-4 py-[0px] rounded-lg md:justify-around" ref={ref}>

      {/* label cùng hàng */}
      <span className="text-nowrap font-medium w-30 md:w-fit relative -top-2">Nơi ban hành:</span>


      {/* wrapper để đảm bảo truncate hoạt động trong flex */}
      <div className="relative flex-1 min-w-0">
        {/* trigger (chiếm toàn bộ width của wrapper) */}
        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          className={`w-full h-[42px] border-2 rounded-lg p-2 flex items-center justify-between bg-white outline-none
            ${open ? "border-blue-600" : "border-gray-300 hover:border-blue-400"}`}
        >
          {/* min-w-0 + truncate để phần thừa hiển thị ... */}
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
                title="Bỏ chọn tất cả"
              >
                Xóa
              </button>
            )}
            <svg
              className={`w-4 h-4 transform transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
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

        {/* dropdown menu: cùng width với trigger, không mở rộng */}
        {open && (
          <div className="absolute top-full left-0 z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <ul className="max-h-48 overflow-y-auto p-2">
              {issuers.map((it) => (
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
                  {/* mỗi item cũng truncate để không làm rộng dropdown */}
                  <span className="min-w-0 block overflow-hidden text-ellipsis whitespace-nowrap">
                    {it.label}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center p-2 border-t">
              <small className="text-gray-500">Giữ checkbox để chọn nhiều mục</small>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(issuers.map((i) => i.value));
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
function DocumentHeader({ onRefresh, onAdd }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
      <p className="font-medium text-2xl text-nowrap">Danh sách tài liệu</p>
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
          Thêm tài liệu
        </button>
      </div>
    </div>
  );
}

// ================= Main Component =================
function DocumentListView() {
  // State
  const [searchText, setSearchText] = useState("");
  const [types, setTypes] = useState([]);
  const [issuers, setIssuers] = useState([]);

  // Handler
  const handleSearchClick = () => {
    console.log("🔍 Search data:", {
      searchText,
      types,
      issuers,
    });
    // TODO: call API / filter local data
  };

  const handleRefreshClick = () => {
    console.log("🔄 Làm mới dữ liệu!");
    setSearchText("");
    setTypes([]);
    setIssuers([]);
  };

  const handleAddDocumentClick = () => {
    console.log("➕ Thêm tài liệu mới!");
  };

  return (
    <div className="h-full w-full relative z-10">
      <div className="h-fit w-full p-6 md:p-10 flex flex-col gap-6 md:gap-10">
        {/* Bộ lọc */}
        {/* Bộ lọc */}
<div className="bg-white rounded-lg p-6 flex flex-col gap-6 relative">
  {/* Ô tìm kiếm trên cùng */}
  <SearchInput value={searchText} onChange={setSearchText} />

  {/* Hàng filter dưới */}
<div className="flex flex-col md:flex-row md:items-end gap-6 w-full">
  {/* Loại tài liệu */}
  <div className="flex-1 flex items-end">
    <TypeFilter selected={types} onChange={setTypes} />
  </div>

  {/* Nơi ban hành */}
  <div className="flex-1 flex items-end">
    <IssuedByFilter selected={issuers} onChange={setIssuers} />
  </div>

  {/* Nút tìm kiếm */}
  <div className="w-full md:w-[150px] flex items-end">
    <SearchButton onClick={handleSearchClick} />
  </div>
</div>

</div>


        {/* Bảng tài liệu */}
        <div className="flex flex-col gap-2">
          <div className="bg-white p-6 rounded-lg h-full w-full overflow-auto flex flex-col gap-6">
            <DocumentHeader
              onRefresh={handleRefreshClick}
              onAdd={handleAddDocumentClick}
            />
            <div className="h-fit w-full overflow-auto">
              <DocumentTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentListView;


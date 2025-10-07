// import React, { useState, useRef, useEffect } from "react";
// import EventTable from "../components/EventTable";

// // ================= Search Input =================
// function SearchInput({ value, onChange }) {
//   return (
//     <div className="relative flex-1 w-full">
//       <input
//         placeholder="Tìm kiếm sự kiện"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="border-2 border-gray-300 focus:border-blue-600 outline-none p-2 w-full rounded-lg"
//       />
//     </div>
//   );
// }

// // ================= Dropdown Tình trạng =================
// function StatusDropdown({ selected = [], onChange }) {
//   const statuses = [
//     { value: "upcoming", label: "Sắp diễn ra" },
//     { value: "ongoing", label: "Đang diễn ra" },
//     { value: "completed", label: "Đã kết thúc" },
//     { value: "cancelled", label: "Đã hủy" },
//   ];

//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);

//   useEffect(() => {
//     function handleClickOutside(e) {
//       if (ref.current && !ref.current.contains(e.target)) setOpen(false);
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const toggleOption = (val) => {
//     if (selected.includes(val)) onChange(selected.filter((s) => s !== val));
//     else onChange([...selected, val]);
//   };

//   const renderSummary = () => {
//     if (selected.length === 0) return "Chọn tình trạng";
//     if (selected.length <= 2)
//       return statuses
//         .filter((s) => selected.includes(s.value))
//         .map((s) => s.label)
//         .join(", ");
//     return `${selected.length} mục đã chọn`;
//   };

//   const clearAll = (e) => {
//     e.stopPropagation();
//     onChange([]);
//   };

//   return (
//     <div
//       className="flex-1 flex items-end gap-4 py-[0px] rounded-lg md:justify-around"
//       ref={ref}
//     >
//       <span className="text-nowrap font-medium w-30 md:w-fit relative -top-2">
//         Tình trạng:
//       </span>

//       <div className="relative flex-1 min-w-0">
//         <button
//           type="button"
//           onClick={() => setOpen((s) => !s)}
//           className={`w-full h-[42px] border-2 rounded-lg p-2 flex items-center justify-between bg-white outline-none
//             ${open ? "border-blue-600" : "border-gray-300 hover:border-blue-400"}`}
//         >
//           <div className="min-w-0">
//             <span
//               className="block overflow-hidden text-ellipsis whitespace-nowrap"
//               title={renderSummary()}
//             >
//               {renderSummary()}
//             </span>
//           </div>

//           <div className="flex items-center gap-2 flex-shrink-0 ml-2">
//             {selected.length > 0 && (
//               <button
//                 type="button"
//                 onClick={clearAll}
//                 className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
//               >
//                 Xóa
//               </button>
//             )}
//             <svg
//               className={`w-4 h-4 transform transition-transform duration-200 ${
//                 open ? "rotate-180" : "rotate-0"
//               }`}
//               viewBox="0 0 20 20"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 d="M5 7l5 5 5-5"
//                 stroke="currentColor"
//                 strokeWidth="1.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </div>
//         </button>

//         {open && (
//           <div className="absolute top-full left-0 z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md">
//             <ul className="max-h-48 overflow-y-auto p-2">
//               {statuses.map((it) => (
//                 <li
//                   key={it.value}
//                   className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleOption(it.value);
//                   }}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selected.includes(it.value)}
//                     onChange={(e) => {
//                       e.stopPropagation();
//                       toggleOption(it.value);
//                     }}
//                   />
//                   <span className="min-w-0 block overflow-hidden text-ellipsis whitespace-nowrap">
//                     {it.label}
//                   </span>
//                 </li>
//               ))}
//             </ul>

//             <div className="flex justify-between items-center p-2 border-t">
//               <small className="text-gray-500">
//                 Chọn nhiều bằng checkbox
//               </small>
//               <div className="flex gap-2">
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onChange(statuses.map((i) => i.value));
//                   }}
//                   className="px-3 py-1 text-sm bg-blue-100 rounded hover:bg-blue-200"
//                 >
//                   Chọn tất cả
//                 </button>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onChange([]);
//                   }}
//                   className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
//                 >
//                   Bỏ chọn
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ================= Search Button =================
// function SearchButton({ onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className="w-full h-[42px] rounded-lg bg-blue-900 text-white text-nowrap flex items-center justify-center hover:bg-blue-800 active:scale-95 transition"
//     >
//       Tìm kiếm
//     </button>
//   );
// }

// // ================= Header Component =================
// function EventHeader({ onRefresh, onAdd }) {
//   return (
//     <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
//       <p className="font-medium text-2xl text-nowrap">Danh sách sự kiện</p>
//       <div className="flex w-full justify-between md:justify-end gap-6 items-center">
//         <button
//           onClick={onRefresh}
//           className="px-6 py-2 bg-blue-900 active:bg-blue-800 text-white rounded-lg"
//         >
//           Làm mới
//         </button>
//         <button
//           onClick={onAdd}
//           className="px-6 py-2 bg-blue-900 active:bg-blue-800 text-white rounded-lg"
//         >
//           Thêm sự kiện
//         </button>
//       </div>
//     </div>
//   );
// }

// // ================= Main Component =================
// function EventListView() {
//   const [searchText, setSearchText] = useState("");
//   const [statuses, setStatuses] = useState([]);

//   const handleSearchClick = () => {
//     console.log("🔍 Search:", { searchText, statuses });
//   };

//   const handleRefreshClick = () => {
//     setSearchText("");
//     setStatuses([]);
//   };

//   const handleAddEventClick = () => {
//     console.log("➕ Thêm sự kiện mới");
//   };

//   return (
//     <div className="h-full w-full relative z-10">
//       <div className="h-fit w-full p-6 md:p-10 flex flex-col gap-6 md:gap-10">
//         {/* Bộ lọc */}
//         <div className="bg-white rounded-lg p-6 flex flex-col gap-6 relative">
//           <SearchInput value={searchText} onChange={setSearchText} />
//           <div className="flex flex-col md:flex-row md:items-end gap-6 w-full">
//             <div className="flex-1 flex items-end">
//               <StatusDropdown selected={statuses} onChange={setStatuses} />
//             </div>
//             <div className="w-full md:w-[150px] flex items-end">
//               <SearchButton onClick={handleSearchClick} />
//             </div>
//           </div>
//         </div>

//         {/* Bảng sự kiện */}
//         <div className="flex flex-col gap-2">
//           <div className="bg-white p-6 rounded-lg h-full w-full overflow-auto flex flex-col gap-6">
//             <EventHeader
//               onRefresh={handleRefreshClick}
//               onAdd={handleAddEventClick}
//             />
//             <div className="h-fit w-full overflow-auto">
//               <EventTable />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default EventListView;

import React, { useState } from "react";
import EventTable from "../components/EventTable";

// ================= Search Input =================
function SearchInput({ value, onChange }) {
  return (
    <div className="relative flex-1 w-full">
      <input
        placeholder="Tìm kiếm sự kiện"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-2 border-gray-300 focus:border-blue-600 outline-none p-2 w-full rounded-lg"
      />
    </div>
  );
}

// ================= Trạng thái filter (checkbox) =================
function StatusFilter({ selected, onChange }) {
  const statuses = [
    { value: "upcoming", label: "Sắp diễn ra" },
    { value: "ongoing", label: "Đang diễn ra" },
    { value: "completed", label: "Đã kết thúc" },
    { value: "cancelled", label: "Đã hủy" },
  ];

  const toggle = (value) => {
    if (selected.includes(value)) onChange(selected.filter((s) => s !== value));
    else onChange([...selected, value]);
  };

  return (
    <div className="flex-1 flex md:justify-around gap-4 items-center bg-blue-100 p-2 rounded-lg">
      <span className="text-nowrap font-medium w-30 md:w-fit">Tình trạng:</span>
      <ul className="flex w-full md:justify-around gap-4 items-center flex-wrap">
        {statuses.map((s) => (
          <li key={s.value} className="flex gap-2 items-center justify-center">
            <input
              type="checkbox"
              value={s.value}
              checked={selected.includes(s.value)}
              onChange={() => toggle(s.value)}
            />
            {s.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ================= Bộ lọc thời gian =================
function DateRangeFilter({ startDate, endDate, onChange }) {
  return (
    <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4 bg-blue-100 p-2 rounded-lg">
      <span className="text-nowrap font-medium w-30 md:w-fit">Thời gian:</span>
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="flex items-center gap-2 w-full md:w-1/2">
          <label className="text-sm text-gray-700">Bắt đầu:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onChange("start", e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full focus:border-blue-600 outline-none"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-1/2">
          <label className="text-sm text-gray-700">Kết thúc:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onChange("end", e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full focus:border-blue-600 outline-none"
          />
        </div>
      </div>
    </div>
  );
}

// ================= Nút tìm kiếm =================
function SearchButton({ onClick }) {
  return (
    <div className="flex gap-4 justify-center relative mt-2">
      <button
        onClick={onClick}
        className="w-full px-6 h-[42px] py-2 rounded-lg bg-blue-900 text-white text-nowrap active:bg-blue-800"
      >
        Tìm kiếm
      </button>
    </div>
  );
}

// ================= Header =================
function EventHeader({ onRefresh, onAdd }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
      <p className="font-medium text-2xl text-nowrap">Danh sách sự kiện</p>
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
          Thêm sự kiện
        </button>
      </div>
    </div>
  );
}

// ================= Main Component =================
function EventListView() {
  const [searchText, setSearchText] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [dates, setDates] = useState({ start: "", end: "" });

  const handleDateChange = (type, value) => {
    setDates((prev) => ({ ...prev, [type]: value }));
  };

  const handleSearchClick = () => {
    console.log("Tìm kiếm:", { searchText, statuses, ...dates });
  };

  const handleRefreshClick = () => {
    setSearchText("");
    setStatuses([]);
    setDates({ start: "", end: "" });
  };

  const handleAddEventClick = () => {
    console.log("Thêm sự kiện mới");
  };

  return (
    <div className="h-full w-full relative z-10">
      <div className="h-fit w-full p-6 md:p-10 flex flex-col gap-6 md:gap-10">
        {/* Bộ lọc */}
        <div className="bg-white rounded-lg p-6 flex flex-col gap-6 relative">
          <SearchInput value={searchText} onChange={setSearchText} />

          <div className="flex flex-col gap-6 md:flex-row">
            <StatusFilter selected={statuses} onChange={setStatuses} />
            <DateRangeFilter
              startDate={dates.start}
              endDate={dates.end}
              onChange={handleDateChange}
            />
            <SearchButton onClick={handleSearchClick} />
          </div>
        </div>

        {/* Bảng sự kiện */}
        <div className="flex flex-col gap-2">
          <div className="bg-white p-6 rounded-lg h-full w-full overflow-auto flex flex-col gap-6">
            <EventHeader
              onRefresh={handleRefreshClick}
              onAdd={handleAddEventClick}
            />
            <div className="h-fit w-full overflow-auto">
              <EventTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventListView;

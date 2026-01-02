import React from 'react'
import { IoClose } from 'react-icons/io5'

function CheckBoxFilter({
  label = "Chọn mục",   // Mặc định
  options = [           // Options tổng quát
    { value: "option_1", label: "Option 1" },
    { value: "option_2", label: "Option 2" },
    { value: "option_3", label: "Option 3" },
  ],
  filterName = "filter",
  filter = [],
  setFilter = () => console.log("setFilter called"),
  handleClickLabel = (name, value) =>
    console.log("handleClickLabel:", name, value),
}) {
  return (
    <div className="border flex gap-4 font-medium text-blue-900 items-center p-2">
      {label}:
      <div className="flex gap-4">
        {options.map((item) => (
          <div
            key={item.value}
            className={`h-full p-1 px-2 rounded-lg font-normal cursor-pointer active:opacity-90 ${
              filter.includes(item.value)
                ? "bg-blue-900 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => handleClickLabel(filterName, item.value)}
          >
            {item.label}
          </div>
        ))}
      </div>

      <IoClose
        size={30}
        className={`transition-all duration-400 ease-in-out rounded-full ${
          filter.length > 0 ? "text-red-600 active:bg-gray-200" : "w-0"
        }`}
        onClick={() => setFilter([])}
      />
    </div>
  )
}

export default CheckBoxFilter

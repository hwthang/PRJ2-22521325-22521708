import React from 'react'
import { IoClose } from 'react-icons/io5'

function CheckBoxFilter({label, options,filterName,filter, setFilter, handleClickLabel}) {
  return (
     <div className="border flex gap-4 font-medium text-blue-900 items-center">
              {label}:
              <div className="flex gap-4">
                {options.map((item) => (
                  <div
                    className={`h-full p-1 px-2 rounded-lg font-normal cursor-pointer active:opacity-90 ${
                      filter.includes(item.value)
                        ? "bg-blue-900 text-white"
                        : "bg-gray-200"
                    }`}
                    key={item.value}
                    onClick={() => handleClickLabel(filterName,item.value)}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
               <IoClose
                      size={30}
                      className={`transition-all duration-400 ease-in-out rounded-full ${
                        filter.length>0 ? "text-red-600 w-fit active:bg-gray-200" : "w-0"
                      }`}
                      onClick={()=>setFilter([])}
                    />
            </div>
  )
}

export default CheckBoxFilter
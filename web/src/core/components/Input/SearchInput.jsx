import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoClose } from "react-icons/io5";

function SearchInput() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex gap-2 justify-center items-center border-2 border-blue-800 rounded-lg p-1">
      <IoIosSearch size={30} className="text-blue-800" />
      <input
        className="outline-none flex-1"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <IoClose
        size={30}
        className={`transition-all duration-400 ease-in-out rounded-full ${
          search ? "text-red-600 w-fit active:bg-gray-200" : "w-0"
        }`}
        onClick={()=>setSearch('')}
      />
    </div>
  );
}

export default SearchInput;

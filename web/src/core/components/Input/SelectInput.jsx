import React, { useEffect, useRef, useState } from "react";
import InputLabel from "./InputLabel";
import { IoChevronDownOutline } from "react-icons/io5";

function SelectInput({ label, name, value, onChange, options = [], ...props }) {
  const [query, setQuery] = useState("");
  const [collections, setCollections] = useState(options);
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef(null);

  // cập nhật collections khi options thay đổi
  useEffect(() => {
    setCollections(options);
  }, [options]);

  const handleClick = (item) => {
    setQuery(item.label);        // hiển thị label
    setOpen(false);
    if (onChange) onChange(name, item.value); // báo ra ngoài giá trị thực
  };

  const handleQuery = (e) => {
    const { value } = e.target;
    setQuery(value);

    // filter theo label thay vì value
    setCollections(
      value.trim() !== ""
        ? options.filter((item) =>
            item?.label?.toLowerCase().includes(value.toLowerCase())
          )
        : options
    );
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);

        // nếu query không trùng với label nào thì reset
        if (!options.find((item) => item.label === query)) {
          setQuery("");
        }

        setCollections(options);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [options, query]);

  return (
    <div ref={wrapperRef} className="relative z-10 w-full">
      <input
        className="peer outline-none border-b-2 w-full relative z-20 pt-2 pb-1 border-blue-600 pr-10"
        name={name}
        value={query}
        onChange={handleQuery}
        onFocus={() => setOpen(true)}
        {...props}
      />

      <IoChevronDownOutline
        className={`absolute right-0 bottom-0 h-full text-blue-600 z-30 transition duration-450 cursor-pointer ${
          open ? "rotate-180" : ""
        }`}
        size={24}
        onClick={() => setOpen((prev) => !prev)}
      />

      {open && (
        <div className="absolute shadow-[0_0_12px_#c9c9c9] top-[120%] rounded-lg w-full max-h-40 bg-white overflow-auto z-50 transition-all duration-300">
          {collections.map((item, index) => (
            <div
              key={index}
              className="p-2 w-full hover:bg-blue-200 cursor-pointer"
              onMouseDown={() => handleClick(item)}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}

      <InputLabel label={label} value={query} />
    </div>
  );
}

export default SelectInput;

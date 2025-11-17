import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ChapterItem from "../component/ChapterItem";
import { BiAddToQueue } from "react-icons/bi";
import { ArrowDownWideNarrow, RotateCcw, Search, X } from "lucide-react";
import { STATUS_MAP } from "../../../utils/map";
import CustomInput from "../shared/CustomInput";
import CustomBox from "../shared/CustomBox";
import ChapterSearchBar from "../component/ChapterSearchBar";

function ChapterListView({
  chapters,
  search,
  setSearch,
  sort,
  setSort,
  filter,
  setFilter,
}) {
  useEffect(() => {
    // console.log(chapters);
  }, [chapters]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  // Xử lý bật/tắt filter trạng thái (Gắn vào onClick của mỗi <label> trạng thái)
  const handleFilterToggle = (statusKey) => {
    setFilter((prevFilter) => {
      if (prevFilter.includes(statusKey)) {
        // Nếu trạng thái đã tồn tại, XÓA nó khỏi mảng (bỏ chọn)
        return prevFilter.filter((item) => item !== statusKey);
      } else {
        // Nếu trạng thái chưa tồn tại, THÊM nó vào mảng (chọn)
        return [...prevFilter, statusKey];
      }
    });
  };

  // Xử lý Reset tất cả bộ lọc (Gắn vào onClick của nút RotateCcw)
  const handleResetFilters = () => {
    setSearch("");
    setFilter([]);
    // Giữ nguyên sort, hoặc thêm setSort(0) nếu muốn reset cả sắp xếp
    setSort(0);
  };

  return (
    <div>
      {/* Bộ lọc đầu trang */}
      <ChapterSearchBar
        search={search}
        handleSearchChange={handleSearchChange}
        sort={sort}
        handleSortChange={handleSortChange}
        filter={filter}
        handleFilterToggle={handleFilterToggle}
        handleResetFilters={handleResetFilters}
      />

      {/* Danh sách chi đoàn */}
      <div className="grid gap-4 md:gap-6 px-6 md:px-10 pb-10 max-w-6xl  mx-auto">
        {chapters.map((item) => (
          <Link key={item.id} to={item.id}>
            <ChapterItem chapter={item} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ChapterListView;

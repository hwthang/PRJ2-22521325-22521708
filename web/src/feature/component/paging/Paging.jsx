import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

const Paging = ({ loading, page, totalPage, setPage }) => {
  if (loading || totalPage <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-10">
      <button
        className="px-4 py-2 rounded-md disabled:opacity-50 active:bg-gray-200"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        <ChevronLeft />
      </button>

      <span>
        Trang <b>{page}</b> / {totalPage}
      </span>

      <button
        className="px-4 py-2 rounded-md disabled:opacity-50 active:bg-gray-200"
        disabled={page === totalPage}
        onClick={() => setPage(page + 1)}
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default Paging;

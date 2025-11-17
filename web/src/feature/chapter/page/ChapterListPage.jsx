import React from "react";
import ChapterListView from "../view/ChapterListView";
import useChapterList from "../hook/useChapterList";

function ChapterListPage() {
  const { chapters, search, setSearch, sort, setSort, filter, setFilter } = useChapterList();
  return (
    <div>
      <ChapterListView
        chapters={chapters}
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
        filter = {filter}
        setFilter = {setFilter}
      />
    </div>
  );
}

export default ChapterListPage;

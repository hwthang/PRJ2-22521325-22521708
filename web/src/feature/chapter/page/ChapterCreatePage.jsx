import React from "react";
import ChapterCreateView from "../view/ChapterCreateView";
import useChapterCreate from "../hook/useChapterCreate";

function ChapterCreatePage() {
  const {submit} = useChapterCreate()
  return (
    <div>
      <ChapterCreateView onSubmit={submit}/>
    </div>
  );
}

export default ChapterCreatePage;

import React from "react";
import ChapterDetailView from "../view/ChapterDetailView";
import { useParams } from "react-router-dom";
import useChapterDetail from "../hook/useChapterDetail";

function ChapterDetailPage() {
  const {id} = useParams()

  const {chapter, update, activate, lock} = useChapterDetail(id)
  return (
    <div>
      <ChapterDetailView chapter={chapter} onUpdate={update} onActivate={activate} onLock={lock}/>
    </div>
  );
}

export default ChapterDetailPage;

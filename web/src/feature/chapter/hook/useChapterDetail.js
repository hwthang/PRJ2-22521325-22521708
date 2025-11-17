import React, { useEffect, useState } from "react";
import ChapterService from "../service/ChapterService";

function useChapterDetail(id) {
  const [chapter, setChapter] = useState({});
  const [checkHandle, setCheckHandle] = useState(false);

  const fetchChapter = async (id) => {
    try {
      const res = await ChapterService.getChapterById(id);
      // ... (Giữ nguyên logic xử lý lỗi) ...
      if (typeof res === "string") {
        toast.error(res);
        setChapter({});
      } else {
        setChapter(res || {});
      }
    } catch (error) {
      toast.error("Có lỗi khi lấy thông tin chi đoàn");
      setChapter({});
    }
  };

  const update = async (id, formData) => {
    try {
      const res = await ChapterService.update(id, formData);
      // ... (Giữ nguyên logic xử lý lỗi) ...
      if (typeof res === "string") {
        toast.error(res);
      } else {
      }
      setCheckHandle((prev) => !prev);
    } catch (error) {
      toast.error("Có lỗi khi lấy thông tin chi đoàn");
    }
  };
  const activate = async (id) => {
    try {
      const res = await ChapterService.activate(id);
      // ... (Giữ nguyên logic xử lý lỗi) ...
      if (typeof res === "string") {
        toast.error(res);
      } else {
      }
      setCheckHandle((prev) => !prev);
    } catch (error) {
      toast.error("Có lỗi khi lấy kích hoạt chi đoàn");
    }
  };

  const lock = async (id) => {
    try {
      const res = await ChapterService.lock(id);
      // ... (Giữ nguyên logic xử lý lỗi) ...
      if (typeof res === "string") {
        toast.error(res);
      } else {
      }
      setCheckHandle((prev) => !prev);
    } catch (error) {
      toast.error("Có lỗi khi lấy khóa chi đoàn");
    }
  };

  useEffect(() => {
    fetchChapter(id);
  }, [id, checkHandle]);

  return { chapter, update, activate, lock };
}

export default useChapterDetail;

import React from "react";
import ChapterService from "../service/ChapterService";
import { toast } from "react-toastify";

function useChapterCreate() {
  const submit = async (formData) => {
    try {
      const res = await ChapterService.createChapter(formData);
      console.log(res);
      // ... (Giữ nguyên logic xử lý lỗi) ...
      if (typeof res == "string") {
        toast.error(res);
        return 0;
      }
      toast.success("Tạo chi đoàn thành công");
      return 1;
    } catch (error) {
      toast.error("Có lỗi khi tạo chi đoàn");
      return 0;
    }
  };

  return { submit };
}

export default useChapterCreate;

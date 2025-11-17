import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import ChapterService from "../service/ChapterService";

function useChapterList() {
  const [chapters, setChapters] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(0); 
  // 🔄 Cập nhật: 'filter' là MẢNG chứa các trạng thái được chọn (VD: ['active', 'pending'])
  const [filter, setFilter] = useState([]); 

  // Hàm lấy dữ liệu thô từ API
  const fetchChapters = async () => {
    try {
      const res = await ChapterService.getChapters();
      // ... (Giữ nguyên logic xử lý lỗi) ...
      if (typeof res === "string") {
        toast.error(res);
        setChapters([]);
      } else {
        setChapters(res || []);
      }
    } catch (error) {
      toast.error("Có lỗi khi lấy danh sách chi đoàn");
      setChapters([]);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  // --- LOGIC LỌC VÀ SẮP XẾP SỬ DỤNG useMemo ---
  const filteredAndSortedChapters = useMemo(() => {
    let result = [...chapters];

    // 1. LỌC THEO TÌM KIẾM (SEARCH FILTERING)
    if (search) {
      const normalizedSearch = search.toLowerCase().trim();
      result = result.filter((chapter) => {
        return (
          chapter.name.toLowerCase().includes(normalizedSearch) ||
          chapter.affiliated.toLowerCase().includes(normalizedSearch)
        );
      });
    }

    // 2. 🎯 LỌC THEO TRẠNG THÁI (STATUS FILTERING - SỬ DỤNG MẢNG)
    if (filter && filter.length > 0) {
      // Chỉ giữ lại các chi đoàn có status nằm trong mảng 'filter'
      result = result.filter((chapter) => filter.includes(chapter.status));
    }
    
    // 3. SẮP XẾP (SORTING)
    if (result.length > 0) {
      result.sort((a, b) => {
        // ... (Giữ nguyên logic sắp xếp theo ISO 8601 hoặc tên) ...
        switch (Number(sort)) {
          case 0: 
            return a.establishedAt.localeCompare(b.establishedAt);
          case 1: 
            return b.establishedAt.localeCompare(a.establishedAt);
          case 2: 
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
    }

    return result;
  }, [chapters, search, sort, filter]); // THAY ĐỔI: Phụ thuộc vào mảng 'filter'

  return {
    chapters: filteredAndSortedChapters,
    search,
    setSearch,
    sort,
    setSort,
    filter, 
    setFilter, 
  };
}

export default useChapterList;
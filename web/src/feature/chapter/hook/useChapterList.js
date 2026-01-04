import React, { useEffect, useMemo, useState } from "react";
import apiClient from "../../../utils/api";
import { toast } from "react-toastify";
import { defAvatar } from "../../../core/assets/images";
import { formatDate } from "../../../utils/date";

const useChapterList = () => {
  const [chapters, setChapters] = useState([]);
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState([]); // State cho bộ lọc trạng thái
  const [loading, setLoading] = useState(false);

  // pagination state
  const [page, setPage] = useState(1);
  const limit = 5; 

  const fetchChapterList = async () => {
    setLoading(true);
    try {
      const { success, message, data } = await apiClient.get("/api/chapters");
      if (success) {
        setChapters(
          data.chapters.map((item) => ({
            id: item._id,
            accountId: item.accountId._id,
            avatar: item.accountId.avatar?.url || defAvatar,
            username: item.accountId.username,
            email: item.accountId.email,
            phoneNumber: item.accountId.phoneNumber,
            isActive: item.accountId.isActive, // Lấy trạng thái từ account
            name: item.name || "Chưa có",
            affiliated: item.affiliated || "Chưa có",
            establishedAt: formatDate(item.establishedAt) || "Chưa có",
            address: item.address || "Chưa có",
            password: item.accountId.password || "Chưa có",
          }))
        );
      } else toast.error(message);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapterList();
  }, []);

  // FILTER LOGIC
  const filtered = useMemo(() => {
    let result = [...chapters];

    // 1. Lọc theo search keyword
    const keyword = search.trim().toLowerCase();
    if (keyword) {
      result = result.filter((c) => 
        c.name.toLowerCase().includes(keyword) ||
        c.affiliated.toLowerCase().includes(keyword) ||
        c.address.toLowerCase().includes(keyword)
      );
    }

    // 2. Lọc theo trạng thái isActive (Sử dụng bộ lọc CheckOption)
    // filterActive có thể chứa ['active', 'locked']
    if (filterActive.length > 0) {
      result = result.filter((c) => {
        if (filterActive.includes("active") && c.isActive) return true;
        if (filterActive.includes("locked") && !c.isActive) return true;
        return false;
      });
    }

    return result;
  }, [chapters, search, filterActive]);

  // PAGINATION
  const totalPage = Math.ceil(filtered.length / limit) || 1;

  const pagedData = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page]);

  // Reset page khi thay đổi tiêu chí lọc
  useEffect(() => {
    setPage(1);
  }, [search, filterActive]);

  return {
    chapters: pagedData,
    rawChapters: chapters,
    search,
    setSearch,
    filterActive,
    setFilterActive,
    loading,
    page,
    setPage,
    totalPage,
    refresh: fetchChapterList
  };
};

export default useChapterList;
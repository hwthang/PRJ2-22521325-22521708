import React, { useEffect, useMemo, useState } from "react";
import apiClient from "../../../utils/api";
import { toast } from "react-toastify";
import { defAvatar } from "../../../core/assets/images";
import { formatDate } from "../../../utils/date";

const useChapterList = () => {
  const [chapters, setChapters] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // pagination state
  const [page, setPage] = useState(1);
  const limit = 3; // số item mỗi trang

  const fetchChapterList = async () => {
    setLoading(true);
    const { success, message, data } = await apiClient.get("/api/chapters");
    setLoading(false);

    if (success) {
      setChapters(
        data.chapters.map((item) => ({
          id: item._id,
          accountId: item.accountId._id,
          avatar: item.accountId.avatar?.path || defAvatar,
          username: item.accountId.username,
          email: item.accountId.email,
          phoneNumber: item.accountId.phoneNumber,
          name: item.name || "Chưa có",
          affiliated: item.affiliated || "Chưa có",
          establishedAt: formatDate(item.establishedAt) || "Chưa có",
          address: item.address || "Chưa có",
          password: item.accountId.password || "Chưa có",
        }))
      );
    } else toast.error(message);
  };

  useEffect(() => {
    fetchChapterList();
    console.log(chapters);
  }, [chapters.length]);

  // FILTER
  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return chapters;

    return chapters.filter((c) => {
      return (
        c.name.toLowerCase().includes(keyword) ||
        c.affiliated.toLowerCase().includes(keyword) ||
        c.address.toLowerCase().includes(keyword)
      );
    });
  }, [chapters, search]);

  // PAGINATION
  const totalPage = Math.ceil(filtered.length / limit);

  const pagedData = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page]);

  // reset page khi search
  useEffect(() => {
    setPage(1);
  }, [search]);

  return {
    chapters: pagedData,
    rawChapters: chapters,
    search,
    setSearch,
    loading,
    page,
    setPage,
    totalPage,
  };
};

export default useChapterList;

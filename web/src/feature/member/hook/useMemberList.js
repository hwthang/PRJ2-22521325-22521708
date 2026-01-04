import { useState, useEffect, useMemo } from "react";
import apiClient from "../../../utils/api";
import { toast } from "react-toastify";
import { defAvatar } from "../../../core/assets/images";
import { formatDate } from "../../../utils/date";

const useMemberList = (
  chapterFilterKeys = [],
  positionFilterKeys = [],
  isActiveFilter = [], // Thêm tham số lọc trạng thái
  positionOptions = {}
) => {
  const [members, setMembers] = useState([]);
  const [chapterOptions, setChapterOptions] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 5; // Có thể tăng limit nếu cần

  const fetchMemberList = async () => {
    setLoading(true);
    try {
      const { success, message, data } = await apiClient.get("/api/members");
      if (success) {
        const mapped = data.members.map((item) => ({
          id: item._id,
          avatar: item.accountId?.avatar?.url || defAvatar,
          fullName: item.fullName || item.accountId?.displayName || "Chưa có",
          memberCode: item.memberCode || "Chưa có",
          position: item.position || "-",
          chapterName: item.chapterId?.name || "-",
          joinedAt: formatDate(item.joinedAt) || "-",
          dateOfBirth: formatDate(item.dateOfBirth) || "-",
          gender: item.gender || "-",
          phoneNumber: item.accountId?.phoneNumber || "-",
          email: item.accountId?.email || "-",
          isActive: item.accountId?.isActive, // Đảm bảo lấy được field này
        }));
        setMembers(mapped);
      } else {
        toast.error(message || "Lỗi khi lấy danh sách member");
      }
    } catch (error) {
      toast.error("Lỗi khi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  const fetchChapterList = async () => {
    try {
      const { success, data } = await apiClient.get("/api/chapters");
      if (success) {
        const options = {};
        data.chapters.forEach((chapter) => {
          options[chapter._id] = { label: chapter.name, color: "blue" };
        });
        setChapterOptions(options);
      }
    } catch (error) {
      console.error("Lỗi khi tải chi đoàn");
    }
  };

  useEffect(() => {
    fetchMemberList();
    fetchChapterList();
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return members.filter((m) => {
      // 1. Lọc Search
      const matchSearch =
        !keyword ||
        m.fullName.toLowerCase().includes(keyword) ||
        m.memberCode.toLowerCase().includes(keyword) ||
        m.chapterName.toLowerCase().includes(keyword);

      // 2. Lọc Chi đoàn
      const matchChapter =
        chapterFilterKeys.length === 0 ||
        chapterFilterKeys.some((key) => chapterOptions[key]?.label === m.chapterName);

      // 3. Lọc Chức vụ
      const matchPosition =
        positionFilterKeys.length === 0 ||
        positionFilterKeys.some((key) => positionOptions[key]?.label === m.position);

      // 4. Lọc Trạng thái (isActive)
      let matchActive = true;
      if (isActiveFilter.length > 0) {
        matchActive = isActiveFilter.some((status) => {
          if (status === "active") return m.isActive === true;
          if (status === "locked") return m.isActive === false;
          return false;
        });
      }

      return matchSearch && matchChapter && matchPosition && matchActive;
    });
  }, [members, search, chapterFilterKeys, positionFilterKeys, isActiveFilter, chapterOptions, positionOptions]);

  const totalPage = Math.ceil(filtered.length / limit) || 1;
  const pagedData = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [search, chapterFilterKeys, positionFilterKeys, isActiveFilter]);

  return {
    members: pagedData,
    search,
    setSearch,
    loading,
    page,
    setPage,
    totalPage,
    allFilteredMembers: filtered,
    chapterOptions,
  };
};

export default useMemberList;
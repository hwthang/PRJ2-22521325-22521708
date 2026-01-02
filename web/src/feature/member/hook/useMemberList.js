import { useState, useEffect, useMemo } from "react";
import apiClient from "../../../utils/api";
import { toast } from "react-toastify";
import { defAvatar } from "../../../core/assets/images";
import { formatDate } from "../../../utils/date";

/**
 * Hook quản lý danh sách member với search, filter, pagination
 * @param {Array} chapterFilterKeys Mảng key của chi đoàn đang chọn (CheckOption)
 * @param {Array} positionFilterKeys Mảng key của chức vụ đang chọn (CheckOption)
 */
const useMemberList = (
  chapterFilterKeys = [],
  positionFilterKeys = [],
  positionOptions = {}
) => {
  const [members, setMembers] = useState([]);
  const [chapterOptions, setChapterOptions] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 3;

  // Fetch members
  const fetchMemberList = async () => {
    setLoading(true);
    try {
      const { success, message, data } = await apiClient.get("/api/members");

      if (success) {
        const mapped = data.members.map((item) => ({
          id: item._id,
          avatar: item.accountId?.avatar?.path || defAvatar,
          fullName: item.fullName || item.accountId.displayName || "Chưa có",
          memberCode: item.memberCode || "Chưa có",
          position: item.position || "-",
          chapterName: item.chapterId?.name || "-",
          joinedAt: formatDate(item.joinedAt) || "-",
          dateOfBirth: formatDate(item.dateOfBirth) || "-",
          gender: item.gender || "-",
          phoneNumber: item.accountId.phoneNumber || "-",
          email: item.accountId.email || "-",
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

  // Fetch chapters (dùng cho filter)
  const fetchChapterList = async () => {
    try {
      const { success, message, data } = await apiClient.get("/api/chapters");

      if (success) {
        const options = {};
        data.chapters.forEach((chapter) => {
          options[chapter._id] = { label: chapter.name, color: "blue" };
        });
        setChapterOptions(options);
      } else {
        toast.error(message || "Lỗi khi lấy danh sách chapter");
      }
    } catch (error) {
      toast.error("Lỗi khi kết nối server");
    }
  };

  // Chạy khi mount
  useEffect(() => {
    fetchMemberList();
    fetchChapterList();
  }, []);

  // Filter theo search, chapter, position
  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return members.filter((m) => {
      const matchSearch =
        !keyword ||
        m.fullName.toLowerCase().includes(keyword) ||
        m.memberCode.toLowerCase().includes(keyword) ||
        m.chapterName.toLowerCase().includes(keyword) ||
        m.position.toLowerCase().includes(keyword);

      const matchChapter =
        chapterFilterKeys.length === 0 ||
        chapterFilterKeys.some(
          (key) => chapterOptions[key]?.label === m.chapterName
        );

      const matchPosition =
        positionFilterKeys.length === 0 ||
        positionFilterKeys.some(
          (key) => positionOptions[key]?.label === m.position
        );

      return matchSearch && matchChapter && matchPosition;
    });
  }, [members, search, chapterFilterKeys, positionFilterKeys, chapterOptions, positionOptions]);

  // Pagination
  const totalPage = Math.ceil(filtered.length / limit);
  const pagedData = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page]);

  // Reset page khi search hoặc filter thay đổi
  useEffect(() => {
    setPage(1);
  }, [search, chapterFilterKeys, positionFilterKeys]);

  return {
    members: pagedData,
    search,
    setSearch,
    loading,
    page,
    setPage,
    totalPage,
    allFilteredMembers: filtered, // xuất excel hoặc dùng khác
    chapterOptions, // để truyền cho CheckOption
  };
};

export default useMemberList;

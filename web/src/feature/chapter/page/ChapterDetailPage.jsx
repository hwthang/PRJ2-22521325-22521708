import React, { useEffect, useState } from "react";

import { Link, useLocation, useParams } from "react-router-dom";
import apiClient from "../../../utils/api";
import { formatDate } from "../../../utils/date";
import ChapterDetailForm from "../component/ChapterDetailForm";
import { ChevronLeft } from "lucide-react";

const ChapterDetailPage = () => {
  const { id } = useParams();
  const [rawChapter, setRawChapter] = useState({});
  const fetchChapterById = async (params) => {
    const { success, message, data } = await apiClient.get(
      `/api/chapters/${id}`
    );
    console.log(data);
    if (success)
      setRawChapter({
        id: data?.chapter?._id,
        accountId: data?.chapter?.accountId?._id,
        avatar: data?.chapter?.accountId?.avatar?.url,
        username: data?.chapter?.accountId?.username || "",
        isActive: data?.chapter?.accountId?.isActive,
        email: data?.chapter?.accountId?.email || "",
        phoneNumber: data?.chapter?.accountId?.phoneNumber || "",
        name: data?.chapter?.name || "",
        affiliated: data?.chapter?.affiliated || "",
        establishedAt: data?.chapter?.establishedAt || "",
        address: data?.chapter?.address || "",
      });
  };
  useEffect(() => {
    fetchChapterById();
    console.log(rawChapter.avatar);
  }, [id]);
  return (
    <div className="p-6 flex flex-col gap-6">
      <Link
        to={-1}
        className="active:bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center"
      >
        <ChevronLeft />
      </Link>
      <ChapterDetailForm data={rawChapter} />
    </div>
  );
};

export default ChapterDetailPage;

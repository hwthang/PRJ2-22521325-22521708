import { LoaderCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ChapterSearchBox from "../components/ChapterSearchBox";
import ChapterTable from "../components/ChapterTable";
import apiClient from "../../../utils/api";

function ChapterListView() {
  const [chapters, setChapters] = useState([]);
  const [filteredChapters, setFilteredChapters] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch danh sách chapter từ backend
  const fetchChapters = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/api/chapters");
      const data = response.data; // data từ backend
      console.log(data);
      setChapters(data);
      setFilteredChapters(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chi đoàn:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  // Filter danh sách theo searchText
  useEffect(() => {
    const filtered = chapters.filter((chapter) => {
      const name = chapter.name || ""; //
      const affiliated = chapter.affiliated || "";
      return name.toLowerCase().includes(searchText.toLowerCase()) || affiliated.toLowerCase().includes(searchText.toLowerCase())
    });
    setFilteredChapters(filtered);
  }, [searchText, chapters]);

  // Reset danh sách
  const handleRefresh = () => {
    setSearchText("");
    fetchChapters();
  };

  return (
    <div className="md:p-10 p-6 flex flex-col gap-6 relative z-0">
      <div className="bg-white p-6 grid grid-cols-12 gap-6 shadow-md rounded-md">
        <div className="col-span-12 flex flex-col md:flex-row gap-4">
          <ChapterSearchBox
            value={searchText}
            onSearch={(e) => setSearchText(e.target.value)}
            placeholder="Tìm kiếm theo tên chi đoàn"
          />
        </div>
      </div>

      <div className="bg-white p-6 shadow-md rounded-md gap-4 flex flex-col">
        <div className="flex justify-between items-center md:flex-row flex-col gap-4">
          <p className="flex-1 font-semibold text-2xl text-nowrap">
            Danh sách chi đoàn
          </p>
          <div className="flex gap-4 justify-end w-full">
            <button
              onClick={handleRefresh}
              className="group w-30 flex justify-center items-center px-4 py-2 bg-gray-200 text-gray-500 rounded-md hover:bg-gray-300 transition font-semibold"
            >
              <p className="group-active:hidden">Làm mới</p>
              {loading && (
                <LoaderCircle className="group-active:block animate-spin" />
              )}
            </button>
            <Link
              to={"create"}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-semibold"
            >
              Thêm chi đoàn
            </Link>
          </div>
        </div>

        <div>
          {loading ? (
            <div className="flex justify-center py-10">
              <LoaderCircle className="animate-spin w-8 h-8 text-gray-500" />
            </div>
          ) : (
            <ChapterTable chapters={filteredChapters} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ChapterListView;

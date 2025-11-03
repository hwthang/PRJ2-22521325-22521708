import { LoaderCircle } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import MemberTable from "../components/MemberTable";
import apiClient from "../../../utils/api";

function MemberListView() {
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch danh sách member 1 lần khi mount
  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get("/api/members");
        setMembers(res.data);
      } catch (error) {
        console.error(error);
        alert("Lấy danh sách đoàn viên thất bại");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Filter members tại FE dựa vào search
  const filteredMembers = useMemo(() => {
    if (!search) return members;
    const lowerSearch = search.toLowerCase();
    return members.filter(
      (m) =>
        (m.fullName && m.fullName.toLowerCase().includes(lowerSearch)) ||
        (m.memberCode && m.memberCode.toLowerCase().includes(lowerSearch))
    );
  }, [search, members]);

  return (
    <div className="md:p-10 p-6 flex flex-col gap-6 relative z-0">
      <div className="bg-white p-6 grid grid-cols-12 gap-6 shadow-md rounded-md">
        <div className="col-span-12 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            id="account-search"
            name="account-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tìm kiếm tên đoàn viên, chi đoàn"
          />
        </div>
      </div>

      <div className="bg-white p-6 shadow-md rounded-md gap-4 flex flex-col">
        <div className="flex justify-between items-center md:flex-row flex-col gap-4">
          <p className="flex-1 font-semibold text-2xl text-nowrap">
            Danh sách đoàn viên
          </p>
          <div className="flex gap-4 justify-end w-full">
            <button
              onClick={() => setSearch("")}
              className="group w-30 flex justify-center items-center px-4 py-2 bg-gray-200 text-gray-500 rounded-md hover:bg-gray-300 transition font-semibold"
            >
              Làm mới
            </button>
            <Link
              to={"create"}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-semibold"
            >
              Thêm đoàn viên
            </Link>
          </div>
        </div>

        <div>
          {loading ? (
            <div className="flex justify-center py-10">
              <LoaderCircle className="animate-spin w-8 h-8 text-gray-500" />
            </div>
          ) : (
            <MemberTable members={filteredMembers} />
          )}
        </div>
      </div>
    </div>
  );
}

export default MemberListView;

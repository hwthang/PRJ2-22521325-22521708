import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Download, PlusSquare, Search } from "lucide-react";

import CustomInput from "../../component/custom/CustomInput";
import CustomSection from "../../component/custom/CustomSection";
import Paging from "../../component/paging/Paging";
import MemberItem from "../component/MemberItem";
import { exportToExcel } from "../../../utils/excel";
import { CheckOption } from "../../../core/components/CheckOption";
import useMemberList from "../hook/useMemberList";
import { POSITION_OPTIONS } from "../../chapter/shared/PositionMap";
import customCache from "../../../utils/customCache";

const ChapterMemberPage = () => {
  // state filter
  const [selectedChapter, setSelectedChapter] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState([]);

  const {
    members,
    search,
    setSearch,
    loading,
    page,
    setPage,
    totalPage,
    allFilteredMembers,
    chapterOptions,
  } = useMemberList(selectedChapter, selectedPosition, POSITION_OPTIONS);

  // Xuất Excel
  const handleExportExcel = () => {
    const header = [
      { label: "Họ và tên", key: "fullName" },
      { label: "Số thẻ đoàn", key: "memberCode" },
      { label: "Chức vụ", key: "position" },
      { label: "Chi đoàn sinh hoạt", key: "chapterName" },
      { label: "Email", key: "email" },
      { label: "Số điện thoại", key: "phoneNumber" },
      { label: "Ngày gia nhập", key: "joinedAt" },
    ];

    exportToExcel({
      header,
      data: allFilteredMembers,
      fileName: "ds_member.xlsx",
    });
  };

  useEffect(()=>{
   setSelectedChapter(prev=> [...prev, customCache.myAccount.get().chapter._id])
  },[])

  return (
    <div className="p-6 flex flex-col gap-4">
      {/* SEARCH & ACTIONS */}
      <div className="bg-white p-6 shadow-md border border-gray-200 rounded-md grid grid-cols-12 gap-4 items-center">
        <CustomInput
          className="col-span-12 md:col-span-8"
          beforeIcon={<Search />}
          placeholder="Nhập tên, số thẻ đoàn"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Link
          to={"create"}
          className="text-sm font-medium col-span-6 md:col-span-2 flex p-2 gap-2 bg-blue-600 items-center justify-center text-white rounded-md active:bg-blue-500"
        >
          <PlusSquare /> Thêm thành viên
        </Link>

        <button
          onClick={handleExportExcel}
          className="text-sm font-medium col-span-6 md:col-span-2 flex p-2 gap-2 bg-green-700 items-center justify-center text-white rounded-md active:bg-green-600"
        >
          <Download /> Xuất Excel
        </button>
        <CustomSection className="col-span-12" label="Chức vụ">
          <CheckOption
            options={POSITION_OPTIONS}
            value={selectedPosition}
            onChange={setSelectedPosition}
            multiple={true}
          />
        </CustomSection>
        {/* Filter chi đoàn */}
        {/* <CustomSection className="col-span-12" label="Chi đoàn sinh hoạt">
          <CheckOption
            options={chapterOptions}
            value={selectedChapter}
            onChange={setSelectedChapter}
            multiple={true}
          />
        </CustomSection> */}

        {/* Filter chức vụ */}
      </div>

      {/* HEADER TABLE */}
      <div className="hidden text-sm md:grid grid-cols-12 px-4 py-2 gap-4 mt-4 border border-gray-200 rounded-md bg-blue-900 text-white">
        <span className="col-span-3 font-medium">HỌ VÀ TÊN</span>
        <span className="col-span-3 font-medium text-center">CHI ĐOÀN</span>
        <span className="col-span-2 font-medium text-center">CHỨC VỤ</span>
        <span className="col-span-2 font-medium text-center">SỐ THẺ ĐOÀN</span>
        <span className="col-span-2 font-medium text-center">
          NGÀY VÀO ĐOÀN
        </span>
      </div>

      {/* LIST */}
      <div className="flex flex-col gap-4">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-full h-20 bg-gray-200 animate-pulse rounded-lg"
            />
          ))}

        {!loading &&
          members.length > 0 &&
          members.map((member) => (
            <Link key={member.id} to={`${member.id}`}>
              <MemberItem data={member} />
            </Link>
          ))}

        {!loading && members.length === 0 && (
          <p className="text-center text-gray-500">Không có dữ liệu</p>
        )}
      </div>

      {/* PAGINATION */}
      <Paging
        loading={loading}
        page={page}
        totalPage={totalPage}
        setPage={setPage}
      />
    </div>
  );
};

export default ChapterMemberPage;

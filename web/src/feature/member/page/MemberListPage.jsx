import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Download, PlusSquare, Search, ShieldCheck, ShieldAlert } from "lucide-react";

import CustomInput from "../../component/custom/CustomInput";
import CustomSection from "../../component/custom/CustomSection";
import Paging from "../../component/paging/Paging";
import MemberItem from "../component/MemberItem";
import { exportToExcel } from "../../../utils/excel";
import { CheckOption } from "../../../core/components/CheckOption";
import useMemberList from "../hook/useMemberList";
import { POSITION_OPTIONS } from "../../chapter/shared/PositionMap";
import { CheckOptionDropdown } from "../../../core/components/CheckOptionDropdown";

// Khai báo options trạng thái
const ACTIVE_OPTIONS = {
  active: { label: "Đang hoạt động", color: "emerald", icon: <ShieldCheck size={14} /> },
  locked: { label: "Đã khóa", color: "rose", icon: <ShieldAlert size={14} /> },
};

const MemberListPage = () => {
  const [selectedChapter, setSelectedChapter] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState([]);
  const [selectedActive, setSelectedActive] = useState([]); // State lọc trạng thái

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
  } = useMemberList(selectedChapter, selectedPosition, selectedActive, POSITION_OPTIONS);

  const handleExportExcel = () => {
    const header = [
      { label: "Họ và tên", key: "fullName" },
      { label: "Số thẻ đoàn", key: "memberCode" },
      { label: "Chức vụ", key: "position" },
      { label: "Chi đoàn sinh hoạt", key: "chapterName" },
      { label: "Email", key: "email" },
      { label: "Số điện thoại", key: "phoneNumber" },
      { label: "Ngày gia nhập", key: "joinedAt" },
      { label: "Trạng thái", key: "status" },
    ];

    const dataToExport = allFilteredMembers.map(m => ({
        ...m,
        status: m.isActive ? "Đang hoạt động" : "Đã khóa"
    }));

    exportToExcel({
      header,
      data: dataToExport,
      fileName: "ds_member.xlsx",
    });
  };

  return (
    <div className="p-6 flex flex-col gap-4">
      {/* SEARCH & ACTIONS */}
      <div className="bg-white p-6 shadow-md border border-gray-200 rounded-md grid grid-cols-12 gap-4 items-center">
        <CustomInput
          className="col-span-12 md:col-span-8 text-sm"
          beforeIcon={<Search />}
          placeholder="Nhập tên, số thẻ đoàn..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="col-span-12 md:col-span-4 flex gap-2">
            <Link
            to={"create"}
            className="flex-1 text-sm font-medium flex p-2 gap-2 bg-blue-600 items-center justify-center text-white rounded-md active:bg-blue-500"
            >
            <PlusSquare size={18} /> Thêm thành viên
            </Link>

            <button
            onClick={handleExportExcel}
            className="flex-1 text-sm font-medium flex p-2 gap-2 bg-green-700 items-center justify-center text-white rounded-md active:bg-green-600"
            >
            <Download size={18} /> Xuất Excel
            </button>
        </div>

        {/* Filter Trạng thái */}
        <CustomSection className="col-span-12 md:col-span-3" label="Trạng thái tài khoản">
          <CheckOption
            options={ACTIVE_OPTIONS}
            value={selectedActive}
            onChange={setSelectedActive}
            multiple={true}
          />
        </CustomSection>

        {/* Filter Chức vụ */}
        <CustomSection className="col-span-12 md:col-span-9" label="Chức vụ">
          <CheckOption
            options={POSITION_OPTIONS}
            value={selectedPosition}
            onChange={setSelectedPosition}
            multiple={true}
          />
        </CustomSection>

        {/* Filter chi đoàn */}
        <CustomSection className="col-span-12" label="Chi đoàn sinh hoạt">
          <CheckOptionDropdown
            options={chapterOptions}
            value={selectedChapter}
            onChange={setSelectedChapter}
            multiple={true}
          />
        </CustomSection>
      </div>

      {/* HEADER TABLE */}
      <div className="hidden text-sm md:grid grid-cols-12 px-4 py-2 gap-4 mt-4 border border-gray-200 rounded-md bg-blue-900 text-white font-bold uppercase tracking-wider">
        <span className="col-span-3">Họ và tên</span>
        <span className="col-span-3 text-center">Chi đoàn</span>
        <span className="col-span-2 text-center">Chức vụ</span>
        <span className="col-span-2 text-center">Số thẻ đoàn</span>
        <span className="col-span-2 text-center">Ngày vào đoàn</span>
      </div>

      {/* LIST */}
      <div className="flex flex-col gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-full h-20 bg-gray-100 animate-pulse rounded-lg border border-gray-200" />
          ))
        ) : (
          <>
            {members.length > 0 ? (
              members.map((member) => (
                <Link key={member.id} to={`${member.id}`}>
                  <MemberItem data={member} />
                </Link>
              ))
            ) : (
              <div className="py-20 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">Không tìm thấy đoàn viên nào phù hợp</p>
              </div>
            )}
          </>
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

export default MemberListPage;
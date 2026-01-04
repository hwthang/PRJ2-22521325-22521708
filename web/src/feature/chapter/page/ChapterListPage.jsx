import React from "react";
import CustomInput from "../../component/custom/CustomInput";
import { Download, PlusSquare, Search, ShieldCheck, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import ChapterItem from "../component/ChapterItem";
import useChapterList from "../hook/useChapterList";
import Paging from "../../component/paging/Paging";
import { exportToExcel } from "../../../utils/excel";
import { CheckOption } from "../../../core/components/CheckOption"; // Import component CheckOption của bạn

const ChapterListPage = () => {
  const {
    chapters,
    rawChapters,
    search,
    setSearch,
    filterActive,
    setFilterActive,
    loading,
    page,
    setPage,
    totalPage,
  } = useChapterList();

  // Khai báo options cho bộ lọc trạng thái
  const activeOptions = {
    active: { label: "Đang hoạt động", color: "emerald", icon: <ShieldCheck size={14} /> },
    locked: { label: "Đã khóa", color: "rose", icon: <ShieldAlert size={14} /> },
  };

  const handleExportExcel = () => {
    const header = [
      { label: "Mã chi đoàn", key: "id" },
      { label: "Tên chi đoàn", key: "name" },
      { label: "Đoàn trực thuộc", key: "affiliated" },
      { label: "Ngày thành lập", key: "establishedAt" },
      { label: "Địa chỉ", key: "address" },
      { label: "Tên đăng nhập", key: "username" },
      { label: "Email", key: "email" },
      { label: "Số điện thoại", key: "phoneNumber" },
      { label: "Mật khẩu", key: "password" },
      { label: "Trạng thái", key: "isActive" },
    ];

    const dataToExport = rawChapters.map(c => ({
        ...c,
        isActive: c.isActive ? "Đang hoạt động" : "Đã khóa"
    }));

    exportToExcel({ header, data: dataToExport, fileName: "ds_chi_doan.xlsx" });
  };

  return (
    <div className="p-6 transition-all flex flex-col">
      {/* SEARCH & ACTIONS */}
      <div className="bg-white p-6 shadow-md rounded-xl border-gray-200 border flex flex-col gap-4 mb-6">
        <div className="grid grid-cols-12 gap-4">
          <CustomInput
            className={"col-span-12 md:col-span-8 text-sm"}
            beforeIcon={<Search size={18} className="text-gray-400" />}
            placeholder="Nhập tên chi đoàn, đoàn trực thuộc hoặc địa chỉ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="col-span-12 md:col-span-4 flex gap-2">
            <Link
              to={"create"}
              className="flex-1 text-sm font-bold flex p-2.5 gap-2 bg-blue-600 hover:bg-blue-700 items-center justify-center text-white rounded-lg transition-all shadow-sm"
            >
              <PlusSquare size={18} /> Thêm
            </Link>
            <button
              onClick={handleExportExcel}
              className="flex-1 text-sm font-bold flex p-2.5 gap-2 bg-emerald-700 hover:bg-emerald-800 items-center justify-center text-white rounded-lg transition-all shadow-sm"
            >
              <Download size={18} /> Xuất Excel
            </button>
          </div>
        </div>

        {/* BỘ LỌC TRẠNG THÁI (CheckOption) */}
        <div className="flex items-center gap-4 pt-2 border-t border-gray-50">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái:</span>
          <CheckOption
            options={activeOptions}
            value={filterActive}
            onChange={setFilterActive}
            multiple={true}
          />
        </div>
      </div>

      {/* HEADER TABLE */}
      <div className="text-sm font-semibold hidden md:grid grid-cols-12 px-5 py-3 gap-4 border-gray-200 border mt-2 mb-4 rounded-lg bg-blue-900 text-white uppercase">
        <span className="col-span-4">Thông tin chi đoàn</span>
        <span className="col-span-3 text-center">Đoàn trực thuộc</span>
        <span className="col-span-1 text-center">Thành lập</span>
        <span className="col-span-3 text-center">Địa chỉ</span>
      </div>

      {/* LIST CONTENT */}
      <div className="flex flex-col gap-4 min-h-[300px]">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-full h-24 bg-gray-100 animate-pulse rounded-xl border border-gray-200"></div>
          ))
        ) : (
          <>
            {chapters.map((item, index) => (
              <Link key={index} to={`${item.id}`} className="transform transition-all hover:scale-[1.01] active:scale-[0.99]">
                <ChapterItem data={item} />
              </Link>
            ))}

            {chapters.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <Search size={48} className="text-gray-200 mb-2" />
                <p className="text-gray-500 font-medium">Không tìm thấy chi đoàn nào phù hợp</p>
                <button 
                    onClick={() => {setSearch(""); setFilterActive([]);}} 
                    className="mt-2 text-blue-600 text-sm hover:underline"
                >
                    Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* PHÂN TRANG */}
      <div className="mt-8">
        <Paging
          loading={loading}
          page={page}
          totalPage={totalPage}
          setPage={setPage}
        />
      </div>
    </div>
  );
};

export default ChapterListPage;
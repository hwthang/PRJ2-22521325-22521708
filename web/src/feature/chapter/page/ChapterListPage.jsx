import CustomInput from "../../component/custom/CustomInput";
import { Download, PlusSquare, Search } from "lucide-react";
import { Link } from "react-router-dom";
import ChapterItem from "../component/ChapterItem";
import useChapterList from "../hook/useChapterList";
import Paging from "../../component/paging/Paging";
import { exportToExcel } from "../../../utils/excel";

const ChapterListPage = () => {
  const {
    chapters,
    rawChapters,
    search,
    setSearch,
    loading,
    page,
    setPage,
    totalPage,
  } = useChapterList();

  const handleExportExcel = () => {
    console.log("Export excel");

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
    ];

    exportToExcel({ header, data: rawChapters, fileName: "ds_chi_doan.xlsx" });
  };

  return (
    <div className="p-6 transition-all flex flex-col">
      {/* SEARCH & ACTIONS */}
      <div className="bg-white p-6 shadow-md rounded-md grid grid-cols-12 border-gray-200 border gap-6 mb-6">
        <CustomInput
          className={"col-span-12 md:col-span-8 text-sm"}
          beforeIcon={<Search />}
          placeholder="Nhập tên chi đoàn, đoàn trực thuộc hoặc địa chỉ"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Link
          to={"create"}
          className="text-sm font-medium col-span-6 h-fit md:col-span-2 flex p-2 gap-2 bg-blue-600 items-center justify-center text-white rounded-md active:bg-blue-500"
        >
          <PlusSquare /> Thêm chi đoàn
        </Link>
        <button
          onClick={handleExportExcel}
          className="text-sm font-medium col-span-6 h-fit md:col-span-2 flex p-2 gap-2 bg-green-700 items-center justify-center text-white rounded-md active:bg-green-600"
        >
          <Download />
          Xuất Excel
        </button>
      </div>

      {/* HEADER */}
      <div className="text-sm hidden md:grid grid-cols-12 px-4 py-2 gap-4 border-gray-200 border mt-2 mb-4 rounded-md bg-blue-900 text-white">
        <span className="col-span-4 font-medium">TÊN CHI ĐOÀN</span>
        <span className="col-span-3 font-medium text-center">
          ĐOÀN TRỰC THUỘC
        </span>
        <span className="col-span-1 font-medium text-center">
          THÀNH LẬP
        </span>
        <span className="col-span-4 font-medium text-center">ĐỊA CHỈ</span>
      </div>

      {/* LIST */}
      <div className="flex flex-col gap-4">
        {/* Loading skeleton */}
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-full h-20 bg-gray-200 animate-pulse rounded-lg"
            ></div>
          ))}

        {/* Data */}
        {!loading &&
          chapters.map((item, index) => (
            <Link key={index} to={`${item.id}`}>
              <ChapterItem data={item} />
            </Link>
          ))}

        {!loading && chapters.length === 0 && (
          <p className="text-center text-gray-500">Không có dữ liệu</p>
        )}
      </div>

      <Paging
        loading={loading}
        page={page}
        totalPage={totalPage}
        setPage={setPage}
      />
    </div>
  );
};

export default ChapterListPage;

import React, { useState } from "react";
import ChapterImportExcelItem from "./ChapterImportExcelItem";
import DragDropUpload from "../../component/DragDropUpload";
import { downloadPublicFile, excelToJson } from "../../../utils/excel";
import useChapterCreate from "../hook/useChapterCreate";
import { ArrowDownToLine, CopyPlus, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "react-toastify"; // Giả định bạn dùng react-toastify

const ChapterImportExcel = () => {
  const [rawChapters, setRawChapters] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { createNewChapter } = useChapterCreate();

  /** Hàm validate dữ liệu một chi đoàn */
  const validateChapter = (chapter) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!chapter.username) errors.username = "Tên đăng nhập không được để trống";
    if (!chapter.password) errors.password = "Mật khẩu không được để trống";
    else if (chapter.password.length < 6)
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";

    if (!chapter.email) errors.email = "Email không được để trống";
    else if (!emailRegex.test(chapter.email))
      errors.email = "Email không hợp lệ";

    if (!chapter.phoneNumber) errors.phoneNumber = "Số điện thoại không được để trống";
    else if (!phoneRegex.test(chapter.phoneNumber))
      errors.phoneNumber = "Số điện thoại không hợp lệ";

    if (!chapter.name) errors.name = "Tên chi đoàn không được để trống";
    if (!chapter.affliated) errors.affliated = "Đoàn trực thuộc không được để trống";
    if (!chapter.establishedAt) errors.establishedAt = "Ngày thành lập không được để trống";
    if (!chapter.address) errors.address = "Địa chỉ không được để trống";

    return errors;
  };

  /** Đọc và convert Excel */
  const handleExcelFile = async (file) => {
    try {
      const json = await excelToJson(file);
      const formatted = json.map((row) => {
        const chapter = {
          username: row["Tên tài khoản"] || "",
          password: row["Mật khẩu"] || "",
          email: row["Email"] || "",
          phoneNumber: row["Số điện thoại"] || "",
          name: row["Tên chi đoàn"] || "",
          affliated: row["Đoàn trực thuộc"] || "",
          establishedAt: row["Ngày thành lập"] || "",
          address: row["Địa chỉ"] || "",
          _status: "pending",
          _message: "",
        };
        chapter._errors = validateChapter(chapter);
        return chapter;
      });
      setRawChapters(formatted);
      toast.info(`Đã tải lên ${formatted.length} chi đoàn`);
    } catch (error) {
      toast.error("Lỗi khi đọc file Excel");
    }
  };

  /** Xử lý tạo từng chi đoàn hàng loạt */
  const handleCreateBulk = async () => {
    if (rawChapters.length === 0) return;
    
    // Kiểm tra xem có dòng nào bị lỗi validate không
    const hasValidationError = rawChapters.some(c => Object.keys(c._errors).length > 0);
    if (hasValidationError) {
      toast.warning("Vui lòng sửa các lỗi dữ liệu trước khi tạo hàng loạt");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Đang xử lý tạo hàng loạt chi đoàn...");
    
    const updated = [...rawChapters];
    let successCount = 0;
    let failCount = 0;

    try {
      for (let i = 0; i < updated.length; i++) {
        // Chỉ xử lý những item chưa thành công
        if (updated[i]._status === "success") {
          successCount++;
          continue;
        }

        const chapter = updated[i];

        const res = await createNewChapter({
          username: chapter.username,
          password: chapter.password,
          email: chapter.email,
          phoneNumber: chapter.phoneNumber,
          name: chapter.name,
          affiliated: chapter.affliated,
          establishedAt: chapter.establishedAt,
          address: chapter.address,
        });

        if (res.success) {
          updated[i]._status = "success";
          updated[i]._message = "";
          successCount++;
        } else {
          updated[i]._status = "error";
          updated[i]._message = res.message;
          failCount++;
        }

        setRawChapters([...updated]);
      }

      // Thông báo kết quả cuối cùng
      if (failCount === 0) {
        toast.update(toastId, { render: `Thành công! Đã tạo ${successCount} chi đoàn`, type: "success", isLoading: false, autoClose: 3000 });
      } else {
        toast.update(toastId, { render: `Hoàn tất: ${successCount} thành công, ${failCount} thất bại`, type: "warning", isLoading: false, autoClose: 3000 });
      }

    } catch (error) {
      toast.update(toastId, { render: "Đã xảy ra lỗi hệ thống", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-x-6 gap-y-6 border-gray-200 border shadow-md rounded-md p-6 bg-white relative">
      {/* Hiển thị màn hình mờ khi đang xử lý */}
      {isProcessing && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-md backdrop-blur-[1px]">
          <div className="flex flex-col items-center gap-2 bg-white p-4 shadow-lg rounded-lg border">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <span className="text-sm font-semibold">Hệ thống đang thực thi...</span>
          </div>
        </div>
      )}

      <div className="col-span-12 md:col-span-4 text-xl font-medium text-nowrap">
        TẠO TỪ DANH SÁCH CHI ĐOÀN FILE EXCEL
      </div>

      {/* Nút tạo hàng loạt */}
      <button
        onClick={handleCreateBulk}
        disabled={rawChapters.length === 0 || isProcessing}
        className="text-sm font-medium col-span-12 h-fit 
                   md:col-start-7 md:col-span-2 flex p-2 gap-2 
                   bg-blue-600 items-center justify-center 
                   text-white rounded-md active:bg-blue-500 disabled:opacity-50 transition-all"
      >
        {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <CopyPlus size={20} />}
        Tạo hàng loạt
      </button>

      {/* Nút làm mới */}
      <button
        onClick={() => setRawChapters([])}
        disabled={rawChapters.length === 0 || isProcessing}
        className="text-sm font-medium col-span-12 h-fit 
                    md:col-span-2 flex p-2 gap-2 
                   bg-slate-500 items-center justify-center 
                   text-white rounded-md active:bg-slate-600 disabled:opacity-50 transition-all"
      >
        <RotateCcw size={20} />
        Làm mới
      </button>

      {/* Nút tải file mẫu */}
      <button
        onClick={() =>
          downloadPublicFile(
            "/file/DS_CHI_DOAN_EXAMPLE.xlsx",
            "Mau_DS_Chi_Doan.xlsx"
          )
        }
        disabled={isProcessing}
        className="text-sm font-medium col-span-12 h-fit 
                   md:col-span-2 flex p-2 gap-2 bg-violet-600 
                   items-center justify-center text-white rounded-md 
                   active:bg-violet-500 disabled:opacity-50 transition-all"
      >
        <ArrowDownToLine size={20} />
        Tải file mẫu
      </button>

      {/* Danh sách item */}
      {rawChapters.length > 0 ? (
        <div className="col-span-12 grid grid-cols-12 gap-4 mt-4">
          {rawChapters.map((item, idx) => (
            <div key={idx} className="col-span-12 md:col-span-6">
              <ChapterImportExcelItem
                data={item}
                status={item._status}
                message={item._message}
                errors={item._errors}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="col-span-12 mt-4">
          <DragDropUpload onFile={handleExcelFile} />
        </div>
      )}
    </div>
  );
};

export default ChapterImportExcel;
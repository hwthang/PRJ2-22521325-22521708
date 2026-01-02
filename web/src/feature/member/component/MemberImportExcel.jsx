import React, { useState } from "react";
import DragDropUpload from "../../component/DragDropUpload";
import { ArrowDownToLine, CopyPlus, RotateCcw, Loader2 } from "lucide-react";
import { downloadPublicFile, excelToJson } from "../../../utils/excel";
import { toast } from "react-toastify";

import MemberImportExcelItem from "../component/MemberImportExcelItem";
import useMemberCreate from "../hook/useMemberCreate";

const MemberImportExcel = () => {
  const [rawMembers, setRawMembers] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { createNewMember } = useMemberCreate();

  /** Hàm validate dữ liệu từng member */
  const validateMember = (member) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!member.username) errors.username = "Tên tài khoản không được để trống";
    if (!member.password) errors.password = "Mật khẩu không được để trống";
    else if (member.password.length < 6)
      errors.password = "Mật khẩu tối thiểu 6 ký tự";

    if (!member.email) errors.email = "Email không được để trống";
    else if (!emailRegex.test(member.email))
      errors.email = "Email không hợp lệ";

    if (!member.phoneNumber)
      errors.phoneNumber = "Số điện thoại không được để trống";
    else if (!phoneRegex.test(member.phoneNumber))
      errors.phoneNumber = "Số điện thoại không hợp lệ";

    if (!member.fullName) errors.fullName = "Họ và tên không được để trống";
    if (!member.memberCode)
      errors.memberCode = "Mã đoàn viên không được để trống";
    if (!member.chapterId)
      errors.chapterId = "Mã chi đoàn không được để trống";
    if (!member.joinedAt) errors.joinedAt = "Ngày vào đoàn không được để trống";

    return errors;
  };

  /** Xử lý đọc file Excel */
  const handleExcelFile = async (file) => {
    try {
      const json = await excelToJson(file);
      const formatted = json.map((row) => {
        const member = {
          username: row["Tên tài khoản"] || "",
          password: row["Mật khẩu"] || "",
          email: row["Email"] || "",
          phoneNumber: row["Số điện thoại"] || "",
          chapterId: row["Mã chi đoàn"] || "",
          fullName: row["Họ và tên"] || "",
          gender: row["Giới tính"] || "",
          dateOfBirth: row["Ngày sinh"] || "",
          placeOfBirth: row["Quê quán"] || "",
          address: row["Địa chỉ"] || "",
          ethnicity: row["Dân tộc"] || "",
          religion: row["Tôn giáo"] || "",
          education: row["Học vấn"] || "",
          professionalLevel: row["Trình độ chuyên môn"] || "",
          politicalTheory: row["Lý luận chính trị"] || "",
          memberCode: row["Mã đoàn viên"] || "",
          joinedAt: row["Ngày vào Đoàn"] || "",
          position: row["Chức vụ"] || "",
          _status: "pending",
          _message: "",
        };
        member._errors = validateMember(member);
        return member;
      });

      setRawMembers(formatted);
      toast.info(`Đã tải lên ${formatted.length} đoàn viên`);
    } catch (error) {
      toast.error("Lỗi khi đọc file Excel");
    }
  };

  /** Tạo thành viên từ danh sách hàng loạt */
  const handleCreateBulk = async () => {
    if (rawMembers.length === 0) return;

    // Kiểm tra lỗi validate trước khi gửi
    const hasError = rawMembers.some(m => Object.keys(m._errors).length > 0);
    if (hasError) {
      toast.warning("Vui lòng sửa các lỗi dữ liệu đỏ trước khi tạo");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Đang khởi tạo danh sách đoàn viên...");

    const updated = [...rawMembers];
    let successCount = 0;
    let failCount = 0;

    try {
      for (let i = 0; i < updated.length; i++) {
        // Bỏ qua nếu đã tạo thành công trước đó
        if (updated[i]._status === "success") {
          successCount++;
          continue;
        }

        const member = updated[i];
        const res = await createNewMember(member);

        if (res.success) {
          updated[i]._status = "success";
          updated[i]._message = "";
          successCount++;
        } else {
          updated[i]._status = "error";
          updated[i]._message = res.message;
          failCount++;
        }

        // Cập nhật UI ngay lập tức cho từng dòng
        setRawMembers([...updated]);
      }

      // Cập nhật Toast kết quả cuối cùng
      if (failCount === 0) {
        toast.update(toastId, {
          render: `Thành công! Đã tạo ${successCount} đoàn viên`,
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        toast.update(toastId, {
          render: `Hoàn tất: ${successCount} thành công, ${failCount} thất bại`,
          type: "warning",
          isLoading: false,
          autoClose: 4000,
        });
      }
    } catch (error) {
      toast.update(toastId, {
        render: "Lỗi hệ thống không xác định",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative grid grid-cols-12 gap-x-6 gap-y-6 border-gray-200 border shadow-md rounded-md p-6 bg-white">
      {/* Overlay mờ chặn tương tác khi đang xử lý */}
      {isProcessing && (
        <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center rounded-md">
          <div className="bg-white p-5 rounded-2xl shadow-2xl border flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <span className="font-bold text-blue-800">Đang lưu dữ liệu...</span>
          </div>
        </div>
      )}

      <div className="col-span-12 md:col-span-4 text-xl font-medium text-nowrap">
        TẠO TỪ DANH SÁCH ĐOÀN VIÊN FILE EXCEL
      </div>

      <div className="col-span-12 md:col-span-8 flex flex-wrap md:flex-nowrap gap-3 justify-end">
        {/* Nút tạo hàng loạt */}
        <button
          onClick={handleCreateBulk}
          disabled={rawMembers.length === 0 || isProcessing}
          className="text-sm font-medium flex p-2 px-4 gap-2 
                   bg-blue-600 items-center justify-center 
                   text-white rounded-md active:bg-blue-500 disabled:opacity-50 transition-all"
        >
          {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <CopyPlus size={18} />}
          Tạo hàng loạt
        </button>

        {/* Nút làm mới */}
        <button
          onClick={() => setRawMembers([])}
          disabled={rawMembers.length === 0 || isProcessing}
          className="text-sm font-medium flex p-2 px-4 gap-2 
                   bg-slate-500 items-center justify-center 
                   text-white rounded-md active:bg-slate-600 disabled:opacity-50 transition-all"
        >
          <RotateCcw size={18} /> Làm mới
        </button>

        {/* Nút tải file mẫu */}
        <button
          onClick={() =>
            downloadPublicFile(
              "/file/DS_DOAN_VIEN_EXAMPLE.xlsx",
              "Mau_DS_DoanVien.xlsx"
            )
          }
          disabled={isProcessing}
          className="text-sm font-medium flex p-2 px-4 gap-2 
                   bg-violet-600 items-center justify-center text-white rounded-md 
                   active:bg-violet-500 disabled:opacity-50 transition-all"
        >
          <ArrowDownToLine size={18} /> Tải file mẫu
        </button>
      </div>

      <div className="col-span-12">
        <hr className="border-slate-100" />
      </div>

      {/* Nội dung danh sách hoặc Upload */}
      {rawMembers.length > 0 ? (
        <div className="col-span-12 grid grid-cols-12 gap-4 animate-in fade-in duration-500">
          {rawMembers.map((item, idx) => (
            <div key={idx} className="col-span-12 md:col-span-6">
              <MemberImportExcelItem
                data={item}
                status={item._status}
                message={item._message}
                errors={item._errors}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="col-span-12">
          <DragDropUpload onFile={handleExcelFile} />
        </div>
      )}
    </div>
  );
};

export default MemberImportExcel;
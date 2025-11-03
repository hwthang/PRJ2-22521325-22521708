// import React, { useEffect } from "react";
// import useForm from "../../../core/hooks/useForm";
// import defAvatar from "../../../core/assets/images/avatar.png";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";

// function AccountDetailForm({ account, updateAccount }) {
//   const accForm = useForm();

//   const handleUpdate = async () => {
//     try {
//       console.log(accForm.form);
//     } catch {
//       toast.error("lỗi khi cập nhật");
//     }
//   };

//   useEffect(() => {
//     console.log(accForm);
//     accForm.setForm({
//       username: account.username,
//       email: account.email,
//     });
//   }, [account]);
//   return (
//     <div className="grid grid-cols-12 gap-6">
//       <div className="col-span-12 flex flex-col items-center justify-between gap-4 md:col-span-3 md:row-span-3 md:col-start-2">
//         <img src={defAvatar} className="h-32 w-32 rounded-full" />
//         <div className="font-semibold text-xl">{account.name}</div>
//         <div className="flex gap-4 text-sm">
//           {account.type === "admin" ? (
//             <span className="px-2 py-1 rounded-md bg-violet-100 border-violet-300 text-violet-500 font-semibold text-center">
//               Quản trị viên
//             </span>
//           ) : account.type === "chapter" ? (
//             <span className="px-2 py-1 rounded-md bg-pink-100 border-pink-300 text-pink-500 font-semibold text-center">
//               Chi đoàn
//             </span>
//           ) : (
//             <span className="px-2 py-1 rounded-md bg-blue-100 border-blue-300 text-blue-500 font-semibold text-center">
//               Đoàn viên
//             </span>
//           )}
//           {account.status == "active" ? (
//             <span className="px-2 py-1 rounded-md bg-green-100 border-green-300 text-green-500 font-semibold text-center">
//               Hoạt động
//             </span>
//           ) : account.status == "locked" ? (
//             <span className="px-2 py-1 rounded-md bg-red-100 border-red-300 text-red-500 font-semibold text-center">
//               Bị khóa
//             </span>
//           ) : (
//             <span className="px-2 py-1 rounded-md bg-yellow-100 border-yellow-300 text-yellow-500 font-semibold text-center">
//               Chờ duyệt
//             </span>
//           )}
//         </div>
//       </div>
//       <div className="col-span-12 flex gap-1 flex-col md:col-span-6">
//         <label className="font-semibold">Tên đăng nhập</label>
//         <div className="border h-10 rounded-md has-[input:focus]:border-blue-500 border-gray-300 border-1 px-4">
//           <input
//             className="h-full w-full outline-none bg-transparent"
//             value={accForm.getFieldInForm("username")}
//             onChange={(e) =>
//               accForm.handleChangeFieldInForm("username", e.target.value)
//             }
//           />
//         </div>
//       </div>
//       <div className="col-span-12 flex gap-1 flex-col md:col-span-6">
//         <label className="font-semibold">Email</label>
//         <div className="border h-10 rounded-md has-[input:focus]:border-blue-500 border-gray-300 border-1 px-4">
//           <input
//             className="h-full w-full outline-none bg-transparent"
//             value={accForm.getFieldInForm("email")}
//             onChange={(e) =>
//               accForm.handleChangeFieldInForm("email", e.target.value)
//             }
//           />
//         </div>
//       </div>
//       <div className="col-span-12 flex gap-4 md:col-span-6">
//         <button
//           onClick={handleUpdate}
//           className="bg-blue-500 text-white font-bold w-full rounded-md h-10"
//         >
//           Chỉnh sửa
//         </button>
//         {account.status == "active" ? (
//           <button className="bg-red-500 text-white font-bold w-full rounded-md h-10">
//             Khóa
//           </button>
//         ) : (
//           <button className="bg-green-500 text-white font-bold w-full rounded-md h-10">
//             Duyệt
//           </button>
//         )}
//       </div>
//       {account.type != "admin" && (
//         <Link
//           to={`/${account.type == "member" ? "members" : "chapters"}/1`}
//           className="md:col-start-11 text-right row-start-1 col-span-12 md:col-span-2"
//         >
//           Đi đến trang hồ sơ
//         </Link>
//       )}
//     </div>
//   );
// }

// export default AccountDetailForm;

import { CameraIcon } from "lucide-react";
import React from "react";

function AccountDetailForm({ account, onUpdate }) {
  return (
    <div className="grid grid-cols-12 border">
      <div className="col-span-12 md:col-span-8 md:col-start-3 grid grid-cols-8 gap-6">
        <div className="col-span-12 flex gap-1 flex-col md:col-span-2 md:row-span-2">
          <div className="relative w-fit h-fit">
            <img className="w-40 h-40 rounded-full bg-gray-200" />
            <label
              htmlFor="avatar"
              className="absolute bottom-0 right-0 border flex w-10 h-10 items-center justify-center bg-white rounded-full"
            >
              <CameraIcon />
              <input id="avatar" className="hidden" type="file"></input>
            </label>
          </div>
        </div>
        <div className="col-span-12 flex gap-1 flex-col md:col-span-3">
          <label className="font-semibold">Tên đăng nhập</label>
          <div className="border h-10 rounded-md has-[input:focus]:border-blue-500 border-gray-300 border-1 px-4">
            <input className="h-full w-full outline-none bg-transparent" />
          </div>
        </div>
        <div className="col-span-12 flex gap-1 flex-col md:col-span-3">
          <label className="font-semibold">Số điện thoại</label>
          <div className="border h-10 rounded-md has-[input:focus]:border-blue-500 border-gray-300 border-1 px-4">
            <input className="h-full w-full outline-none bg-transparent" />
          </div>
        </div>
        <div className="col-span-12 flex gap-1 flex-col md:col-span-6">
          <label className="font-semibold">Email</label>
          <div className="border h-10 rounded-md has-[input:focus]:border-blue-500 border-gray-300 border-1 px-4">
            <input className="h-full w-full outline-none bg-transparent" />
          </div>
        </div>
        <div className="col-span-12 flex gap-1 flex-col md:col-span-4">
          <label className="font-semibold">Vai trò</label>
          <div className="border h-10 rounded-md has-[input:focus]:border-blue-500 border-gray-300 border-1 px-4"></div>
        </div>
        <div className="col-span-12 flex gap-1 flex-col md:col-span-4">
          <label className="font-semibold">Trạng thái</label>
          <div className="border h-10 rounded-md has-[input:focus]:border-blue-500 border-gray-300 border-1 px-4"></div>
        </div>
        <div className="col-span-12 flex gap-1 flex-col md:col-span-8 flex flex-row gap-6 items-center justify-center">
          <button className="bg-blue-500 text-white h-10 min-w-fit flex-1 px-4 rounded-md">
            Lưu thay đổi
          </button>
          <button className="bg-blue-500 text-white h-10 min-w-fit flex-1 px-4 rounded-md">
            Kích hoạt
          </button>
          {/* <button className="bg-blue-500 text-white h-10 min-w-fit flex-1 px-4 rounded-md">
            Khóa
          </button> */}
          <button className="bg-blue-500 text-white h-10 min-w-fit flex-1 px-4 rounded-md">
            Xem hồ sơ chi tiết
          </button>
          <button className="bg-blue-500 text-white h-10 min-w-fit  flex-1 px-4 rounded-md">
            Đổi mật khẩu mới
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountDetailForm;

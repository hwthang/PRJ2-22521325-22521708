import { ChevronLeft } from "lucide-react";
import React, { use, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AccountForm from "../components/AccountForm";

function AccountDetailView({ getAccountById, updateAccount }) {
  const { id } = useParams();
  const [account, setAccount] = useState({});
  useEffect(() => {
    const fetchAccount = async () => {
      const res = await getAccountById(id);
      console.log(res);
      setAccount(res);
    };
    fetchAccount();
  }, [id]);
  return (
    <div className={`md:p-10 p-6 flex flex-col gap-6 relative z-0 `}>
      <div className="bg-white flex py-6 flex-col gap-6 shadow-md rounded-md">
        <div className="col-span-12">
          <Link
            to={"/accounts"}
            className="flex gap-2  px-4 items-center w-fit"
          >
            <ChevronLeft size={40} />
            <span className="font-bold text-2xl">Thông tin tài khoản</span>
          </Link>
        </div>
        <div className="mx-6 md:mx-10">
          <AccountForm
            account={account}
            onSubmit={updateAccount}
            isUpdated={true}
          />
        </div>
      </div>
    </div>
  );
}

export default AccountDetailView;

import React, { useEffect, useState } from "react";
import AccountSearchBox from "../components/AccountSearchBox";
import AccountStatusFilter from "../components/AccountStatusFilter";
import AccountTypeFilter from "../components/AccountTypeFilter";
import AccountTable from "../components/AccountTable";
import { LoaderCircle } from "lucide-react";
import { Link } from "react-router-dom";

function AccountListView({
  accounts,
  getAccounts,
  activeAccount,
  lockAccount,
}) {
  const [option, setOption] = useState({
    search: "",
    status: [],
    type: [],
  });
  const [openCreateModal, setOpenCreateModal] = useState(true);
  useEffect(() => {
    console.log(option);
    getAccounts(option);
  }, [option]);

  const onSearch = (value) => {
    setOption((prev) => ({ ...prev, search: value }));
  };

  const onStatusFilter = (value) => {
    setOption((prev) => ({ ...prev, status: value }));
  };

  const onTypeFilter = (value) => {
    setOption((prev) => ({ ...prev, type: value }));
  };

  const onResetOption = () =>
    setOption({
      search: "",
      status: [],
      type: [],
    });

  return (
    <div className={`md:p-10 p-6 flex flex-col gap-6 relative z-0 `}>
      {openCreateModal && <div className="absolute"></div>}
      <div className="bg-white p-6 grid grid-cols-12 gap-6 shadow-md rounded-md">
        <div className="col-span-12">
          <AccountSearchBox onSearch={onSearch} search={option.search} />
        </div>
        <div className="col-span-12 md:col-span-6">
          <AccountStatusFilter
            onStatusFilter={onStatusFilter}
            status={option.status}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <AccountTypeFilter onTypeFilter={onTypeFilter} type={option.type} />
        </div>
      </div>
      <div className="bg-white p-6 shadow-md rounded-md gap-4 flex flex-col">
        <div className="flex justify-between items-center md:flex-row flex-col gap-4">
          <p className="flex-1 font-semibold text-2xl text-nowrap">
            Danh sách tài khoản
          </p>
          <div className="flex gap-4 justify-end w-full">
            <button
              onClick={onResetOption}
              className="group w-30 flex justify-center items-center px-4 py-2 bg-gray-200 text-gray-500 rounded-md hover:bg-gray-300 transition font-semibold"
            >
              <p className="group-active:hidden">Làm mới</p>
              <LoaderCircle className="group-active:block hidden animate-spin" />
            </button>
            <Link to={'create'} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-semibold">
              Thêm tài khoản
            </Link>
          </div>
        </div>
        <div>
          <AccountTable
            accounts={accounts}
            activeAccount={activeAccount}
            lockAccount={lockAccount}
          />
        </div>
      </div>
    </div>
  );
}

export default AccountListView;

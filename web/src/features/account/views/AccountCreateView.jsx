import { ChevronLeft } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
// import AccountCreateForm from '../components/AccountForm'
import AccountForm from '../components/AccountForm'

function AccountCreateView({createAccount}) {
  return (
    <div className={`md:p-10 p-6 flex flex-col gap-6 relative z-0`}>
      <div className="bg-white flex py-6 flex-col gap-6 shadow-md rounded-md">
        <div className="col-span-12">
          <Link
            to={"/accounts"}
            className="flex gap-2  px-4 items-center w-fit"
          >
            <ChevronLeft size={40} />
            <span className="font-bold text-2xl">Thêm tài khoản</span>
          </Link>
        </div>
        <div className="mx-6 md:mx-10">
          <AccountForm onSubmit={createAccount} />
        </div>
      </div>
    </div>
  )
}

export default AccountCreateView
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import MemberForm from "../../member/components/MemberForm";
import ChapterForm from "../../chapter/components/ChapterForm";
import AccountService from "../services/AccountService";

function AccountDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [accountData, setAccountData] = React.useState(null);
  const { id, type } = location.state || {};

  const fetchAccount = async (id) => {
    const account = await AccountService.getAccount(id);
    console.log("Account data:", account);
    setAccountData(account);
    return;
  };

  useEffect(() => {
    if (id) {
      fetchAccount(id);
    }
  }, [id]);

  return (
    <div className="p-6 md:p-10">
      {/* Container giống AccountTable */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-2 mb-6 transition active:bg-gray-100 rounded-lg"
        >
          <ChevronLeft size={40} />
        </button>

        {/* Form placeholder */}
        <div className="rounded-lg">
          {type === "member" && <MemberForm data={accountData} />}
          {type === "chapter" && <ChapterForm data={accountData} />}
        </div>
      </div>
    </div>
  );
}

export default AccountDetail;

import React from "react";
import AccountDetailView from "../views/AccountDetailView";
import useAccount from "../hooks/useAccount";

function AccountDetailPage() {
  const { getAccountById, updateAccount } = useAccount();
  return (
    <div>
      <AccountDetailView
        getAccountById={getAccountById}
        updateAccount={updateAccount}
      />
    </div>
  );
}

export default AccountDetailPage;

import React from "react";
import AccountListView from "../views/AccountListView";
import useAccount from "../hooks/useAccount";

function AccountListPage() {
  const {
    accounts,
    getAccounts,
  } = useAccount();
  return (
    <div>
      <AccountListView
        accounts={accounts}
        getAccounts={getAccounts}
      />
    </div>
  );
}

export default AccountListPage;

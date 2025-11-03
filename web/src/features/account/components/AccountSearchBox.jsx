import React from "react";

function AccountSearchBox({ onSearch, search }) {
  return (
    <div>
      <input
        type="text"
        id="account-search"
        name="account-search"
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Tìm kiếm tài khoản..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}

export default AccountSearchBox;

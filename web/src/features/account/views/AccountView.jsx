import React, { useEffect, useState } from "react";
import AccountTable from "../components/AccountTable";
import AccountService from "../services/AccountService";

/* ================= Search Input ================= */
function SearchInput({ value, onChange }) {
  return (
    <div className="relative flex-1 w-full">
      <input
        placeholder="🔍 Tìm kiếm theo tên hoặc username..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none p-2.5 w-full rounded-xl transition-all"
      />
    </div>
  );
}

/* ================= Filter Base Layout ================= */
function FilterGroup({ label, children }) {
  return (
    <div className="flex flex-col gap-2 flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 px-4">
      <span className="font-semibold text-sm uppercase tracking-wide">{label}</span>
      {children}
    </div>
  );
}

/* ================= Filter trạng thái ================= */
function StatusFilter({ selected, onChange }) {
  const options = [
    { value: "active", label: "Hoạt động", color: "bg-green-100 text-green-700 border-green-300" },
    { value: "locked", label: "Bị khóa", color: "bg-red-100 text-red-700 border-red-300" },
    { value: "pending", label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  ];

  const toggle = (value) =>
    selected.includes(value)
      ? onChange(selected.filter((v) => v !== value))
      : onChange([...selected, value]);

  return (
    <FilterGroup label="Trạng thái">
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => toggle(opt.value)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-150
              ${selected.includes(opt.value) ? `${opt.color} font-semibold` : "bg-white border-gray-300 hover:bg-gray-100"}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </FilterGroup>
  );
}

/* ================= Filter loại tài khoản ================= */
function TypeFilter({ selected, onChange }) {
  const options = [
    { value: "member", label: "Đoàn viên", color: "bg-blue-100 text-blue-700 border-blue-300" },
    { value: "chapter", label: "Chi đoàn", color: "bg-purple-100 text-purple-700 border-purple-300" },
  ];

  const toggle = (value) =>
    selected.includes(value)
      ? onChange(selected.filter((v) => v !== value))
      : onChange([...selected, value]);

  return (
    <FilterGroup label="Loại tài khoản">
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => toggle(opt.value)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-150
              ${selected.includes(opt.value) ? `${opt.color} font-semibold` : "bg-white border-gray-300 hover:bg-gray-100"}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </FilterGroup>
  );
}

/* ================= Header ================= */
function AccountHeader({ onRefresh, onAdd }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
      <p className="font-medium text-2xl text-nowrap">Danh sách tài khoản</p>
      <div className="flex w-full justify-between md:justify-end gap-6 items-center">
        <button
          onClick={onRefresh}
          className="px-6 py-2 bg-blue-900 active:bg-blue-800 text-white rounded-lg"
        >
          Làm mới
        </button>
        <button
          onClick={onAdd}
          className="px-6 py-2 bg-blue-900 active:bg-blue-800 text-white rounded-lg"
        >
          Thêm tài khoản
        </button>
      </div>
    </div>
  );
}

/* ================= Main Component ================= */
function AccountView() {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState([]);
  const [typeFilter, setTypeFilter] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const fetchAccounts = async () => {
    try {
      const result = await AccountService.getAccounts();
      const filtered = result.filter((acc) => {
        const matchName =
          acc.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          acc.username?.toLowerCase().includes(searchText.toLowerCase());
        const matchStatus =
          statusFilter.length === 0 || statusFilter.includes(acc.status);
        const matchType =
          typeFilter.length === 0 || typeFilter.includes(acc.type);
        return matchName && matchStatus && matchType;
      });
      setAccounts(filtered);
    } catch (error) {
      console.error("Lỗi khi tải tài khoản:", error);
    }
  };

  const handleRefresh = () => {
    setSearchText("");
    setStatusFilter([]);
    setTypeFilter([]);
    fetchAccounts();
  };

  const handleAddAccount = () => {
    console.log("Thêm tài khoản mới");
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [searchText, statusFilter, typeFilter]);

  return (
    <div className="h-full w-full relative z-10">
      <div className="p-6 md:p-10 flex flex-col gap-8">
        {/* Bộ lọc */}
        <div className="bg-white shadow-sm rounded-2xl p-6 flex flex-col gap-6">
          <SearchInput value={searchText} onChange={setSearchText} />
          <div className="flex flex-col md:flex-row gap-4">
            <StatusFilter selected={statusFilter} onChange={setStatusFilter} />
            <TypeFilter selected={typeFilter} onChange={setTypeFilter} />
          </div>
        </div>

        {/* Bảng tài khoản */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <AccountHeader onRefresh={handleRefresh} onAdd={handleAddAccount} />
          <div className="mt-4">
            <AccountTable data={accounts} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountView;

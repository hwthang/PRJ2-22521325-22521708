import React, { useEffect, useState } from "react";
import AccountService from "../services/AccountService";

const useAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Accounts updated:", accounts);
  }, [accounts]);

  // ✅ Lấy danh sách tài khoản + filter trên FE
  const getAccounts = async (option = { search: "", status: [], type: [] }) => {
    try {
      setLoading(true);
      const data = await AccountService.getAccounts();

      const result = data.filter((item) => {
        const searchText = option.search?.toLowerCase() || "";

        const matchSearch =
          !searchText ||
          item?.username?.toLowerCase().includes(searchText) ||
          item?.email?.toLowerCase().includes(searchText) ||
          item?.name?.toLowerCase().includes(searchText);

        const matchStatus =
          option.status?.length === 0 || option.status.includes(item.status);

        const matchType =
          option.type?.length === 0 || option.type.includes(item.type);

        return matchSearch && matchStatus && matchType;
      });

      setAccounts(result);
      return result;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tài khoản:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Tạo tài khoản mới
  const createAccount = async (account) => {
    try {
      const newAccount = await AccountService.createAccount(account);
      setAccounts((prev) => [...prev, newAccount]);
      return newAccount;
    } catch (error) {
      console.error("Lỗi khi tạo tài khoản:", error);
      throw error;
    }
  };

  // ✅ Lấy tài khoản theo ID
  const getAccountById = async (id) => {
    try {
      return await AccountService.getAccount(id);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin tài khoản:", error);
      throw error;
    }
  };

  // ✅ Cập nhật tài khoản
  const updateAccount = async (id, data) => {
    try {
      const updated = await AccountService.updateAccount(id, data);
      setAccounts((prev) =>
        prev.map((acc) => (acc._id === id ? updated : acc))
      );
      return updated;
    } catch (error) {
      console.error("Lỗi khi cập nhật tài khoản:", error);
      throw error;
    }
  };

  // ✅ Active tài khoản
  const activeAccount = async (id) => {
    try {
      const updated = await AccountService.activeAccount(id);
      setAccounts((prev) =>
        prev.map((acc) =>
          acc._id === id ? { ...acc, status: "active" } : acc
        )
      );
      return updated;
    } catch (error) {
      console.error("Lỗi khi kích hoạt tài khoản:", error);
      throw error;
    }
  };

  // ✅ Khóa tài khoản
  const lockAccount = async (id) => {
    try {
      const updated = await AccountService.lockAccount(id);
      setAccounts((prev) =>
        prev.map((acc) =>
          acc._id === id ? { ...acc, status: "locked" } : acc
        )
      );
      return updated;
    } catch (error) {
      console.error("Lỗi khi khóa tài khoản:", error);
      throw error;
    }
  };

  return {
    loading,
    accounts,
    getAccounts,
    createAccount,
    getAccountById,
    updateAccount,
    activeAccount,
    lockAccount,
  };
};

export default useAccount;

// services/AccountService.js
import apiClient from "../../../utils/api";

class AccountService {
  // ✅ Tạo tài khoản mới
  createAccount = async (data) => {
    try {
      const response = await apiClient.post("/api/accounts", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo tài khoản:", error?.response?.data || error);
      throw error;
    }
  };

  // ✅ Lấy tất cả tài khoản
  getAccounts = async () => {
    try {
      const response = await apiClient.get("/api/accounts");
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tài khoản:", error);
      throw error;
    }
  };

  // ✅ Lấy chi tiết tài khoản theo ID
  getAccount = async (id) => {
    try {
      const response = await apiClient.get(`/api/accounts/${id}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin tài khoản:", error);
      throw error;
    }
  };

  // ✅ Cập nhật tài khoản
  updateAccount = async (id, updatedData) => {
    try {
      const response = await apiClient.put(`/api/accounts/${id}`, updatedData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật tài khoản:",
        error?.response?.data || error
      );
      throw error;
    }
  };

  activateAccount = async (id) => {
    try {
      const response = await apiClient.patch(`/api/accounts/activate/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi kích hoạt tài khoản:",
        error?.response?.data || error
      );
      throw error;
    }
  };


   lockAccount = async (id) => {
    try {
      const response = await apiClient.patch(`/api/accounts/lock/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi khóa tài khoản:",
        error?.response?.data || error
      );
      throw error;
    }
  };

  // ✅ Lấy tài khoản hiện tại (nếu bạn có token auth backend)
  getMyAccount = async () => {
    try {
      const response = await apiClient.get(`/api/accounts/my-account`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin cá nhân:", error);
      throw error;
    }
  };
}

export default new AccountService();

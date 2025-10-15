import apiClient from "../../../utils/api";

class AuthService {
  getFieldNameOfAccount = (account) => {
    if (!account) return "username"; // tránh lỗi khi account null/undefined

    if (account.includes("@")) return "email";
    if (/^\d+$/.test(account)) return "phone"; // toàn số thì là số điện thoại
    return "username";
  };

  login = async (key, password) => {
    try {
      const response = await apiClient.post(`/api/auth/login`, {
        key,
        password,
      });

      const { success, data, message } = response;

      if (success) localStorage.setItem("token", data?.token);

      return { success, data, message };
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  register = async (account, profile) => {
    try {
      const response = await apiClient.post(`/api/auth/register`, {
        account,
        profile,
      });
      const { success, data, message } = response;

      return { success, data, message };
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}

export default new AuthService();

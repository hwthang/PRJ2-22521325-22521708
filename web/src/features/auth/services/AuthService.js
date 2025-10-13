import { toast } from "react-toastify";
import apiClient from "../../../utils/api";

class AuthService {
  API_ROUTE = `/api/auth`;

  getChapters = async () => {
    try {
      const response = await apiClient.get(`${this.API_ROUTE}/chapters`);
      return response.data;
    } catch (error) {
      return;
    }
  };

  getFieldNameOfAccount = (account) => {
    if (!account) return "username"; // tránh lỗi khi account null/undefined

    if (account.includes("@")) return "email";
    if (/^\d+$/.test(account)) return "phone"; // toàn số thì là số điện thoại
    return "username";
  };

  login = async (data) => {
    try {
      const response = await apiClient.post(`${this.API_ROUTE}/login`, {
        [this.getFieldNameOfAccount(data?.account)]: data?.account,
        password: data?.password,
      });

      if (response?.data?.token) {
        localStorage.setItem("token", response.data);
        toast.success("Đăng nhập thành công");
        return response?.data?.role;
      }

      toast.error(response.message)
    } catch (error) {
      return;
    }
  };

  register = async (data) => {
    try {
      const response = await apiClient.post(`${this.API_ROUTE}/register`, data);
      console.log(response)
      return response?.data?.role;
    } catch (error) {
      return;
    }
  };
}

export default new AuthService();

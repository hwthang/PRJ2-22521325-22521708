import apiClient from "../../../utils/api";

class AccountService {
  getAccounts = async (params) => {
    try {
      const response = await apiClient.get("/api/accounts");
      const result = response.data;
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return "Lỗi khi lấy danh sách tài khoản";
    }
  };

  getAccount = async (id) => {
    try {
      const response = await apiClient.get(`/api/accounts/${id}`);
      const result = response.data;
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return "Lỗi khi lấy thông tin tài khoản";
    }
  };

updateAvatar = async (id, avatar) => {
  try {
    const formData = new FormData();
    formData.append("avatar", avatar);
    const response = await apiClient.patch(
      `/api/accounts/${id}/update-avatar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const result = response;
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
    return "Lỗi khi cập nhật avatar";
  }
};
}

export default new AccountService();

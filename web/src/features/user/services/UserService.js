import apiClient from "../../../utils/api";

class UserService {
  createUser = async (account, profile) => {
    try {
      const response = await apiClient.post(`/api/users`, {
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

  fetchUsers = async () => {
    try {
      const response = await apiClient.get(`/api/users`);
      const { success, data, message } = response;

      return { success, data, message };
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  fetchUser = async (id) => {
    try {
      const response = await apiClient.get(`/api/users/${id}`);
      const { success, data, message } = response;

      return { success, data, message };
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  updateUser = async (id, account, profile) => {
    try {
      const response = await apiClient.put(`/api/users/${id}`, {
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

  activeUser = async (id) => {
    try {
      const response = await apiClient.patch(`/api/users/${id}/active`);
      const { success, data, message } = response;

      return { success, data, message };
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  lockUser = async (id) => {
    try {
      const response = await apiClient.patch(`/api/users/${id}/lock`);
      const { success, data, message } = response;

      return { success, data, message };
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // ✅ Cập nhật avatar người dùng
updateAvatar = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await apiClient.patch(`/api/users/${id}/update-avatar`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const { success, data, message } = response;
    return { success, data, message };
  } catch (error) {
    console.error("Error updating avatar:", error);
    return { success: false, message: "Không thể cập nhật avatar" };
  }
};

}

export default new UserService();

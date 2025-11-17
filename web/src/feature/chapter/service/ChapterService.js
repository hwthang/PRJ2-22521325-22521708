import apiClient from "../../../utils/api";

class ChapterService {
  // Lấy danh sách chi đoàn
  getChapters = async (params) => {
    try {
      const res = await apiClient.get("/api/chapters", { params });
      return res.data.map((item) => ({
        id: item?._id,
        avatar: item?.accountId?.avatar?.path,
        name: item?.name,
        affiliated: item?.affiliated,
        establishedAt: item?.establishedAt,
        address: item?.address,
        status: item?.accountId?.status,
      }));
    } catch (error) {
      return this.handleError(error, "Có lỗi xảy ra khi lấy danh sách chi đoàn");
    }
  };

  // Lấy chi tiết chi đoàn theo id
  getChapterById = async (id) => {
    try {
      const res = await apiClient.get(`/api/chapters/${id}`);
      return {
        avatar: res.data?.accountId?.avatar?.path,
        username: res.data?.accountId?.username,
        email: res.data?.accountId?.email,
        phoneNumber: res.data?.accountId?.phoneNumber,
        status: res.data?.accountId?.status,
        name: res.data?.name,
        affiliated: res.data?.affiliated,
        address: res.data?.address,
        establishedAt: res.data?.establishedAt,
        id: res.data?._id,
      };
    } catch (error) {
      return this.handleError(error, "Có lỗi xảy ra khi lấy chi tiết chi đoàn");
    }
  };

  // Tạo chi đoàn mới
  createChapter = async (formData) => {
    try {
      const res = await apiClient.post(`/api/chapters`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (error) {
      throw this.handleError(error, "Có lỗi xảy ra khi tạo chi đoàn");
    }
  };

  // Cập nhật chi đoàn
  update = async (id, formData) => {
    try {
      const res = await apiClient.put(`/api/chapters/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (error) {
      throw this.handleError(error, "Có lỗi xảy ra khi cập nhật chi đoàn");
    }
  };

  // Kích hoạt chi đoàn
  activate = async (id) => {
    try {
      const res = await apiClient.patch(`/api/chapters/${id}/activate`);
      return res.data;
    } catch (error) {
      throw this.handleError(error, "Có lỗi xảy ra khi kích hoạt chi đoàn");
    }
  };

  // Khóa chi đoàn
  lock = async (id) => {
    try {
      const res = await apiClient.patch(`/api/chapters/${id}/lock`);
      return res.data;
    } catch (error) {
      throw this.handleError(error, "Có lỗi xảy ra khi khóa chi đoàn");
    }
  };

  // Xử lý lỗi và trả về message
  handleError = (error, defaultMessage) => {
    if (error.response && error.response.data?.message) {
      console.error("API Error:", error.response.data);
      return error.response.data.message;
    } else if (error.request) {
      console.error("No response received:", error.request);
      return "Không nhận được phản hồi từ server";
    } else {
      console.error("Error setting up request:", error.message);
      return error.message || defaultMessage;
    }
  };
}

export default new ChapterService();

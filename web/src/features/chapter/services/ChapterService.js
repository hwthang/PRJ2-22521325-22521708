import apiClient from "../../../utils/api";

class ChapterService {
  // Lấy tất cả chapter (có thể filter theo name, affiliated)
  getChapters = async (params = {}) => {
    try {
      const response = await apiClient.get("/api/chapters", { params });
      return response.data; // mảng chapter
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chi đoàn:", error);
      return null;
    }
  };

  // Lấy chi đoàn theo ID
  getChapterById = async (id) => {
    try {
      const response = await apiClient.get(`/api/chapters/${id}`);
      return response.data; // object chapter
    } catch (error) {
      console.error(`Lỗi khi lấy chi đoàn với id=${id}:`, error);
      return null;
    }
  };

  // Tạo mới chapter
  createChapter = async (chapterData) => {
    try {
      const formData = this.buildFormData(chapterData);
      const response = await apiClient.post("/api/chapters", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo chi đoàn:", error);
      return null;
    }
  };

  // Cập nhật chapter
  updateChapter = async (id, chapterData) => {
    try {
      const formData = this.buildFormData(chapterData);
      const response = await apiClient.put(`/api/chapters/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật chi đoàn với id=${id}:`, error);
      return null;
    }
  };

  // Kích hoạt chapter
  activateChapter = async (id) => {
    try {
      const response = await apiClient.patch(`/api/chapters/${id}/activate`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi kích hoạt chi đoàn id=${id}:`, error);
      return null;
    }
  };

  // Khóa chapter
  lockChapter = async (id) => {
    try {
      const response = await apiClient.patch(`/api/chapters/${id}/lock`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi khóa chi đoàn id=${id}:`, error);
      return null;
    }
  };

  // Xây dựng FormData, handle cả File mới và avatar đã lưu
  buildFormData = (chapterData) => {
    const formData = new FormData();
    Object.keys(chapterData).forEach((key) => {
      const value = chapterData[key];
      if (key === "avatar") {
        // Nếu là File mới append
        if (value instanceof File) formData.append(key, value);
        // Nếu là object avatar đã lưu, gửi path để backend giữ nguyên
        else if (value && typeof value === "object" && value.path) {
          formData.append(key, value.path);
        }
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    return formData;
  };
}

export default new ChapterService();

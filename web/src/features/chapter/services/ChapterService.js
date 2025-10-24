import apiClient from "../../../utils/api";

class ChapterService {
  getChapters = async () => {
    try {
      const response = await apiClient.get(`/api/chapters`);

     const result = response.data;
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
    update = async (id, chapterData) => {
    try {
      const response = await apiClient.put(`/api/chapters/${id}`, chapterData);
      const result = response.data;
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return "Lỗi khi cập nhật thành viên";
    }
  };
}

export default new ChapterService();

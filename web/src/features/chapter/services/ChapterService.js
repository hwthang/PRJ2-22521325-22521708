import apiClient from "../../../utils/api";

class ChapterService {
  getChapters = async () => {
    try {
      const response = await apiClient.get(`/api/chapters`);

      const { success, data, message } = response;
      return { success, data, message };
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}

export default new ChapterService();

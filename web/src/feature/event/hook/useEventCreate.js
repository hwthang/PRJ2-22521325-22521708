import apiClient from "../../../utils/api";

/**
 * Hook sử dụng để tạo Event mới
 * Chỉ thực hiện API call, không quản lý loading/error
 */
const useEventCreate = () => {
  /**
   * createNewEvent - gửi dữ liệu event lên server
   * @param {Object} data - Dữ liệu event
   *  {
   *    name, tags, startedAt, endedAt, venue, description, images: File[]
   *  }
   */
  const createNewEvent = async (data) => {
    // Khởi tạo FormData
    const formData = new FormData();
    formData.append("chapterId", "692da70d315925b126425b6c"); // nếu cần
    formData.append("name", data.name || "");
    formData.append("venue", data.venue || "");
    formData.append("description", data.description || "");
    formData.append("startedAt", data.startedAt || "");
    formData.append("endedAt", data.endedAt || "");

    // Thêm tags
    if (Array.isArray(data.tags)) {
      data.tags.forEach((tag) => formData.append("tags[]", tag));
    }

    // Thêm images
    if (Array.isArray(data.images)) {
      data.images.forEach((img) => {
        if (img.file) formData.append("images", img.file);
      });
    }

    // Gọi API
    const response = await apiClient.post("/api/events", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response)

    return response;
  };

  return { createNewEvent };
};

export default useEventCreate;

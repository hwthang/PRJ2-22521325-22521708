import apiClient from "../../../utils/api";

/**
 * Hook sử dụng để cập nhật Event
 */
const useEventUpdate = () => {

  /**
   * Cập nhật thông tin event (gửi FormData)
   * @param {string} eventId
   * @param {Object} data = {
   *   name, description, venue,
   *   tags: [], 
   *   startedAt, endedAt,
   *   images: [{ file: File, url?: string }]
   * }
   */
const updateEventById = async (eventId, data = {}) => {
  console.log("🔵 [updateEventById] RAW DATA NHẬN TỪ FE:", data);

  const formData = new FormData();

  // --------------------------
  // 1. Append text fields
  // --------------------------
  Object.keys(data).forEach((key) => {
    if (key !== "images") {
      if (Array.isArray(data[key])) {
        console.log(`📌 Append array field → ${key}:`, data[key]);
        formData.append(key, JSON.stringify(data[key]));
      } else {
        console.log(`📌 Append field → ${key}:`, data[key]);
        formData.append(key, data[key]);
      }
    }
  });

  // --------------------------
  // 2. Append images (file mới)
  // --------------------------
  if (Array.isArray(data.images)) {
    console.log("🖼️ LIST ẢNH GỬI LÊN:", data.images);

    data.images.forEach((img, i) => {
      if (img.file) {
        console.log(`📤 Append FILE [${i}] →`, {
          name: img.file.name,
          size: img.file.size,
          type: img.file.type,
        });

        formData.append("images", img.file);
      } else {
        console.log(`⚠️ Ảnh giữ nguyên (không có file) [${i}]:`, img.url);
      }
    });
  }

  // --------------------------
  // 3. Log toàn bộ FormData
  // --------------------------
  console.log("📦 DỮ LIỆU TRONG FormData TRƯỚC KHI GỬI:");

  for (const pair of formData.entries()) {
    if (pair[1] instanceof File) {
      console.log(`➡️ ${pair[0]} = FILE`, {
        name: pair[1].name,
        size: pair[1].size,
        type: pair[1].type,
      });
    } else {
      console.log(`➡️ ${pair[0]} =`, pair[1]);
    }
  }

  // --------------------------
  // 4. Gửi API
  // --------------------------
  console.log("🚀 BẮT ĐẦU GỌI API PUT /events/" + eventId);

  const response = await apiClient.put(
    `/api/events/${eventId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  console.log("🟢 API RESPONSE:", response.data || response);

  return response.data || response;
};


  /**
   * Hủy event
   */
  const cancelEventById = async (eventId) => {
    const response = await apiClient.put(`/api/events/${eventId}/cancel`);
    return response.data || response;
  };

  return {
    updateEventById,
    cancelEventById,
  };
};

export default useEventUpdate;

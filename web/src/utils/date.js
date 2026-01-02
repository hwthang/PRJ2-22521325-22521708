// ---------------------------------------------------------
// Trả về ngày hôm nay dưới format YYYY-MM-DD
// Dùng cho <input type="date">
// ---------------------------------------------------------
export function getToday() {
  const today = new Date();
  // Ví dụ: "2025-11-29"
  return today.toISOString().split("T")[0];
}

// ---------------------------------------------------------
// Chuyển chuỗi ISO → dạng YYYY-MM-DD
// Dùng cho <input type="date">
// ---------------------------------------------------------
export function toDateInputValue(isoString) {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); 
  const day = String(date.getDate()).padStart(2, "0");

  // Ví dụ: "2025-11-29"
  return `${year}-${month}-${day}`;
}

// ---------------------------------------------------------
// Format ISO → dd/mm/yyyy (theo chuẩn Việt Nam)
// Dùng hiển thị ngày trong UI
// ---------------------------------------------------------
export function formatDate(isoString) {
  if (!isoString) return "Không rõ";

  const options = { year: "numeric", month: "2-digit", day: "2-digit" };

  // Ví dụ: "29/11/2025"
  return new Date(isoString).toLocaleDateString("vi-VN", options);
}

// ---------------------------------------------------------
// Format ISO → dd/MM/yyyy HH:mm
// Tự động chuyển sang giờ địa phương (VD: Việt Nam UTC+7)
// ---------------------------------------------------------
export const formatDatetime = (isoString) => {
  if (!isoString) return null;

  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Ví dụ: input UTC "2025-11-29T15:45:00Z" → output "29/11/2025 22:45"
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

// ---------------------------------------------------------
// Chuyển ISO → format dành cho <input type="datetime-local">
// Format: YYYY-MM-DDTHH:mm
// Tự động dùng giờ LOCAL của thiết bị
// ---------------------------------------------------------
export function formatForDatetimeLocal(isoString) {
  if (!isoString) return '';

  const date = new Date(isoString);

  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const HH = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');

  // Ví dụ: input UTC "2025-11-29T15:45:00Z" → "2025-11-29T22:45"
  return `${yyyy}-${MM}-${dd}T${HH}:${mm}`;
}

/**
 * Format ISO datetime thành: hh:mm SA/CH dd/mm/yyyy
 * 
 * Ví dụ:
 * Input:  "2025-04-12T07:30:00.000Z"
 * Output: "02:30 CH 12/04/2025"  (tùy vào múi giờ local)
 */
export function formatVietnamDatetimeAMPM(isoString) {
  if (!isoString) return "Không rõ";

  const date = new Date(isoString);

  // Lấy giờ và xử lý dạng AM/PM → SA/CH
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const isPM = hours >= 12;
  const period = isPM ? "CH" : "SA";

  // Chuyển đổi 24h → 12h
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const hh = String(hours).padStart(2, "0");

  // Lấy ngày/tháng/năm
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${hh}:${minutes} ${period} ${dd}/${mm}/${yyyy}`;
}

export const toDatetimeInput = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const formatRelativeTime = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInMs = now - past;
  
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // 1. Nếu dưới 1 phút
  if (diffInSeconds < 60) {
    return "Vừa xong";
  }
  
  // 2. Nếu dưới 1 giờ
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }
  
  // 3. Nếu dưới 24 giờ
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }
  
  // 4. Từ 1 đến 3 ngày
  if (diffInDays <= 3) {
    return `${diffInDays} ngày trước`;
  }

  // 5. Từ sau 3 ngày thì hiển thị format HH:mm DD/MM/YYYY
  const hours = String(past.getHours()).padStart(2, '0');
  const minutes = String(past.getMinutes()).padStart(2, '0');
  const day = String(past.getDate()).padStart(2, '0');
  const month = String(past.getMonth() + 1).padStart(2, '0');
  const year = past.getFullYear();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
};
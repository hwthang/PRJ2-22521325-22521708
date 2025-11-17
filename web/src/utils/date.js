export function getToday() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

export function toDateInputValue(isoString) {
  const date = new Date(isoString);

  // Lấy năm, tháng, ngày
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng 0-11
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatDate(isoString) {
  if (!isoString) {
    return "Không rõ";
  }
  // Tùy chọn: 'vi-VN' sẽ hiển thị ngày/tháng/năm
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(isoString).toLocaleDateString("vi-VN", options);
}

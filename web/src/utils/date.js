export function getToday() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

export function formatDate(dateObj) {
  return dateObj.toISOString().split("T")[0];
}


export function parseDate(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(dateStr, days) {
  const date = parseDate(dateStr);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

export function diffDays(start, end) {
  const startDate = parseDate(start);
  const endDate = parseDate(end);
  const diffTime = endDate - startDate;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function isValidDate(dateStr) {
  const date = parseDate(dateStr);
  return date instanceof Date && !isNaN(date);
}

export function toDateInputValue(isoString) {
  const date = new Date(isoString);
  
  // Lấy năm, tháng, ngày
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng 0-11
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
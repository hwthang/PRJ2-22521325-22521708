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

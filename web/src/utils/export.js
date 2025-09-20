export function exportJSON(data, fileName = "data.json") {
  const jsonStr = JSON.stringify(data, null, 2); // format đẹp
  const blob = new Blob([jsonStr], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(link.href);
}
export const getStatus = (event) => {
  if (!event) return "upcoming";

  if (event.status === "canceled") return "canceled";

  const now = new Date();
  const start = new Date(event.startedAt);
  const end = new Date(event.endedAt);

  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "running";
  return "ended";
};

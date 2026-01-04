const API_BASE = "http://localhost:5000/api/calls";

const post = async (url, body) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return res.json();
};

export const requestCall = (payload) =>
  post(`${API_BASE}/request`, payload);

export const acceptCall = (payload) =>
  post(`${API_BASE}/accept`, payload);

export const rejectCall = (payload) =>
  post(`${API_BASE}/reject`, payload);

export const cancelCall = (payload) =>
  post(`${API_BASE}/cancel`, payload);

export const endCall = (payload) =>
  post(`${API_BASE}/end`, payload);

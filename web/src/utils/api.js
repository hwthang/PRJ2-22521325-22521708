import axios from "axios";

// Tạo instance Axios chung
const apiClient = axios.create({
  baseURL: "http://localhost:5000", // URL backend
  timeout: 10000,                     // timeout 10s
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor: tự động thêm token nếu có
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: xử lý lỗi chung
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // logout hoặc redirect login
      console.error("Unauthorized! Token expired?");
    }
    return Promise.reject(error);
  }
);

export default apiClient;

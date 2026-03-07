import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8081/api", 
  withCredentials: true, // Merged from your axios.js
});

// Interceptor to attach the JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8081/api", // Your backend base URL
});

// This "Interceptor" runs before every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Automatically add the Bearer token if it exists
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;

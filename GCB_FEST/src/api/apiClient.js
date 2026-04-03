import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8081/api", 
  withCredentials: true, 
});

//* acts as a middleware to attach the token to every request if it exists in localStorage
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
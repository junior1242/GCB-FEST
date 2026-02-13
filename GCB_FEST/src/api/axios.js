import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8081/api", //^ change according to the backend port
  withCredentials: true,
});

export default API;

// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api", // Adjust this to your backend port
// });

// // Add a request interceptor to attach the JWT token
// API.interceptors.request.use((req) => {
//     const profile = localStorage.getItem("profile");
//     if (profile) {
//     const { token } = JSON.parse(profile);
//         req.headers.Authorization = `Bearer ${token}`;
//     }
//     return req;
// });

// export default API;

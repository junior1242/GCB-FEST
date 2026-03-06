import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8081/api", //^ change according to the backend port
  withCredentials: true,
});

export default API;


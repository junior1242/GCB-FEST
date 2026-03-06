import API from "./axios";

export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);
export const verifyEmail = (token) => API.get(`/auth/verify-email/${token}`);
export const getProfile = () => API.get("/auth/me");
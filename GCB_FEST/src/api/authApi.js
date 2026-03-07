import apiClient from "./apiClient";

export const loginUser = (data) => apiClient.post("/auth/login", data);
export const registerUser = (data) => apiClient.post("/auth/register", data);
export const verifyEmail = (token) => apiClient.get(`/auth/verify-email/${token}`);
export const getProfile = () => apiClient.get("/auth/me");
import apiClient from "./apiClient"; // Adjust path to your apiClient.js

export const fetchDashboardStats = async () => {
    const response = await apiClient.get("/admin/dashboard");
    return response.data;
};

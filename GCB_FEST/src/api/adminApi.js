import apiClient from "./apiClient"; // Adjust path to your apiClient.js

export const fetchDashboardStats = async () => {
  const response = await apiClient.get("/admin/dashboard");
  return response.data;
};

export const fetchAllStudents = async () => {
  const response = await apiClient.get("/admin/students");
  return response.data;
};

// export const fetchUnverifiedStudents = async () => {
//   const response = await apiClient.get("/admin/unverified-students");
//   return response.data;
// };

// export const verifyStudentAccount = async (userId) => {
//   const response = await apiClient.patch(`/admin/verify-student/${userId}`);
//   return response.data;
// };

export const fetchUnverifiedStudents = async () => {
  const response = await apiClient.get("/admin/pending-students");
  return response.data.data; // Adjusted to match standard controller response
};

// New function to handle both Approve and Reject
export const processStudentStatus = async (studentId, status) => {
  const response = await apiClient.patch("/admin/approve-student", {
    studentId,
    status,
  });
  return response.data;
};

export const getPastEvents = () => apiClient.get("/admin/past-events");

export const getPastEventDetails = (id) =>
  apiClient.get(`/admin/past-events/${id}`);

export const getTodaysEvents = () => apiClient.get("/admin/todays-events");

// NEW: Get all students registered for a specific event
export const getEventStudents = (eventId) =>
  apiClient.get(`/admin/event-reservations/${eventId}`);

// NEW: Update attendance status
export const updateAttendance = (reservationId, status) =>
  apiClient.patch(`/admin/mark-attendance`, { reservationId, status });


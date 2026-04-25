import apiClient from "./apiClient";

export const registerForEvent = async (eventId) => {
  const response = await apiClient.post("/reservations/register", { eventId });
  return response.data;
};

export const getMyBookings = async () => {
  const response = await apiClient.get("/reservations/my-bookings");
  return response.data;
};

export const getAllRegistrations = async () => {
  const response = await apiClient.get("/reservations/admin/all");
  return response.data;
};

export const updateBookingStatus = async (id, status) => {
  const response = await apiClient.put(`/reservations/${id}/status`, {
    status,
  });
  return response.data;
};
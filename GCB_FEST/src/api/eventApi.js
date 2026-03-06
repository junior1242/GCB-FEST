import apiClient from "./apiClient";

export const getEvents = async () => (await apiClient.get("/events")).data;

export const createEvent = async (formData) => {
  // IMPORTANT: When sending files, Axios needs multipart/form-data
  const response = await apiClient.post("/events", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteEvent = async (id) =>
  (await apiClient.delete(`/events/${id}`)).data;

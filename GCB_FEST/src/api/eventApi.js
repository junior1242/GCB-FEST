import apiClient from "./apiClient";

export const getEvents = async () => (await apiClient.get("/events")).data;

export const createEvent = async (formData) => {
  //^ IMPORTANT: When sending files, Axios needs form-data
  const response = await apiClient.post("/events", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateEvent = async (id, formData) => {
  const { data } = await apiClient.put(`/events/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteEvent = async (id) =>
  (await apiClient.delete(`/events/${id}`)).data;
<<<<<<< HEAD
<<<<<<< Updated upstream
=======
=======
>>>>>>> a8af5790d94358980f6cf7789c274b18afeaff5c

export const fetchMyPastEvents = async () => {
  const response = await apiClient.get("/events/my-past-events");
  return response.data.data;
<<<<<<< HEAD
};
>>>>>>> Stashed changes
=======
};
>>>>>>> a8af5790d94358980f6cf7789c274b18afeaff5c

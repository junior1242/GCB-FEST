import apiClient from "./apiClient";

export const getCategories = async () => {
  const response = await apiClient.get("/categories");
  return response.data;
};

export const createCategory = async (categoryName) => {
  const response = await apiClient.post("/categories", {
    name: categoryName,
  });
  return response.data;
};

export const updateCategory = async (id, categoryName) => {
  const response = await apiClient.put(`/categories/${id}`, {
    name: categoryName,
  });
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await apiClient.delete(`/categories/${id}`);
  return response.data;
};

import apiClient from "./apiClient";

/**
 * Fetch all categories from the database.
 * Usually used for dropdowns in the Event creation form.
 */
export const getCategories = async () => {
  try {
    const response = await apiClient.get("/categories");
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Admin Only: Create a new category (e.g., "Workshop", "Seminar")
 */
export const createCategory = async (categoryName) => {
  try {
    const response = await apiClient.post("/categories", { name: categoryName });
    return response.data;   
  } catch (error) {
    throw error;
  }
};

/**
 * Admin Only: Delete a category by ID
 */
export const deleteCategory = async (id) => {
  try {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
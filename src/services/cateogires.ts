import axiosInstance from "@/utils/axiosInstance";
import { Category } from "@/types/models";

const homePath = "/cateogry"; // Adjusted to the new API path

export const fetchCategories = async () => {
  try {
    const response = await axiosInstance.get(homePath);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching homes:", error);
    return { success: false, error };
  }
};

export const updateCategory = async (categoryData: Category) => {
  try {
    const response = await axiosInstance.put(
      `${homePath}/${categoryData.id}`,
      categoryData
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error updating home:", error);
    return { success: false, error };
  }
};

export const addCategory = async (categoryData: Category) => {
  try {
    const response = await axiosInstance.post(homePath, categoryData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error adding home:", error);
    return { success: false, error };
  }
};

export const deleteCategory = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`${homePath}/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error deleting home:", error);
    return { success: false, error };
  }
};

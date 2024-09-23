// services/article.ts
import axiosInstance from "@/utils/axiosInstance";

const path = "/articles";

export const fetchArticles = async (search: string = "") => {
  try {
    const response = await axiosInstance.get(path, {
      params: { search },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching articles:", error);
    return { success: false, error };
  }
};

export const addArticle = async (articleData: {
  text: string;
  photo: string;
}) => {
  try {
    const response = await axiosInstance.post(path, articleData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error adding article:", error);
    return { success: false, error };
  }
};

export const updateArticle = async (
  id: number,
  articleData: { text: string; photo: string }
) => {
  try {
    const response = await axiosInstance.put(`${path}/${id}`, articleData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error updating article:", error);
    return { success: false, error };
  }
};

export const deleteArticle = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`${path}/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error deleting article:", error);
    return { success: false, error };
  }
};

export const fetchArticleById = async (id: number) => {
  try {
    const response = await fetch(`/api/articles/${id}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching article by id:", error);
    throw error;
  }
};

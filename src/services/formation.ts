import axios from "axios";
import { FormationType } from "@/types/models";
import axiosInstance from "@/utils/axiosInstance";

const path = "/formation";

export const fetchFormations = async (search: string = "") => {
  try {
    const response = await axiosInstance.get(path + "/formation", {
      params: { search },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching formations:", error);
    return { success: false, error };
  }
};

export const updateFormation = async (formationData: FormationType) => {
  try {
    const response = await axiosInstance.put(
      path + `/update/?id=${formationData.id}`,
      formationData
    );
    return response;
  } catch (error) {
    console.error("Error updating formation:", error);
    throw error;
  }
};

export const addFormation = async (
  formationData: Omit<FormationType, "id">
) => {
  try {
    const response = await axiosInstance.post(path, formationData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error adding formation:", error);
    return { success: false, error };
  }
};

export const deleteFormation = async (id: number) => {
  try {
    const response = await axiosInstance.delete(path + `/update/?id=${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error deleting formation:", error);
    return { success: false, error };
  }
};

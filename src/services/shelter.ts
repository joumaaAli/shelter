import axiosInstance from "@/utils/axiosInstance";

const shelterPath = "/shelters";

// Fetch all shelters with optional region filtering
export const fetchShelters = async (regionId?: number) => {
  try {
    const response = await axiosInstance.get(shelterPath, {
      params: { regionId },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching shelters:", error);
    return { success: false, error };
  }
};

// Add a new shelter with region
export const addShelter = async (name: string, regionId?: number) => {
  try {
    const response = await axiosInstance.post(`${shelterPath}`, {
      name,
      regionId,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error adding shelter:", error);
    return { success: false, error };
  }
};

// Delete a shelter by ID
export const deleteShelter = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`${shelterPath}/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error deleting shelter:", error);
    return { success: false, error };
  }
};

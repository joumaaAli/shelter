import axiosInstance from "@/utils/axiosInstance";

const regionPath = "/regions";

// Fetch all regions
export const fetchRegions = async () => {
  try {
    const response = await axiosInstance.get(regionPath);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching regions:", error);
    return { success: false, error };
  }
};

// Add a new region
export const addRegion = async (name: string) => {
  try {
    const response = await axiosInstance.post(`${regionPath}/create`, { name });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error adding region:", error);
    return { success: false, error };
  }
};

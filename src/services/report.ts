import axiosInstance from "@/utils/axiosInstance";

// Report a house with a message
export const reportHouse = async (reportData: {
  houseId: number;
  message: string;
}) => {
  try {
    const response = await axiosInstance.post("/reports", reportData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error reporting house:", error);
    return { success: false, error };
  }
};

// Fetch all reports
export const fetchReports = async () => {
  try {
    const response = await axiosInstance.get("/reports");
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching reports:", error);
    return { success: false, error };
  }
};

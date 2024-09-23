import axiosInstance from "@/utils/axiosInstance";

const baseEndpoint = "record";

export const fetchRecords = async () => {
  try {
    const response = await axiosInstance.get(baseEndpoint);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching records:", error);
    return { success: false, error };
  }
};

// Fetch a specific record by ID
export const fetchRecordById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`${baseEndpoint}/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error fetching record with id ${id}:`, error);
    return { success: false, error };
  }
};

// Add a new record
export const addRecord = async (recordData: any) => {
  try {
    const response = await axiosInstance.post(baseEndpoint, recordData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error adding record:", error);
    return { success: false, error };
  }
};

// Update an existing record by ID
export const updateRecord = async (id: number, recordData: any) => {
  try {
    const response = await axiosInstance.put(
      `${baseEndpoint}/${id}`,
      recordData
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error updating record with id ${id}:`, error);
    return { success: false, error };
  }
};

// Delete a record by ID
export const deleteRecord = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`${baseEndpoint}/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error deleting record with id ${id}:`, error);
    return { success: false, error };
  }
};

import axios from "axios";

const basePath = "/doctor";

// Fetch all doctors
export const fetchDoctors = async () => {
  try {
    const response = await axios.get(basePath);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return { success: false, error };
  }
};

// Fetch a specific doctor by ID
export const fetchDoctorById = async (id: number) => {
  try {
    const response = await axios.get(`${basePath}/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error fetching doctor with id ${id}:`, error);
    return { success: false, error };
  }
};

// Add a new doctor
export const addDoctor = async (doctorData: any) => {
  try {
    const response = await axios.post(basePath, doctorData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error adding doctor:", error);
    return { success: false, error };
  }
};

// Update an existing doctor by ID
export const updateDoctor = async (id: number, doctorData: any) => {
  try {
    const response = await axios.put(`${basePath}/${id}`, doctorData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error updating doctor with id ${id}:`, error);
    return { success: false, error };
  }
};

// Delete a doctor by ID
export const deleteDoctor = async (id: number) => {
  try {
    const response = await axios.delete(`${basePath}/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error deleting doctor with id ${id}:`, error);
    return { success: false, error };
  }
};

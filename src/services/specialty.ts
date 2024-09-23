import axiosInstance from "@/utils/axiosInstance";
import { Specialty } from "@/types/models";

const basePath = "/specialty";

export const fetchSpecialities = async (inputValue: string) => {
  const response = await axiosInstance.get(
    `${basePath}/specialties?search=${inputValue}`
  );
  const data = response.data;
  return data.map((specialty: Specialty) => ({
    value: specialty.id,
    label: specialty.name,
  }));
};

export const addSpecialty = (specialty: Specialty) =>
  axiosInstance.post(basePath, specialty);

export const updateSpecialty = (id: number, specialty: Specialty) =>
  axiosInstance.put(`${basePath}/${id}`, specialty);

export const deleteSpecialty = (id: number) =>
  axiosInstance.delete(`${basePath}/${id}`);

export const geSspecialty = (id: number) =>
  axiosInstance.get(`${basePath}/${id}`);

export const listSpecialtys = () => axiosInstance.get(basePath);

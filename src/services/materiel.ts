import axiosInstance from "@/utils/axiosInstance";
import { Materiel } from "@/types/models";

const basePath = "/materiel";

export const fetchMateriels = async (inputValue: string) => {
  const response = await axiosInstance.get(
    `${basePath}/materiels?search=${inputValue}`
  );
  const data = response.data;
  return data.map((materiel: Materiel) => ({
    value: materiel.id,
    label: materiel.name,
  }));
};

export const addMateriel = (materiel: Materiel) =>
  axiosInstance.post(basePath, materiel);

export const updateMateriel = (id: number, materiel: Materiel) =>
  axiosInstance.put(`${basePath}/${id}`, materiel);

export const deleteMateriel = (id: number) =>
  axiosInstance.delete(`${basePath}/${id}`);

export const getMateriel = (id: number) =>
  axiosInstance.get(`${basePath}/${id}`);

export const listMateriels = () => axiosInstance.get(basePath);

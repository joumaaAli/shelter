import axiosInstance from "@/utils/axiosInstance";
import { City } from "@/types/models";

const basePath = "/city";

export const fetchCities = async (inputValue: string) => {
  const response = await axiosInstance.get(
    `${basePath}/cities?search=${inputValue}`
  );
  const data = response.data;
  return data.map((city: City) => ({
    value: city.id,
    label: city.name,
  }));
};

export const addCity = (city: City) => axiosInstance.post(basePath, city);

export const updateCity = (id: number, city: City) =>
  axiosInstance.put(`${basePath}/${id}`, city);

export const deleteCity = (id: number) =>
  axiosInstance.delete(`${basePath}/${id}`);

export const getCity = (id: number) => axiosInstance.get(`${basePath}/${id}`);

export const listCitys = () => axiosInstance.get(basePath);

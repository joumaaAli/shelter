import { Praticien, Status } from "@/types/models";
import axiosInstance from "@/utils/axiosInstance";

const basePath = "/praticien";

export const addPraticien = (praticien: any) => {
  return axiosInstance.post(basePath, {
    ...praticien,
    specialties: {
      connect: praticien.specialties.map((specialty: any) => ({
        id: specialty,
      })),
    },
    materiels: {
      connect: praticien.materiels.map((materiel: any) => ({
        id: materiel,
      })),
    },
  });
};

export const updatePraticien = (praticien: any) => {
  const payload = {
    firstName: praticien.firstName,
    lastName: praticien.lastName,
    email: praticien.email,
    RPPSNumber: praticien.RPPSNumber,
    mobileNumber: praticien.mobileNumber,
    cabinetNumber: praticien.cabinetNumber,
    orderNumber: praticien.orderNumber,
  };
  return axiosInstance.put(`${basePath}/update`, payload);
};
export const deletePraticien = (orderNumber: string) =>
  axiosInstance.delete(`${basePath}/${orderNumber}`);

export const getPraticien = (orderNumber: string) =>
  axiosInstance.get(`${basePath}/${orderNumber}`);

export const listPraticiens = () => axiosInstance.get(basePath);

export const fetchPraticiens = (
  searchTerm: string,
  status: Status = Status.PENDING
) => {
  const url = `${
    basePath + "/fetch" + "?name=" + searchTerm + "&status=" + status
  }`;
  return axiosInstance.get(url);
};

export const searchPraticiens = (formik: any) => {
  const queryParams = new URLSearchParams({
    firstName: formik.values.firstName || "",
    lastName: formik.values.lastName || "",
    city: formik.values.city || "",
    specialties: formik.values.specialties || [],
    materiels: formik.values.materiels || [],
    status: Status.ACTIVE,
  }).toString();

  return axiosInstance.get(`${basePath}/search?${queryParams}`);
};

export const updatePraticienStatus = (orderNumber: string, status: string) =>
  axiosInstance.put(`${basePath}/${orderNumber}`, { status });

interface Praticien {
  orderNumber: string;
  firstName: string;
  lastName: string;
  RPPSNumber: string | null;
  cabinetNumber: string;
  mobileNumber: string;
  email: string;
  cityId: number;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  specialties: Specialty[];
  materiels: Materiel[];
  city: City | null;
}

interface City {
  id: number;
  name: string;
  praticiens: Praticien[];
}

interface Specialty {
  id: number;
  name: string;
  praticiens: Praticien[];
}

interface Materiel {
  id: number;
  name: string;
  praticiens: Praticien[];
}

export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
}

interface FormationType {
  id: number;
  theme: string;
  startDate: Date;
  endDate: Date;
  location: string;
  organism: string;
  phoneNumber: string;
  email: string;
  profileImg: string;
}

interface ArticleType {
  id: number;
  text: string;
  photo: string;
}

interface House {
  id: number;
  phoneNumber: string;
  spaceForPeople: string;
  address: string;
  additionnalInformation: string | null;
  name: string | null;
}

export type {
  Praticien,
  City,
  Specialty,
  Materiel,
  FormationType,
  ArticleType,
  House,
};

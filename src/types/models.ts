interface House {
  id: string;
  phoneNumber?: string;
  spaceForPeople?: number | null;
  address?: string | null;
  additionnalInformation?: string | null;
  name?: string | null;
  taken?: boolean;
  region?: Region | null;
  regionId?: number | null;
  validated?: boolean;
  free?: boolean;
  price?: number | null;
}

interface Category {
  id: string;
  name?: string;
  subcategories?: SubCategory[];
}

interface HouseType {
  id: string;
  name?: string;
  region?: Region;
}

interface SubCategory {
  id: string;
  name?: string;
  category?: Category;
}

interface Region {
  id: string;
  name?: string;
}

interface Shelter {
  id: string;
  name?: string;
  createdAt?: Date;
  region?: Region;
  updatedAt?: Date;
}

interface Address {
  address: string;
}

export type {
  House,
  HouseType,
  Region,
  Address,
  Shelter,
  Category,
  SubCategory,
};

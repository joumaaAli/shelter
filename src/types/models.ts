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
}

interface HouseType {
  id: string;
  name?: string;
  region?: Region;
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

export type { House, HouseType, Region, Address, Shelter };

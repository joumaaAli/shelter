interface House {
  id: number;
  phoneNumber: string;
  spaceForPeople: string;
  address: string;
  additionnalInformation: string | null;
  name: string | null;
  taken: boolean;
  region: Region | null;
  regionId: number;
  validated: boolean;
}

interface Region {
  id: number;
  name: string;
}

export type { House, Region };

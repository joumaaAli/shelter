import {Region} from "@/utils/interfaces/region";

export interface Shelter {
    id: number;
    name: string;
    createdAt: Date;
    region: Region;
    updatedAt: Date;
}
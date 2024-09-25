import {Region} from "@/types/models";

export interface Shelter {
    id: number;
    name: string;
    createdAt: Date;
    region: Region;
    updatedAt: Date;
}
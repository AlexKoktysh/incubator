import { ObjectId } from "mongodb";

export type BlogDbType = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
};

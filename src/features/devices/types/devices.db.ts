import { ObjectId } from "mongodb";

export type DevicesDbType = {
    _id: ObjectId;
    issuedAt: string;
    deviceId: string;
    deviceName: string;
    IP: string;
    userId: string;
};

import { database } from "../../../db";
import { DeviceCreateDto, DevicesDbType } from "../types";

export const devicesRepository = {
    async create(newDevice: DeviceCreateDto) {
        const response = await (
            await database.getCollection("DEVICES")
        ).insertOne(newDevice as DevicesDbType);

        return response.insertedId.toString() ?? null;
    },
    async update({ deviceId, iat }: { deviceId: string; iat: number }) {
        const device = await (
            await database.getCollection("DEVICES")
        ).findOne({ deviceId });

        const newDevice = {
            ...device,
            issuedAt: new Date(iat * 1000).toISOString(),
        };
        await (
            await database.getCollection("DEVICES")
        ).updateOne({ deviceId }, { $set: newDevice });
    },
    async deleteAll(userId: string) {
        await (
            await database.getCollection("DEVICES")
        ).deleteMany({
            userId,
        });
    },
    async deleteById(id: string) {
        await (
            await database.getCollection("DEVICES")
        ).deleteOne({
            deviceId: id,
        });
    },
};

import { database } from "../../../db";
import { viewProtection } from "../helpers";
import { DevicesViewType } from "../types";

export const devicesQueryRepository = {
    async getAll(userId: string) {
        const devices = (await (await database.getCollection("DEVICES"))
            .find({ userId }, { projection: viewProtection })
            .toArray()) as unknown as DevicesViewType[];

        return devices;
    },
    async find(id: string) {
        return await (
            await database.getCollection("DEVICES")
        ).findOne({ deviceId: id });
    },
};

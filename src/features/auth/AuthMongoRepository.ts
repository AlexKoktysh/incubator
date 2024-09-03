import { usersCollection } from "../../db/mongo-db";

export const AuthMongoRepository = {
    async find(loginOrEmail: string) {
        const filter = {
            $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
        };
        return await usersCollection.findOne(filter, {
            projection: { _id: 0 },
        });
    },
};

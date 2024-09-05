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
    async findById(id: string) {
        const filter = { id: id };

        return await usersCollection.findOne(filter, {
            projection: { _id: 0, createdAt: 0, password: 0 },
        });
    },
};

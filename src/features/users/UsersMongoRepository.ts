import { ObjectId } from "mongodb";
import { CreateUserDto, QueryPaginationByUserType } from "./types";
import { usersCollection } from "../../db/mongo-db";

export const UsersMongoRepository = {
    async getAll(query: QueryPaginationByUserType) {
        const {
            pageNumber = String(1),
            pageSize = String(10),
            sortBy = "createdAt",
            sortDirection = "desc",
            searchLoginTerm = null,
            searchEmailTerm = null,
        } = query;
        const filter = {
            $or: [
                {
                    login: {
                        $regex: searchLoginTerm ?? "",
                        $options: "i",
                    },
                },
                {
                    email: {
                        $regex: searchEmailTerm ?? "",
                        $options: "i",
                    },
                },
            ].filter(Boolean),
        };
        const totalCount = await usersCollection.countDocuments(filter);
        const users = await usersCollection
            .find(filter, {
                projection: { _id: 0, password: 0 },
                sort: { [sortBy]: sortDirection === "asc" ? 1 : -1 },
                skip: (+pageNumber - 1) * +pageSize,
                limit: parseInt(pageSize),
            })
            .toArray();
        return { users, totalCount };
    },
    async create(user: CreateUserDto) {
        const newUser = {
            id: new ObjectId().toString(),
            ...user,
            createdAt: new Date().toISOString(),
        };
        await usersCollection.insertOne(newUser);
        return await this.find(newUser.id);
    },
    async find(id: string) {
        return await usersCollection.findOne(
            { id: id },
            { projection: { _id: 0, password: 0 } },
        );
    },
    async findByEmail(email: string) {
        return await usersCollection.findOne(
            { email: email },
            { projection: { _id: 0 } },
        );
    },
    async findByLogin(login: string) {
        return await usersCollection.findOne(
            { login: login },
            { projection: { _id: 0 } },
        );
    },
    async del(id: string) {
        await usersCollection.deleteOne({
            id: id,
        });
    },
};

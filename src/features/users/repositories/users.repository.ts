import { CreateUserDto, UserDBType, UserViewType } from "../types";
import { database } from "../../../db/database";
import { usersQueryRepository } from "./users.query-repository";
import { ObjectId } from "mongodb";

export const usersRepository = {
    async create(user: CreateUserDto): Promise<UserViewType | null> {
        const newUser: Partial<UserDBType> = {
            ...user,
            createdAt: new Date().toISOString(),
        };
        const response = await (
            await database.getCollection("USERS")
        ).insertOne(newUser as UserDBType);
        const createdUser = await usersQueryRepository.findByCondition(
            "_id",
            response.insertedId.toString(),
        );
        return createdUser;
    },
    async delete(id: string) {
        await (
            await database.getCollection("USERS")
        ).deleteOne({
            _id: new ObjectId(id),
        });
    },
    async findForLogin(loginOrEmail: string): Promise<UserDBType | null> {
        const filter = {
            $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
        };
        return await (await database.getCollection("USERS")).findOne(filter);
    },
};

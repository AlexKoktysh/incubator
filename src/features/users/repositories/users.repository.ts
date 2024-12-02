import {
    CreateUserDto,
    UpdateUserDto,
    UserDBType,
    UserViewType,
} from "../types";
import { database } from "../../../db/database";
import { usersQueryRepository } from "./users.query-repository";
import { ObjectId } from "mongodb";
import { createUser } from "../helpers";

export const usersRepository = {
    async create(user: CreateUserDto): Promise<UserViewType | null> {
        const newUser = createUser(user);
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
    async update({
        id,
        expirationDate,
        isConfirmed = true,
        confirmationCode = "",
    }: UpdateUserDto) {
        const updatedUser = await (
            await database.getCollection("USERS")
        ).findOne({ _id: new ObjectId(id) });
        const newUser: Partial<UserDBType> = {
            ...updatedUser,
            emailConfirmation: {
                confirmationCode:
                    confirmationCode ??
                    (updatedUser as UserDBType).emailConfirmation
                        .confirmationCode,
                isConfirmed,
                expirationDate:
                    expirationDate ??
                    (updatedUser as UserDBType).emailConfirmation
                        .expirationDate,
            },
        };
        await (
            await database.getCollection("USERS")
        ).updateOne({ _id: new ObjectId(id) }, { $set: newUser });
    },
    async find(email: string): Promise<UserDBType | null> {
        const user = await (
            await database.getCollection("USERS")
        ).findOne({ email });
        return user;
    },
    async findById(id: string): Promise<UserDBType | null> {
        const user = await (
            await database.getCollection("USERS")
        ).findOne({ _id: new ObjectId(id) });
        return user;
    },
};

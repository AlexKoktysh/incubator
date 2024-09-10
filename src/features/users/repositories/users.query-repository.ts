import { ObjectId } from "mongodb";
import { database } from "../../../db";
import { QueryPaginationByUserType, UserDBType, UserViewType } from "../types";
import { viewProtection } from "../helpers";

export const usersQueryRepository = {
    async findByCondition(
        field: string,
        value: string,
    ): Promise<UserViewType | null> {
        const user = (await (
            await database.getCollection("USERS")
        ).findOne(
            { [field]: field === "_id" ? new ObjectId(value) : value },
            { projection: viewProtection },
        )) as UserViewType | null;
        return user;
    },

    async findById(id: string): Promise<UserViewType | null> {
        const user = await this.findByCondition("_id", id);
        return user;
    },

    async getMany(
        query: Required<QueryPaginationByUserType>,
    ): Promise<{ users: UserViewType[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchLoginTerm,
            searchEmailTerm,
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
        const totalCount = await (
            await database.getCollection("USERS")
        ).countDocuments(filter);
        const users = await (
            await database.getCollection("USERS")
        )
            .find(filter, {
                projection: viewProtection,
                sort: { [sortBy]: sortDirection === "asc" ? 1 : -1 },
                skip: (+pageNumber - 1) * +pageSize,
                limit: parseInt(pageSize),
            })
            .toArray();
        return { users: users as unknown as UserViewType[], totalCount };
    },
};
